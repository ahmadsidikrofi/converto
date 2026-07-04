'use client'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import SignatureCanvas from "react-signature-canvas"
import { Rnd } from "react-rnd"
import { QRCodeSVG } from 'qrcode.react'
import { useRef } from 'react';

// Setup pdf.js worker using Next.js App Router pattern
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PdfSignEditor = ({ file }) => {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const [elements, setElements] = useState([])
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
    const sigCanvas = useRef(null)

    function onDocumentLoadSuccess(pdf) {
        setNumPages(pdf?.numPages || null)
        setPageNumber(1)
    }

    const handleSaveSignature = () => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
            const newElement = {
                id: Date.now(),
                type: 'signature',
                content: dataURL,
                x: 50,
                y: 50,
                width: 150,
                height: 75,
                page: pageNumber
            }
            setElements([...elements, newElement])
            setIsSignatureModalOpen(false)
        }
    }

    const addQRCodeElement = () => {
        const newElement = {
            id: Date.now(),
            type: 'qrcode',
            content: 'https://converto.id/verify/...',
            x: 50,
            y: 150,
            width: 100,
            height: 100,
            page: pageNumber
        }
        setElements([...elements, newElement])
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-8 w-full">
            {/* Toolbar untuk menambahkan elemen */}
            <div className="flex gap-4 mb-2 bg-white p-4 rounded-xl shadow-sm border w-full max-w-[800px] justify-center">
                <Button onClick={() => {
                    setIsSignatureModalOpen(true)
                    setTimeout(() => sigCanvas.current?.clear(), 100)
                }} className="bg-rose-600 hover:bg-rose-700 rounded-full">
                    + Tambah Coretan TTD
                </Button>
                <Button onClick={addQRCodeElement} variant="outline" className="rounded-full border-rose-600 text-rose-600 hover:bg-rose-50">
                    + Tambah QR Code
                </Button>
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
                                <QRCodeSVG value={el.content} width="100%" height="100%" />
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
                    <DialogFooter className="flex justify-between items-center w-full mt-4">
                        <Button variant="ghost" onClick={() => sigCanvas.current?.clear()}>Ulang buat</Button>
                        <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSaveSignature}>Simpan TTD</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PdfSignEditor
