'use client'
import { useEffect, useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from './ui/button';
import SignatureModal from './SignatureModal';
import { Rnd } from "react-rnd"
import { QRCodeCanvas } from 'qrcode.react'
import { PDFDocument } from 'pdf-lib';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FilePdf, PenNib, QrCode, DownloadSimple, ArrowLeft, ArrowRight, X, Trash, ArrowCounterClockwise, Info, FloppyDisk } from '@phosphor-icons/react';
import { appToast as toast } from "@/store/useToastStore";

// Setup pdf.js worker using CDN (Safe for Next.js build)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Helper untuk konversi DataURL (base64) ke Uint8Array secara aman
function dataUrlToUint8Array(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return null
    try {
        const base64Index = dataUrl.indexOf(',')
        const base64 = base64Index !== -1 ? dataUrl.slice(base64Index + 1) : dataUrl
        const cleanBase64 = base64.replace(/[\s\r\n]+/g, '')
        const binaryString = atob(cleanBase64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes
    } catch (e) {
        console.error("Gagal mendecode DataURL ke Uint8Array:", e)
        return null
    }
}

// Fungsi Hashing SHA-256 dengan fallback aman untuk non-HTTPS
async function calculateSHA256(bufferSource) {
    try {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', bufferSource)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        }
    } catch (e) {
        console.warn("Crypto subtle SHA-256 fallback triggered:", e)
    }
    // Fallback hash jika crypto.subtle tidak tersedia (non-HTTPS / webview)
    let hash = 0
    const bytes = new Uint8Array(bufferSource)
    for (let i = 0; i < bytes.length; i++) {
        hash = ((hash << 5) - hash) + bytes[i]
        hash |= 0
    }
    return Math.abs(hash).toString(16).padStart(16, '0') + Date.now().toString(16)
}

const PdfSignEditor = ({ file, onReset }) => {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const [elements, setElements] = useState([])
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    // Pre-Generate ID untuk dokumen
    const [docId] = useState(() => `doc-${Math.random().toString(36).substr(2, 9)}`)
    const [signerName, setSignerName] = useState("")

    // Internal state untuk menyimpan gambar TTD asli apapun bentuk output di layarnya
    const [signatureData, setSignatureData] = useState(null)

    const [pageHeight, setPageHeight] = useState(1131) // Tinggi A4 default untuk lebar 800px
    const [scaleFactor, setScaleFactor] = useState(1)
    const containerRef = useRef(null)

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return
            // Ambil parent dari wrapper berskala
            const parent = containerRef.current.parentElement?.parentElement
            if (!parent) return
            const parentWidth = parent.clientWidth - 32 // Kurangi padding horizontal (px-4 = 16px * 2)
            if (parentWidth < 800) {
                setScaleFactor(parentWidth / 800)
            } else {
                setScaleFactor(1)
            }
        }
        updateScale()
        window.addEventListener('resize', updateScale)
        const timer = setTimeout(updateScale, 150)
        return () => {
            window.removeEventListener('resize', updateScale)
            clearTimeout(timer)
        }
    }, [pageNumber, numPages])

    function onDocumentLoadSuccess(pdf) {
        setNumPages(pdf?.numPages || null)
        setPageNumber(1)
    }

    const handleApplySignature = (dataURL, mode) => {
        if (!dataURL) return
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

        setElements(prev => [...prev, ...newElements])
        // toast.success("Tanda tangan berhasil ditempel ke dokumen!", {
        //     position: 'top-center',
        //     style: { background: "#dcfce7", color: "#166534", border: "1px solid #4ade80" },
        // })
    }

    const handleFinishAndDownload = async () => {
        if (!signerName || !signerName.trim()) {
            toast.info("Mohon masukkan nama penandatangan terlebih dahulu", {
                position: 'top-center',
                style: { background: "#fee2e2", color: "#991b1b", border: "1px solid #b91c1c" },
            })
            return
        }

        if (!signatureData && elements.length === 0) {
            toast.info("Mohon klik 'Buat Tanda Tangan' terlebih dahulu", {
                position: 'top-center',
                style: { background: "#fee2e2", color: "#991b1b", border: "1px solid #b91c1c" },
            })
            return
        }

        setIsProcessing(true)

        try {
            // 1. Baca file PDF asli
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
            const pages = pdfDoc.getPages()

            // 2. Loop semua elemen (TTD & QR) dan tempel ke halaman yang tepat
            for (const el of elements) {
                const pageIndex = (el.page || 1) - 1
                if (pageIndex < 0 || pageIndex >= pages.length) continue

                const page = pages[pageIndex]

                // Kalkulasi rasio ukuran (PDF asli vs UI kita yang 800px)
                const pdfWidth = page.getWidth()
                const pdfHeight = page.getHeight()
                const scale = pdfWidth / 800

                const actualWidth = (el.width || 150) * scale
                const actualHeight = (el.height || 75) * scale
                const actualX = (el.x || 50) * scale
                // Koordinat Y pada PDF dimulai dari kiri bawah, jadi harus dibalik (height - Y - heightElement)
                const actualY = pdfHeight - ((el.y || 50) * scale) - actualHeight

                let imageBytes = null
                if (el.type === 'signature') {
                    imageBytes = dataUrlToUint8Array(el.content)
                } else if (el.type === 'qrcode') {
                    const canvas = document.getElementById(`qr-offscreen-${el.id}`) || document.getElementById(`qr-${el.id}`)
                    if (canvas) {
                        try {
                            const dataUrl = canvas.toDataURL('image/png')
                            imageBytes = dataUrlToUint8Array(dataUrl)
                        } catch (canvasErr) {
                            console.error("Gagal export QR canvas:", canvasErr)
                        }
                    }
                }

                if (imageBytes && imageBytes.length > 0) {
                    let img = null
                    try {
                        img = await pdfDoc.embedPng(imageBytes)
                    } catch (pngErr) {
                        try {
                            img = await pdfDoc.embedJpg(imageBytes)
                        } catch (jpgErr) {
                            console.error("Gagal embed gambar TTD/QR ke PDF:", pngErr, jpgErr)
                        }
                    }

                    if (img) {
                        page.drawImage(img, {
                            x: actualX,
                            y: actualY,
                            width: actualWidth,
                            height: actualHeight
                        })
                    }
                }
            }

            // 3. Simpan (Merge) PDF ke dalam bentuk Bytes
            const pdfBytes = await pdfDoc.save()

            // 4. Unduh PDF ke komputer user langsung (prioritas utama)
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const link = document.createElement('a')
            const blobUrl = URL.createObjectURL(blob)
            link.href = blobUrl
            const safeFileName = (file.name || 'document').replace(/\.pdf$/i, '')
            link.download = `Signed_${safeFileName}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)

            // 5. Kalkulasi Hash & Simpan metadata verifikasi ke Firestore (Non-blocking)
            try {
                const fileHash = await calculateSHA256(pdfBytes)
                const docData = {
                    fileName: file.name || "document.pdf",
                    signerName: signerName,
                    timestamp: new Date().toISOString(),
                    signatureImage: signatureData || "",
                    fileHash: fileHash
                }
                await setDoc(doc(db, "verified_documents", docId), docData, { merge: true })
            } catch (dbErr) {
                console.warn("Gagal menyimpan metadata verifikasi ke Firestore (PDF tetap terunduh):", dbErr)
            }

            toast.success(`PDF berhasil ditandatangani & diunduh`, {
                position: 'top-center',
                style: { background: "#dcfce7", color: "#166534", border: "1px solid #4ade80" },
            })

        } catch (error) {
            console.error("Error saat memproses PDF:", error)
            toast.error("Terjadi kesalahan saat memproses file PDF: " + (error?.message || "Silakan coba lagi"), {
                position: 'top-center',
                style: { background: "#fee2e2", color: "#991b1b", border: "1px solid #b91c1c" },
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="w-full min-h-screen dark:bg-slate-950/50 pb-28 lg:pb-12 mt-5">
            {/* Minimal Header Bar (Non-sticky, inline with document flow) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
                <div className="flex items-center justify-between bg-card border border-border/80 rounded-2xl p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={onReset}
                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                            title="Ganti file"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        </button>
                        <div className="flex items-center gap-2.5 min-w-0">
                            <FilePdf className="w-6 h-6 text-rose-500 shrink-0" weight="fill" />
                            <div>
                                <h3 className="text-sm font-semibold text-foreground truncate max-w-[150px] sm:max-w-[300px]">
                                    {file.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Editor Tanda Tangan PDF
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Page Navigation Controls */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(prev => prev - 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-background hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-foreground" />
                        </button>
                        <span className="text-xs font-bold tabular-nums px-2 select-none">
                            {pageNumber} / {numPages || '—'}
                        </span>
                        <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(prev => prev + 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-background hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-xs"
                        >
                            <ArrowRight className="w-3.5 h-3.5 text-foreground" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Workspace Layout (Canvas + Floating Sidebar) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8 items-start justify-center">

                {/* ========== PDF CANVAS AREA ========== */}
                <div className="flex-1 w-full flex justify-center overflow-auto py-2 shadow-2xl">
                    <div
                        style={{
                            width: `${800 * scaleFactor}px`,
                            height: `${pageHeight * scaleFactor}px`,
                            overflow: 'hidden'
                        }}
                        className="shrink-0 transition-all duration-150"
                    >
                        <div
                            ref={containerRef}
                            style={{
                                transform: `scale(${scaleFactor})`,
                                transformOrigin: 'top left',
                                width: '800px',
                                height: `${pageHeight}px`
                            }}
                            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200/80 dark:ring-slate-800"
                        >
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
                                    onLoadSuccess={(page) => {
                                        const origWidth = page.width || page.getViewport({ scale: 1 }).width;
                                        const origHeight = page.height || page.getViewport({ scale: 1 }).height;
                                        setPageHeight(800 * (origHeight / origWidth));
                                    }}
                                />
                            </Document>
                        </div>

                        {/* Render elemen Draggable (Stiker TTD / QR Code) */}
                        {elements.filter(el => el.page === pageNumber).map((el) => (
                            <Rnd
                                key={el.id}
                                scale={scaleFactor}
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
                                    <img src={el.content} alt="Signature" className="w-full h-full object-cover pointer-events-none" />
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

                {/* Hidden Offscreen QR Code container so QR codes from all pages are always present in DOM */}
                <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0 invisible" aria-hidden="true">
                    {elements.filter(el => el.type === 'qrcode').map((el) => (
                        <QRCodeCanvas
                            key={`offscreen-qr-${el.id}`}
                            id={`qr-offscreen-${el.id}`}
                            value={el.content}
                            size={512}
                        />
                    ))}
                </div>

                {/* ========== FLOATING SIDEBAR CARD (Desktop - Sticky on right) ========== */}
                <div className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-28">
                    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                            <PenNib className="w-5 h-5 text-rose-500" weight="fill" />
                            <h4 className="font-bold text-sm tracking-tight text-foreground">Aksi Tanda Tangan</h4>
                        </div>

                        {/* Input Penandatangan */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Nama Penandatangan
                            </label>
                            <input
                                type="text"
                                value={signerName}
                                onChange={(e) => setSignerName(e.target.value)}
                                placeholder="Ketik nama Anda di sini..."
                                className="w-full h-10 px-3 text-sm font-medium bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all placeholder:text-muted-foreground/60"
                            />
                        </div>

                        {/* Buat TTD Button */}
                        <div className="space-y-2">
                            <Button
                                onClick={() => setIsSignatureModalOpen(true)}
                                className="relative overflow-hidden group w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl h-11 flex items-center justify-center gap-2 shadow-md shadow-rose-500/20"
                            >
                                <PenNib className="w-4 h-4 relative z-10" weight="fill" />
                                <span className="relative z-10">Buat Tanda Tangan Digital</span>
                            </Button>

                        </div>

                        <hr className="border-border/60" />

                        {/* Unduh PDF Button */}
                        <Button
                            onClick={handleFinishAndDownload}
                            disabled={isProcessing}
                            className="relative overflow-hidden group w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 text-base transition-all"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                                    <span className="relative z-10">Memproses PDF...</span>
                                </>
                            ) : (
                                <>
                                    <DownloadSimple className="w-5 h-5 relative z-10" weight="bold" />
                                    <span className="relative z-10">Unduh Hasil PDF</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

            </div>

            {/* ========== FLOATING DOCK (Mobile / Tablet Only) ========== */}
            <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-3 flex items-center justify-between gap-3">
                <Button
                    onClick={() => setIsSignatureModalOpen(true)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl h-11 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                    <PenNib className="w-4 h-4" weight="fill" />
                    Buat TTD
                </Button>

                <Button
                    onClick={handleFinishAndDownload}
                    disabled={isProcessing}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-11 text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                    {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <DownloadSimple className="w-4 h-4" weight="bold" />
                    )}
                    Unduh PDF
                </Button>
            </div>

            {/* ========== STANDALONE SIGNATURE MODAL (With Cloud & Local Storage) ========== */}
            <SignatureModal
                isOpen={isSignatureModalOpen}
                onOpenChange={setIsSignatureModalOpen}
                onApplySignature={handleApplySignature}
                signerName={signerName}
                setSignerName={setSignerName}
            />
        </div>
    )
}

export default PdfSignEditor
