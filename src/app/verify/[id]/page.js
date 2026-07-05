'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle, FilePdf, User, CalendarBlank, Hash, SealCheck } from '@phosphor-icons/react'
import Header from "@/components/Header"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function VerifyPage() {
    const params = useParams()
    const { id } = params
    
    const [docData, setDocData] = useState(null)
    const [loading, setLoading] = useState(true)

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

    return (
        <main className="flex flex-col items-center w-full min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pt-10 pb-20 px-6 relative overflow-hidden">
            {/* Background elements for premium feel */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-950/10 z-0 pointer-events-none" />
            
            <div className="relative z-10 w-full flex flex-col items-center">
                <Header 
                    title="Verifikasi Dokumen" 
                    description="Sistem Pengecekan Otentikasi Dokumen Digital Converto" 
                />
                
                <div className="mt-12 w-full max-w-3xl bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800">
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
                                    Dokumen Sah & Terverifikasi
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg">
                                    Tanda tangan digital pada dokumen ini dinyatakan otentik dan tercatat secara resmi di dalam sistem keamanan Converto.
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
