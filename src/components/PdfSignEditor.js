'use client'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import SignatureCanvas from "react-signature-canvas"
import { Rnd } from "react-rnd"
import { QRCodeCanvas } from 'qrcode.react'
import { useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FilePdf, PenNib, QrCode, DownloadSimple, ArrowLeft, ArrowRight, X, Trash, ArrowCounterClockwise } from '@phosphor-icons/react';

// Setup pdf.js worker using CDN (Safe for Next.js build)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfSignEditor = ({ file, onReset }) => {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const [elements, setElements] = useState([])
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
    const sigCanvas = useRef(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Pre-Generate ID untuk dokumen
    const [docId] = useState(() => `doc-${Math.random().toString(36).substr(2, 9)}`)
    const [signerName, setSignerName] = useState("")

    // Internal state untuk menyimpan gambar TTD asli apapun bentuk output di layarnya
    const [signatureData, setSignatureData] = useState(null)

    function onDocumentLoadSuccess(pdf) {
        setNumPages(pdf?.numPages || null)
        setPageNumber(1)
    }

    const handleSaveSignature = (mode) => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')

            // SIMPAN DATA ASLI KE MEMORI INTERNAL
            setSignatureData(dataURL)

            const newElements = []

            if (mode === 'signature' || mode === 'both') {
                newElements.push({
                    id: Date.now() + 1,
                    type: 'signature',
                    content: dataURL,
                    x: 50,
                    y: 50,
                    width: 150,
                    height: 75,
                    page: pageNumber
                })
            }

            if (mode === 'qrcode' || mode === 'both') {
                newElements.push({
                    id: Date.now() + 2,
                    type: 'qrcode',
                    content: `${window.location.origin}/verify/${docId}`,
                    x: mode === 'both' ? 75 : 50,
                    y: mode === 'both' ? 140 : 50,
                    width: 100,
                    height: 100,
                    page: pageNumber
                })
            }

            setElements([...elements, ...newElements])
            setIsSignatureModalOpen(false)
        } else {
            alert("Harap buat coretan terlebih dahulu!")
        }
    }

    const handleFinishAndDownload = async () => {
        if (!signerName.trim()) {
            alert("Mohon masukkan nama penandatangan terlebih dahulu!")
            return
        }

        if (!signatureData) {
            alert("Mohon klik 'Buat Tanda Tangan' terlebih dahulu!")
            return
        }

        setIsProcessing(true)

        // Simpan metadata ke Firestore
        const docData = {
            fileName: file.name,
            signerName: signerName,
            timestamp: new Date().toISOString(),
            signatureImage: signatureData
        }

        try {
            // Simpan ke Firestore
            await setDoc(doc(db, "verified_documents", docId), docData)

            // 1. Baca file PDF asli
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)

            // 2. Loop semua elemen (TTD & QR) dan tempel ke halaman yang tepat
            for (const el of elements) {
                const pageIndex = el.page - 1
                const pages = pdfDoc.getPages()
                const page = pages[pageIndex]

                // Kalkulasi rasio ukuran (PDF asli vs UI kita yang 800px)
                const pdfWidth = page.getWidth()
                const pdfHeight = page.getHeight()
                const scale = pdfWidth / 800

                const actualWidth = el.width * scale
                const actualHeight = el.height * scale
                const actualX = el.x * scale
                // Koordinat Y pada PDF dimulai dari kiri bawah, jadi harus dibalik (height - Y - heightElement)
                const actualY = pdfHeight - (el.y * scale) - actualHeight

                let imageBytes;
                if (el.type === 'signature') {
                    // Ambil base64 dari signature image
                    const base64Data = el.content.split(',')[1]
                    imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

                    const img = await pdfDoc.embedPng(imageBytes)
                    page.drawImage(img, {
                        x: actualX,
                        y: actualY,
                        width: actualWidth,
                        height: actualHeight
                    })
                } else if (el.type === 'qrcode') {
                    // Ambil base64 dari elemen Canvas QR Code di layar
                    const canvas = document.getElementById(`qr-${el.id}`)
                    if (canvas) {
                        const base64Data = canvas.toDataURL('image/png').split(',')[1]
                        imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

                        const img = await pdfDoc.embedPng(imageBytes)
                        page.drawImage(img, {
                            x: actualX,
                            y: actualY,
                            width: actualWidth,
                            height: actualHeight
                        })
                    }
                }
            }

            // 3. Simpan dan unduh PDF yang sudah diubah
            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `Signed_${file.name}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            alert(`Selesai! PDF berhasil diunduh.\nSilakan buka file PDF-nya dan coba scan QR Codenya, atau buka tab baru ke:\n${window.location.origin}/verify/${docId}`)

        } catch (error) {
            console.error("Error saat merge PDF:", error)
            alert("Terjadi kesalahan saat memproses PDF. Silakan coba lagi.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            {/* ========== TOP BAR ========== */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 max-w-screen-2xl mx-auto">
                    {/* Left: File info & back */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <button
                            onClick={onReset}
                            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                            title="Ganti file"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-500" />
                        </button>
                        <div className="flex items-center gap-2 min-w-0">
                            <FilePdf className="w-5 h-5 text-rose-500 shrink-0" weight="fill" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[250px]">
                                {file.name}
                            </span>
                        </div>
                    </div>

                    {/* Center: Page nav (hidden on very small screens) */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg px-1 py-0.5">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(prev => prev - 1)}
                            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                        </button>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums px-2 select-none">
                            {pageNumber} / {numPages || '—'}
                        </span>
                        <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(prev => prev + 1)}
                            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => {
                                setIsSignatureModalOpen(true)
                                setTimeout(() => sigCanvas.current?.clear(), 100)
                            }}
                            size="sm"
                            className="bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-rose-500/20 h-8 sm:h-9 px-3 sm:px-4"
                        >
                            <PenNib className="w-3.5 h-3.5 sm:mr-1.5" weight="fill" />
                            <span className="hidden sm:inline">Tanda Tangan</span>
                        </Button>
                        <Button
                            onClick={handleFinishAndDownload}
                            disabled={isProcessing}
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-emerald-500/20 h-8 sm:h-9 px-3 sm:px-4"
                        >
                            {isProcessing ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin sm:mr-1.5" />
                            ) : (
                                <DownloadSimple className="w-3.5 h-3.5 sm:mr-1.5" weight="bold" />
                            )}
                            <span className="hidden sm:inline">{isProcessing ? 'Memproses...' : 'Unduh PDF'}</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* ========== SIGNER NAME BAR ========== */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 px-4 sm:px-6 h-12 max-w-screen-2xl mx-auto">
                    <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        Penandatangan
                    </label>
                    <input
                        type="text"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Masukkan nama Anda..."
                        className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 bg-transparent border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                    {signatureData && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                            <PenNib className="w-3 h-3" weight="fill" />
                            TTD Sudah Dibuat
                        </span>
                    )}
                </div>
            </div>

            {/* Mobile page nav */}
            <div className="sm:hidden flex items-center justify-center gap-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => prev - 1)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <span className="text-xs font-semibold text-slate-500 tabular-nums select-none">
                    Halaman {pageNumber} dari {numPages || '—'}
                </span>
                <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(prev => prev + 1)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
            </div>

            {/* ========== PDF CANVAS AREA ========== */}
            <div className="flex-1 flex items-start justify-center overflow-auto py-6 px-4 sm:px-6">
                <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg shadow-slate-200/80 dark:shadow-slate-950/80 ring-1 ring-slate-200/60 dark:ring-slate-800 overflow-hidden">
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="flex justify-center"
                        loading={
                            <div className="flex items-center justify-center p-20">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm text-slate-400">Memuat dokumen...</p>
                                </div>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            width={800}
                        />
                    </Document>

                    {/* Render elemen Draggable (Stiker TTD / QR Code) */}
                    {elements.filter(el => el.page === pageNumber).map((el) => (
                        <Rnd
                            key={el.id}
                            default={{
                                x: el.x,
                                y: el.y,
                                width: el.width,
                                height: el.height,
                            }}
                            bounds="parent"
                            onDragStop={(e, d) => {
                                const newElements = elements.map(item => item.id === el.id ? { ...item, x: d.x, y: d.y } : item)
                                setElements(newElements)
                            }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                const newElements = elements.map(item => item.id === el.id ? {
                                    ...item,
                                    width: parseInt(ref.style.width),
                                    height: parseInt(ref.style.height),
                                    ...position
                                } : item)
                                setElements(newElements)
                            }}
                            className="group border-2 border-transparent hover:border-rose-400/50 hover:border-dashed absolute cursor-move z-50 transition-colors"
                        >
                            {el.type === 'signature' ? (
                                <img src={el.content} alt="Signature" className="w-full h-full object-contain pointer-events-none" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center pointer-events-none bg-white rounded-sm">
                                    <QRCodeCanvas id={`qr-${el.id}`} value={el.content} size={512} style={{ width: '100%', height: '100%' }} />
                                </div>
                            )}
                            <button
                                onClick={() => setElements(elements.filter(item => item.id !== el.id))}
                                className="absolute -top-2.5 -right-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-[60] shadow-md"
                            >
                                <X className="w-3 h-3" weight="bold" />
                            </button>
                        </Rnd>
                    ))}
                </div>
            </div>

            {/* ========== SIGNATURE MODAL ========== */}
            <Dialog open={isSignatureModalOpen} onOpenChange={setIsSignatureModalOpen}>
                <DialogContent className="sm:max-w-[650px] rounded-2xl p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-0">
                        <DialogTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Buat Tanda Tangan
                        </DialogTitle>
                        <p className="text-sm text-slate-400 mt-1">
                            Gunakan mouse atau jari Anda untuk menggambar tanda tangan di bawah ini
                        </p>
                    </DialogHeader>

                    {/* Canvas Area */}
                    <div className="mx-6 mt-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex justify-center overflow-hidden relative">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{
                                className: 'w-full sm:w-[600px] h-[200px] sm:h-[260px] bg-transparent cursor-crosshair'
                            }}
                        />
                        {/* Signature line hint */}
                        <div className="absolute bottom-10 left-8 right-8 border-b border-slate-200 dark:border-slate-700 pointer-events-none" />
                        <span className="absolute bottom-4 left-8 text-[10px] text-slate-300 dark:text-slate-600 pointer-events-none uppercase tracking-widest font-medium">
                            Tanda tangan di atas garis
                        </span>
                    </div>

                    {/* Clear Button */}
                    <div className="flex justify-start px-6 mt-2">
                        <button
                            onClick={() => sigCanvas.current?.clear()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors"
                        >
                            <ArrowCounterClockwise className="w-3.5 h-3.5" />
                            Hapus & gambar ulang
                        </button>
                    </div>

                    {/* Output Options */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-4 px-6 py-5 bg-slate-50/50 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                            Tampilkan di PDF sebagai
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button
                                onClick={() => handleSaveSignature('signature')}
                                className="relative overflow-hidden group flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all text-left"
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-rose-200/60 dark:via-rose-200/30 to-transparent group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out z-0" />
                                <div className="relative z-10 w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center shrink-0 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-colors">
                                    <PenNib className="w-4 h-4 text-rose-500" weight="fill" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Coretan Saja</p>
                                    <p className="text-[11px] text-slate-400">TTD tinta digital</p>
                                </div>
                            </button>
                            <button
                                onClick={() => handleSaveSignature('qrcode')}
                                className="relative overflow-hidden group flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all text-left"
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-sky-200/60 dark:via-sky-200/30 to-transparent group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out z-0" />
                                <div className="relative z-10 w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center shrink-0 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/40 transition-colors">
                                    <QrCode className="w-4 h-4 text-sky-500" weight="fill" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">QR Code Saja</p>
                                    <p className="text-[11px] text-slate-400">Verifikasi digital</p>
                                </div>
                            </button>
                            <button
                                onClick={() => handleSaveSignature('both')}
                                className="relative overflow-hidden group flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all text-left"
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-200/60 dark:via-emerald-200/30 to-transparent group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out z-0" />
                                <div className="relative z-10 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                                    <PenNib className="w-4 h-4 text-emerald-600" weight="fill" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Keduanya</p>
                                    <p className="text-[11px] text-emerald-500 dark:text-emerald-400">Coretan + QR Code</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PdfSignEditor
