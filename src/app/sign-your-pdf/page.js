'use client'
import Header from "@/components/Header"
import { useState } from "react"
import ReactDropzone from "react-dropzone"
import { FilePdf, UploadSimple, ShieldCheck, PenNib, QrCode } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { appToast as toast } from "@/store/useToastStore"

const PdfSignEditor = dynamic(() => import("@/components/PdfSignEditor"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-20">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Memuat editor...</p>
            </div>
        </div>
    )
})

const SignYourPdfPage = () => {
    const [file, setFile] = useState(null)

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
        <main className="flex flex-col items-center w-full min-h-screen">
            {/* Hero Section - Only show when no file */}
            {!file && (
                <div className="w-full px-6 pt-10 pb-6">
                    <Header
                        title="e-Sign PDF"
                        description="Tandatangani dokumen PDF Anda secara digital dengan aman dan cepat. Lengkap dengan QR Code verifikasi — bebas ojek dokumen fisik!"
                    />

                    {/* Feature badges */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        {[
                            { icon: <PenNib className="w-4 h-4" weight="fill" />, text: "Tanda Tangan Digital" },
                            { icon: <QrCode className="w-4 h-4" weight="fill" />, text: "QR Code Verifikasi" },
                            { icon: <ShieldCheck className="w-4 h-4" weight="fill" />, text: "Aman & Terenkripsi" },
                        ].map((badge, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                                {badge.icon}
                                {badge.text}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`w-full ${!file ? 'max-w-3xl px-6 pb-10' : ''}`}>
                {!file ? (
                    /* === UPLOAD STATE === */
                    <div className="mt-6">
                        <ReactDropzone
                            onDrop={handleUpload}
                            onDropRejected={handleRejected}
                            accept={{ "application/pdf": [".pdf"] }}
                            maxFiles={1}
                            maxSize={2 * 1024 * 1024}
                        >
                            {({ getRootProps, getInputProps, isDragActive }) => (
                                <div
                                    {...getRootProps()}
                                    className={`relative group border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-out
                                        ${isDragActive
                                            ? 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/20 scale-[1.01]'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-6">
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300
                                            ${isDragActive
                                                ? 'bg-rose-100 dark:bg-rose-900/40'
                                                : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/30'
                                            }`}
                                        >
                                            <UploadSimple
                                                className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300
                                                    ${isDragActive ? 'text-rose-500' : 'text-slate-400 group-hover:text-rose-400'}`}
                                                weight="duotone"
                                            />
                                        </div>
                                        <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                                            {isDragActive ? "Lepaskan file PDF di sini" : "Pilih atau seret file PDF ke sini"}
                                        </p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500">
                                            Format PDF • Maksimal 2 MB
                                        </p>
                                    </div>
                                </div>
                            )}
                        </ReactDropzone>
                    </div>
                ) : (
                    /* === EDITOR STATE — Full Width === */
                    <PdfSignEditor file={file} onReset={() => setFile(null)} />
                )}
            </div>
        </main>
    )
}

export default SignYourPdfPage
