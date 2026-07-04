'use client'
import Header from "@/components/Header"
import { useState } from "react"
import ReactDropzone from "react-dropzone"
import { FilePdf, UploadSimple } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { useToast } from "@/components/ui/use-toast"

const PdfSignEditor = dynamic(() => import("@/components/PdfSignEditor"), {
    ssr: false,
    loading: () => <div className="p-10 text-slate-500 animate-pulse">Loading Editor...</div>
})

const SignYourPdfPage = () => {
    const [file, setFile] = useState(null)
    const { toast } = useToast()

    const handleUpload = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
        }
    }

    const handleRejected = (fileRejections) => {
        const rejection = fileRejections[0]
        if (rejection.errors[0].code === 'file-too-large') {
            toast({
                variant: 'destructive',
                title: 'Ukuran file terlalu besar',
                description: 'Maksimal ukuran file PDF yang diperbolehkan adalah 2 MB.',
                duration: 4000
            })
        } else {
            toast({
                variant: 'destructive',
                title: 'Gagal mengunggah file',
                description: 'Pastikan file yang Anda unggah berformat .pdf',
                duration: 4000
            })
        }
    }

    return (
        <main className="flex flex-col items-center p-10 w-full min-h-screen">
            <Header
                title="Sign Your PDF"
                description="Tandatangani dokumen PDF Anda dengan aman dan cepat. Lengkap dengan QR Code verifikasi bebas ojek dokumen fisik"
            />
            
            <div className="w-full max-w-4xl mt-10">
                {!file ? (
                    <ReactDropzone
                        onDrop={handleUpload}
                        onDropRejected={handleRejected}
                        accept={{"application/pdf": [".pdf"]}}
                        maxFiles={1}
                        maxSize={2 * 1024 * 1024} // 2 MB
                    >
                        {({ getRootProps, getInputProps, isDragActive }) => (
                            <div 
                                {...getRootProps()} 
                                className={`border-dashed border-2 p-10 h-64 rounded-3xl cursor-pointer flex flex-col items-center justify-center transition-colors
                                    ${isDragActive ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-slate-400'}`}
                            >
                                <input {...getInputProps()} />
                                <UploadSimple className="w-16 h-16 text-slate-400 mb-4" />
                                <p className="text-xl font-semibold text-slate-700">
                                    {isDragActive ? "Drop file PDF Anda di sini" : "Pilih atau Drag & Drop file PDF"}
                                </p>
                                <p className="text-sm text-slate-500 mt-2">Hanya menerima format PDF</p>
                            </div>
                        )}
                    </ReactDropzone>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full flex justify-between items-center bg-slate-100 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <FilePdf className="w-8 h-8 text-red-500" />
                                <span className="font-medium text-slate-700">{file.name}</span>
                            </div>
                            <button 
                                onClick={() => setFile(null)} 
                                className="text-sm text-red-500 hover:underline font-medium"
                            >
                                Ganti File
                            </button>
                        </div>
                        
                        <PdfSignEditor file={file} />
                    </div>
                )}
            </div>
        </main>
    )
}

export default SignYourPdfPage