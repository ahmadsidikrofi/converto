'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle } from '@phosphor-icons/react'
import Header from "@/components/Header"

export default function VerifyPage() {
    const params = useParams()
    const { id } = params
    
    const [docData, setDocData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulasi pembacaan dari Database dengan membaca LocalStorage (MVP)
        const stored = localStorage.getItem(`converto_${id}`)
        if (stored) {
            setDocData(JSON.parse(stored))
        }
        setLoading(false)
    }, [id])

    return (
        <main className="flex flex-col items-center p-10 w-full min-h-screen bg-slate-50">
            <Header 
                title="Verifikasi Dokumen" 
                description="Halaman pengecekan otentikasi dokumen digital Converto" 
            />
            
            <div className="mt-10 w-full max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                {loading ? (
                    <div className="flex justify-center p-10 animate-pulse text-slate-500 font-medium">
                        Memeriksa keaslian dokumen...
                    </div>
                ) : docData ? (
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle className="w-24 h-24 text-emerald-500 mb-4" weight="fill" />
                        <h2 className="text-3xl font-bold text-slate-800">DOKUMEN TERVERIFIKASI</h2>
                        <p className="text-emerald-600 font-medium mt-2">
                            Dokumen ini sah dan keasliannya tercatat di sistem Converto.
                        </p>
                        
                        <div className="mt-8 w-full text-left bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 border-b pb-6">
                                <div className="text-slate-500 font-medium">ID Dokumen</div>
                                <div className="col-span-2 font-mono text-slate-700 font-semibold bg-slate-200 px-2 py-1 rounded w-fit">
                                    {id}
                                </div>
                                
                                <div className="text-slate-500 font-medium">Nama File</div>
                                <div className="col-span-2 font-semibold text-slate-800">
                                    {docData.fileName}
                                </div>
                                
                                <div className="text-slate-500 font-medium">Penandatangan</div>
                                <div className="col-span-2 font-bold text-sky-700">
                                    {docData.signerName || "Pengguna Converto"}
                                </div>
                                
                                <div className="text-slate-500 font-medium">Tanggal Dibuat</div>
                                <div className="col-span-2 text-slate-800 font-medium">
                                    {new Date(docData.timestamp).toLocaleString('id-ID', {
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            
                            {docData.signatureImage && (
                                <div className="mt-6 flex flex-col items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-sm text-slate-500 font-semibold mb-4 uppercase tracking-widest">
                                        Coretan Tanda Tangan Asli
                                    </p>
                                    <div className="w-64 h-32 flex items-center justify-center">
                                        <img 
                                            src={docData.signatureImage} 
                                            alt="Signature" 
                                            className="max-w-full max-h-full object-contain filter drop-shadow-md" 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center p-10">
                        <XCircle className="w-24 h-24 text-rose-500 mb-4" weight="fill" />
                        <h2 className="text-2xl font-bold text-slate-800">Dokumen Tidak Ditemukan</h2>
                        <p className="text-slate-500 mt-2">ID dokumen tidak valid atau belum pernah didaftarkan di sistem kami.</p>
                    </div>
                )}
            </div>
        </main>
    )
}
