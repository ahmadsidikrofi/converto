'use client'
import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { FilePdf, Image as ImageIcon, VideoCamera, ShieldCheck, QrCode, ArrowDown } from "@phosphor-icons/react"

export default function Scrollytelling() {
    const containerRef = useRef(null)
    const text1Ref = useRef(null)
    const text2Ref = useRef(null)
    const text3Ref = useRef(null)
    const visual1Ref = useRef(null)
    const visual2Ref = useRef(null)
    const visual3Ref = useRef(null)
    const signaturePathRef = useRef(null)

    useEffect(() => {
        // Prepare signature path length for drawing animation
        if (signaturePathRef.current) {
            const length = signaturePathRef.current.getTotalLength()
            signaturePathRef.current.style.strokeDasharray = length
            signaturePathRef.current.style.strokeDashoffset = length
        }

        // Setup timeline-like scrubbing animations for text & graphics
        const animConfigs = [
            // Slide 1 (0 to 30%)
            {
                el: text1Ref.current,
                opacity: [1, 0],
                translateY: [0, -30],
                duration: 1000
            },
            {
                el: visual1Ref.current,
                opacity: [1, 0],
                scale: [1, 0.8],
                duration: 1000
            },
            // Slide 2 (33% to 66%)
            {
                el: text2Ref.current,
                opacity: [0, 1, 0],
                translateY: [30, 0, -30],
                duration: 1000
            },
            {
                el: visual2Ref.current,
                opacity: [0, 1, 0],
                scale: [0.8, 1, 0.8],
                duration: 1000
            },
            // Draw signature during Slide 2
            {
                el: signaturePathRef.current,
                strokeDashoffset: (el) => {
                    const length = el.getTotalLength()
                    return [length, 0, 0] // draw and stay drawn
                },
                duration: 1000
            },
            // Slide 3 (66% to 100%)
            {
                el: text3Ref.current,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 1000
            },
            {
                el: visual3Ref.current,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 1000
            }
        ]

        const anims = animConfigs.map(({ el, ...options }) => animate(el, { ...options, autoplay: false }))

        const handleScroll = () => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            // The scrolling track is container height minus viewport height
            const totalScrollable = rect.height - windowHeight
            const scrolled = -rect.top // how far the top of the container has scrolled up past viewport

            let progress = scrolled / totalScrollable
            progress = Math.max(0, Math.min(1, progress))

            // Map progress (0 to 1) to individual animation states
            // Slide 1 fades out from progress 0.1 to 0.3
            const p1 = Math.max(0, Math.min(1, (progress - 0.1) / 0.2))
            anims[0].seek(anims[0].duration * p1) // Text 1 fade out
            anims[1].seek(anims[1].duration * p1) // Visual 1 fade out

            // Slide 2 fades in from 0.3 to 0.45, then fades out from 0.55 to 0.7
            let p2 = 0
            if (progress >= 0.3 && progress <= 0.5) {
                p2 = (progress - 0.3) / 0.2 // fade in (0 to 0.5 on animation scale)
            } else if (progress > 0.5 && progress <= 0.7) {
                p2 = 0.5 + ((progress - 0.5) / 0.2) * 0.5 // fade out (0.5 to 1 on animation scale)
            } else if (progress > 0.7) {
                p2 = 1
            }
            anims[2].seek(anims[2].duration * p2) // Text 2 fade in/out
            anims[3].seek(anims[3].duration * p2) // Visual 2 fade in/out
            anims[4].seek(anims[4].duration * p2) // Signature path draw

            // Slide 3 fades in from 0.7 to 0.9
            const p3 = Math.max(0, Math.min(1, (progress - 0.7) / 0.2))
            anims[5].seek(anims[5].duration * p3) // Text 3 fade in
            anims[6].seek(anims[6].duration * p3) // Visual 3 fade in
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Trigger initial state

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section ref={containerRef} className="relative w-full min-h-[300vh] bg-slate-950 text-white z-20">
            {/* Sticky Wrapper: Pinned viewport section */}
            <div className="sticky top-0 w-full h-screen flex flex-col md:flex-row items-center justify-between px-6 sm:px-16 md:px-24 overflow-hidden">
                
                {/* Background ambient lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,50,45,0.08)_0%,transparent_60%)] pointer-events-none" />

                {/* Left Side: Scrollytelling Descriptions */}
                <div className="relative w-full md:w-1/2 h-[40vh] md:h-auto flex flex-col justify-center select-none z-10">
                    
                    {/* Slide 1 Text */}
                    <div ref={text1Ref} className="absolute left-0 right-0 flex flex-col gap-4">
                        <span className="text-[#e5322d] font-bold text-sm tracking-widest uppercase">01 / MULTIMEDIA</span>
                        <h3 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                            Metamorfosis <br/>Format Berkas
                        </h3>
                        <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">
                            Konversi gambar, video, dan audio Anda ke format apa pun secara instan. Diproses langsung di peramban tanpa antrean server.
                        </p>
                    </div>

                    {/* Slide 2 Text */}
                    <div ref={text2Ref} className="absolute left-0 right-0 flex flex-col gap-4 opacity-0">
                        <span className="text-rose-400 font-bold text-sm tracking-widest uppercase">02 / INTEGRITAS</span>
                        <h3 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                            Tanda Tangan <br/>Kriptografis
                        </h3>
                        <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">
                            Semua dokumen yang Anda tandatangani dikunci menggunakan algoritma SHA-256. Setiap modifikasi kecil sekalipun akan terdeteksi.
                        </p>
                    </div>

                    {/* Slide 3 Text */}
                    <div ref={text3Ref} className="absolute left-0 right-0 flex flex-col gap-4 opacity-0">
                        <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">03 / PRIVASI</span>
                        <h3 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                            Aman Tanpa <br/>Server Penyimpan
                        </h3>
                        <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">
                            Dokumen asli Anda tidak pernah menyentuh server kami. Kami hanya mencatat metadata dan sidik jari file untuk keperluan verifikasi publik.
                        </p>
                    </div>
                </div>

                {/* Right Side: Visual Showcase Container */}
                <div className="relative w-full md:w-1/2 h-[45vh] md:h-[60vh] flex items-center justify-center z-10">
                    
                    {/* Visual 1: Converter animation placeholder */}
                    <div ref={visual1Ref} className="absolute flex flex-col items-center justify-center gap-6">
                        <div className="relative flex items-center justify-center w-48 h-48 rounded-full border border-rose-500/20 bg-rose-950/10 backdrop-blur-md shadow-2xl">
                            <div className="absolute w-full h-full border border-dashed border-rose-500/30 rounded-full animate-[spin_40s_linear_infinite]" />
                            <VideoCamera className="w-16 h-16 text-rose-500 animate-pulse" weight="duotone" />
                            
                            {/* Floating format indicators */}
                            <span className="absolute -top-4 bg-slate-900 border border-slate-800 text-xs px-3 py-1 rounded-full text-slate-300 font-bold shadow-md">MP4</span>
                            <span className="absolute -bottom-4 bg-[#e5322d] text-xs px-3 py-1 rounded-full text-white font-bold shadow-md">WEBP</span>
                            <span className="absolute -left-8 bg-slate-900 border border-slate-800 text-xs px-3 py-1 rounded-full text-slate-300 font-bold shadow-md">MP3</span>
                            <span className="absolute -right-8 bg-slate-900 border border-slate-800 text-xs px-3 py-1 rounded-full text-slate-300 font-bold shadow-md">WAV</span>
                        </div>
                    </div>

                    {/* Visual 2: Document drawing signature */}
                    <div ref={visual2Ref} className="absolute opacity-0 flex flex-col items-center justify-center w-[280px] sm:w-[320px] aspect-[3/4] bg-slate-900/90 border border-rose-500/20 rounded-3xl p-6 shadow-2xl">
                        <div className="w-full flex justify-between items-center border-b border-slate-800 pb-3 mb-6">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Dokumen Perjanjian.pdf</span>
                            <FilePdf className="w-5 h-5 text-rose-500" />
                        </div>
                        <div className="w-full flex flex-col gap-2.5 mb-8">
                            <div className="w-3/4 h-2 bg-slate-800 rounded" />
                            <div className="w-full h-2 bg-slate-800 rounded" />
                            <div className="w-5/6 h-2 bg-slate-800 rounded" />
                        </div>
                        
                        {/* Signature area with draw path */}
                        <div className="w-full border-t border-dashed border-slate-800 pt-6 relative flex items-center justify-between">
                            <svg className="w-32 h-12" viewBox="0 0 200 80">
                                <path 
                                    ref={signaturePathRef}
                                    d="M10,50 Q40,10 80,60 T140,20 T190,40" 
                                    fill="none" 
                                    stroke="#e5322d" 
                                    strokeWidth="4" 
                                    strokeLinecap="round"
                                />
                            </svg>
                            <QrCode className="w-12 h-12 text-slate-500" weight="thin" />
                        </div>
                    </div>

                    {/* Visual 3: Client-side Shield and Database locks */}
                    <div ref={visual3Ref} className="absolute opacity-0 flex flex-col items-center justify-center gap-6">
                        <div className="relative flex items-center justify-center w-48 h-48">
                            {/* Rotating orbit circles */}
                            <div className="absolute w-full h-full border border-emerald-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute w-[80%] h-[80%] border border-dashed border-emerald-500/30 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                            
                            <div className="relative w-28 h-28 bg-emerald-950/20 border border-emerald-500/40 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-xl">
                                <ShieldCheck className="w-16 h-16 text-emerald-500" weight="duotone" />
                            </div>
                        </div>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/50 px-3 py-1.5 rounded-full shadow-inner tracking-wider">
                            ENKRIPSI LOKAL (BROWSER)
                        </span>
                    </div>

                </div>

                {/* Micro-Interaction Hint: Scroll Down Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 select-none animate-bounce pointer-events-none">
                    <span className="text-[10px] tracking-widest font-bold text-slate-500 uppercase">Gulir ke bawah</span>
                    <ArrowDown className="w-3 h-3 text-slate-500" />
                </div>
            </div>
        </section>
    )
}
