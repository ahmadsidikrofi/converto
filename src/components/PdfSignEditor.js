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

// Setup pdf.js worker using CDN (Safe for Next.js build)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfSignEditor = ({ file }) => {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const [elements, setElements] = useState([])
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
    const sigCanvas = useRef(null)

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
                    x: mode === 'both' ? 75 : 50, // Kalau keduanya, taruh agak di tengah bawah
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
            alert("Mohon klik '+ Buat Tanda Tangan' terlebih dahulu!")
            return
        }
        
        // Simpan metadata ke Firestore
        const docData = {
            fileName: file.name,
            signerName: signerName,
            timestamp: new Date().toISOString(),
            signatureImage: signatureData // Tarik dari memory internal, bukan dari layar
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
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-8 w-full">
            {/* Form & Actions */}
            <div className="flex max-sm:flex-col gap-4 mb-2 bg-white p-4 rounded-xl shadow-sm border w-full max-w-[800px] justify-between items-center">
                <div className="flex flex-col w-full sm:w-1/3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Penandatangan</label>
                    <input 
                        type="text" 
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Contoh: Ahmad Sidik"
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <Button onClick={() => {
                        setIsSignatureModalOpen(true)
                        setTimeout(() => sigCanvas.current?.clear(), 100)
                    }} className="bg-rose-100 text-rose-700 hover:bg-rose-200 shadow-none font-semibold px-6">
                        + Buat Tanda Tangan
                    </Button>
                    <Button onClick={handleFinishAndDownload} className="bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md ml-4">
                        Selesai & Unduh
                    </Button>
                </div>
            </div>


            <div className="flex justify-between w-full max-w-[800px]">
                <Button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => prev - 1)}
                    variant="outline"
                >
                    Previous Page
                </Button>
                <p className="text-lg font-medium flex items-center">
                    Page {pageNumber} of {numPages || '--'}
                </p>
                <Button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(prev => prev + 1)}
                    variant="outline"
                >
                    Next Page
                </Button>
            </div>

            {/* Area Editor PDF */}
            <div className="border-2 border-slate-200 rounded-xl shadow-sm bg-slate-50 relative overflow-hidden flex justify-center w-[800px] min-h-[500px]">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex justify-center w-full"
                    loading={<div className="p-10 text-slate-500 animate-pulse">Loading PDF...</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={800} // Fixed width untuk memudahkan kalkulasi koordinat
                        className="shadow-md"
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
                        className="group border-2 border-transparent hover:border-dashed hover:border-slate-400 focus:border-blue-500 absolute cursor-move z-50"
                    >
                        {el.type === 'signature' ? (
                            <img src={el.content} alt="Signature" className="w-full h-full object-contain pointer-events-none" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center pointer-events-none">
                                <QRCodeCanvas id={`qr-${el.id}`} value={el.content} size={512} style={{ width: '100%', height: '100%' }} />
                            </div>
                        )}
                        <button
                            onClick={() => setElements(elements.filter(item => item.id !== el.id))}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-[60]"
                        >
                            x
                        </button>
                    </Rnd>
                ))}
            </div>

            {/* Modal Pembuatan Tanda Tangan */}
            <Dialog open={isSignatureModalOpen} onOpenChange={setIsSignatureModalOpen}>
                <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                        <DialogTitle>Buat Tanda Tangan Anda</DialogTitle>
                    </DialogHeader>
                    <div className="border rounded-xl bg-slate-50 flex justify-center p-2">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ className: 'w-[600px] h-[300px] bg-transparent cursor-crosshair' }}
                        />
                    </div>
                    <DialogFooter className="flex flex-col gap-3 w-full mt-4 border-t pt-4">
                        <p className="text-sm text-slate-500 font-medium text-center w-full mb-1">Bagaimana Anda ingin menampilkannya di PDF?</p>
                        <div className="flex gap-3 justify-center w-full max-sm:flex-col">
                            <Button variant="outline" onClick={() => handleSaveSignature('signature')} className="flex-1 text-rose-600 border-rose-600 hover:bg-rose-50">
                                Tempel Coretan Saja
                            </Button>
                            <Button variant="outline" onClick={() => handleSaveSignature('qrcode')} className="flex-1 text-sky-600 border-sky-600 hover:bg-sky-50">
                                Tempel QR Code Saja
                            </Button>
                            <Button onClick={() => handleSaveSignature('both')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                                Tempel Keduanya
                            </Button>
                        </div>
                        <Button variant="ghost" onClick={() => sigCanvas.current?.clear()} className="mt-2 text-slate-400 hover:text-slate-600">
                            Hapus & Ulang Buat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PdfSignEditor
