'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { FilePdf, Image as ImageIcon, VideoCamera, ShieldCheck, QrCode } from "@phosphor-icons/react"
import Link from 'next/link'

export default function FeatureGrid() {
    const gridContainerRef = useRef(null)

    useEffect(() => {
        // Create 50 invisible dots for staggered animation
        if (!gridContainerRef.current) return
        gridContainerRef.current.innerHTML = '' // clean up if re-renders
        const dots = []
        for(let i=0; i<50; i++) {
            const dot = document.createElement('div')
            dot.className = 'grid-dot w-2 h-2 bg-rose-500/20 dark:bg-rose-500/30 rounded-full mx-auto'
            gridContainerRef.current.appendChild(dot)
            dots.push(dot)
        }

        // Stagger animation trigger
        const animateGrid = () => {
            animate('.grid-dot', {
                scale: [
                    { to: 2.5, ease: 'outSine', duration: 400 },
                    { to: 1, ease: 'inOutQuad', duration: 600 }
                ],
                opacity: [
                    { to: 1, duration: 200 },
                    { to: 0.2, duration: 800 }
                ],
                delay: stagger(100, { grid: [10, 5], from: 'center' })
            })
        }

        const el = gridContainerRef.current;
        el.addEventListener('mouseenter', animateGrid)
        
        // Auto run once on load
        const timer = setTimeout(animateGrid, 1000)

        return () => {
            if(el) el.removeEventListener('mouseenter', animateGrid)
            clearTimeout(timer)
        }
    }, [])

    return (
        <section className="py-24 relative max-w-6xl mx-auto px-4 w-full">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">Fitur Lengkap Converto</h2>
                <p className="text-slate-500 dark:text-slate-400">Desain minimalis, performa maksimalis. Sentuh area ini untuk melihat efek grid.</p>
            </div>

            {/* Background Stagger Grid */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div ref={gridContainerRef} className="grid grid-cols-10 gap-x-12 gap-y-12 opacity-60"></div>
            </div>

            {/* Bento Box UI */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* E-Sign PDF Card - Large */}
                <Link href="/sign-your-pdf" className="md:col-span-2 group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FilePdf weight="fill" className="w-40 h-40 text-[#e5322d]" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 text-[#e5322d] rounded-2xl flex items-center justify-center mb-6">
                            <QrCode className="w-6 h-6" weight="bold" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">e-Sign PDF dengan Integritas</h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                            Bukan sekadar menggambar coretan. Converto menanamkan sidik jari kriptografi (SHA-256) pada PDF Anda, mendeteksi pemalsuan, dan mencetak QR Code verifikasi.
                        </p>
                    </div>
                </Link>

                {/* Privacy Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck className="w-6 h-6" weight="bold" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">100% Client-Side</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        File multimedia dan dokumen Anda diproses langsung di *browser*. Tidak ada yang diunggah ke server kami. Privasi mutlak.
                    </p>
                </div>

                {/* Media Converter Card */}
                <Link href="/convert" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                        <ImageIcon className="w-6 h-6" weight="bold" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Image Converter</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        Kompresi, potong, dan ubah format gambar (JPG, PNG, WEBP) secepat kilat.
                    </p>
                </Link>

                {/* Audio/Video Converter Card - Span 2 */}
                <Link href="/convert" className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <VideoCamera weight="fill" className="w-40 h-40 text-white" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <VideoCamera className="w-6 h-6" weight="bold" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Multimedia Metamorphosis</h3>
                        <p className="text-slate-300 max-w-md leading-relaxed">
                            Konversi video ke berbagai format dan ekstrak audio. Semua ditenagai oleh WebAssembly yang berjalan sangat lancar di memori perangkat Anda.
                        </p>
                    </div>
                </Link>
            </div>
        </section>
    )
}
