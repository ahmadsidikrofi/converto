'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle, FilePdf, User, CalendarBlank, Hash, SealCheck, WarningCircle, UploadSimple, ShieldCheck } from '@phosphor-icons/react'
import Header from "@/components/Header"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

// Fungsi Hashing SHA-256
async function calculateSHA256(arrayBuffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function VerifyPage() {
    const params = useParams()
    const { id } = params

    const [docData, setDocData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [integrityStatus, setIntegrityStatus] = useState('idle') // idle | loading | valid | tampered

    useEffect(() => {
        async function fetchDocument() {
            if (!id) return
            try {
                const docRef = doc(db, "verified_documents", id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setDocData(docSnap.data())
                }
            } catch (error) {
                console.error("Gagal mengambil data verifikasi dari Firestore:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDocument()
    }, [id])

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file || !docData?.fileHash) return

        setIntegrityStatus('loading')

        try {
            const arrayBuffer = await file.arrayBuffer()
            const hash = await calculateSHA256(arrayBuffer)

            if (hash === docData.fileHash) {
                setIntegrityStatus('valid')
            } else {
                setIntegrityStatus('tampered')
            }
        } catch (error) {
            console.error("Error hashing file:", error)
            setIntegrityStatus('error')
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    })

    return (
        <main className="flex flex-col items-center w-full min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pt-10 pb-20 px-6 relative overflow-hidden">
            {/* Background elements for premium feel */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-950/10 z-0 pointer-events-none" />

            <div className="relative z-0 w-full flex flex-col items-center">
                {/* <Header
                    title="Verifikasi Dokumen"
                    description="Sistem Pengecekan Otentikasi Dokumen Digital Converto"
                /> */}

                <div className="w-full max-w-3xl bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-5">
                            <div className="relative flex items-center justify-center w-20 h-20">
                                <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
                                <SealCheck className="w-8 h-8 text-rose-500 absolute" weight="fill" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
                                MEMVERIFIKASI DOKUMEN...
                            </p>
                        </div>
                    ) : docData ? (
                        <div className="flex flex-col">
                            {/* Header Section */}
                            <div className="flex flex-col items-center text-center pb-10 border-b border-slate-100 dark:border-slate-800">
                                <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-20"></div>
                                    <SealCheck className="w-14 h-14 text-emerald-500" weight="fill" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                                    Data Tanda Tangan Ditemukan
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg">
                                    Identitas penandatangan tercatat resmi di sistem Converto. Untuk membuktikan bahwa file tidak diubah/dipalsukan, silakan cek integritas dokumen di bawah.
                                </p>
                            </div>

                            {/* Metadata Section */}
                            <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6">
                                <div className="space-y-7">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/50">
                                            <Hash className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">ID Dokumen</p>
                                            <p className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 inline-block">
                                                {id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/50">
                                            <FilePdf className="w-5 h-5 text-rose-500" weight="fill" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Nama File</p>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words leading-relaxed">
                                                {docData.fileName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900/50">
                                            <User className="w-5 h-5 text-sky-500" weight="fill" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Penandatangan</p>
                                            <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                                                {docData.signerName || "Pengguna Converto"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/50">
                                            <CalendarBlank className="w-5 h-5 text-amber-500" weight="fill" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Tanggal Tanda Tangan</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {new Date(docData.timestamp).toLocaleString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Signature Area */}
                                <div className="flex flex-col md:pl-6 md:border-l border-slate-100 dark:border-slate-800">
                                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                        Visual Tanda Tangan Asli
                                    </p>
                                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group shadow-inner shadow-slate-50 dark:shadow-none">
                                        {/* Minimal Grid Background Pattern */}
                                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 pointer-events-none"
                                            style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                        />

                                        {docData.signatureImage ? (
                                            <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
                                                <img
                                                    src={docData.signatureImage}
                                                    alt="Signature"
                                                    className="max-w-full max-h-[140px] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic relative z-10 text-sm">Tidak ada visual coretan</p>
                                        )}

                                        {/* Official Stamp */}
                                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                                            <SealCheck className="w-3.5 h-3.5 text-emerald-500" weight="fill" />
                                            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Converto Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Integrity Verification Section */}
                            {docData.fileHash && (
                                <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                            Cek Integritas Dokumen
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                                            Ingin memastikan dokumen ini tidak diubah? Cukup seret atau pilih file PDF Anda di sini untuk memeriksa keaslian dan memastikan dokumen bebas dari modifikasi
                                        </p>
                                    </div>

                                    {integrityStatus === 'idle' || integrityStatus === 'error' ? (
                                        <div
                                            {...getRootProps()}
                                            className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragActive
                                                ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <input {...getInputProps()} />
                                            <div className={`w-14 h-14 rounded-full shadow-sm flex items-center justify-center mb-5 transition-colors ${isDragActive ? 'bg-rose-100 dark:bg-rose-900/40' : 'bg-white dark:bg-slate-800'}`}>
                                                <UploadSimple className={`w-7 h-7 ${isDragActive ? 'text-rose-600' : 'text-slate-400'}`} weight="bold" />
                                            </div>
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                Klik atau seret file PDF ke sini
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">Sistem akan otomatis memvalidasi dokumen</p>
                                        </div>
                                    ) : integrityStatus === 'loading' ? (
                                        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-12 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
                                            <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-5"></div>
                                            <p className="font-semibold text-slate-600 dark:text-slate-300 animate-pulse tracking-wide">Menghitung Cryptographic Hash...</p>
                                        </div>
                                    ) : integrityStatus === 'valid' ? (
                                        <div className="w-full bg-emerald-50/80 dark:bg-emerald-950/20 rounded-2xl p-10 flex flex-col items-center text-center border border-emerald-200 dark:border-emerald-800">
                                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-5 shadow-sm border border-emerald-200 dark:border-emerald-800">
                                                <ShieldCheck className="w-10 h-10 text-emerald-600" weight="fill" />
                                            </div>
                                            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">Dokumen Autentik</h3>
                                            <p className="text-sm text-emerald-700 dark:text-emerald-500/90 max-w-lg">
                                                Dokumen ini sepenuhnya cocok dengan versi asli. Tidak ada perubahan isi atau modifikasi yang terdeteksi sejak dokumen ini ditandatangani.
                                            </p>
                                            <button
                                                onClick={() => setIntegrityStatus('idle')}
                                                className="mt-8 px-6 py-2.5 bg-white dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-bold border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors shadow-sm"
                                            >
                                                Verifikasi File Lain
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full bg-rose-50/80 dark:bg-rose-950/20 rounded-2xl p-10 flex flex-col items-center text-center border border-rose-200 dark:border-rose-800 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none"></div>
                                            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mb-5 shadow-sm border border-rose-200 dark:border-rose-800 relative z-10">
                                                <WarningCircle className="w-10 h-10 text-rose-600" weight="fill" />
                                            </div>
                                            <h3 className="text-xl font-bold text-rose-800 dark:text-rose-400 mb-2 relative z-10">
                                                Dokumen Telah Diubah
                                            </h3>
                                            <p className="text-sm text-rose-700 dark:text-rose-500/90 max-w-lg relative z-10">
                                                File PDF yang Anda unggah berbeda dengan versi asli saat tanda tangan dibuat. Hal ini menunjukkan dokumen telah mengalami perubahan atau modifikasi setelah ditandatangani.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-3 mt-8 relative z-10 w-full sm:w-auto">
                                                <button
                                                    onClick={() => setIntegrityStatus('idle')}
                                                    className="px-6 py-2.5 bg-white dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-bold border border-rose-200 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-800 transition-colors shadow-sm w-full sm:w-auto"
                                                >
                                                    Coba File Lain
                                                </button>
                                                <Link
                                                    href="/sign-your-pdf"
                                                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
                                                >
                                                    Tandatangani Ulang Dokumen
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center py-12 px-4">
                            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-6 border border-rose-100 dark:border-rose-900/50">
                                <XCircle className="w-10 h-10 text-rose-500" weight="fill" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                                Dokumen Tidak Ditemukan
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed text-sm sm:text-base">
                                ID dokumen tidak valid atau dokumen ini belum pernah diterbitkan melalui sistem otentikasi Converto.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer simple branding */}
                <div className="mt-10 text-center">
                    <p className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5">
                        <SealCheck className="w-4 h-4" />
                        Secured by Converto Digital Signature
                    </p>
                </div>
            </div>
        </main>
    )
}
