'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Image as ImageIcon, MusicNotes, VideoCamera, FilePdf, QrCode, ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const features = [
    {
        id: 'image',
        label: 'Image',
        sublabel: 'Converter',
        icon: ImageIcon,
        accent: '#e5322d',
        accentRgb: '229,50,45',
        desc: 'Konversi gambar (JPEG, PNG, WEBP) secepat kilat. Kompresi dan ubah ukuran langsung di peramban.',
        link: '/convert',
        formats: ['JPG', 'PNG', 'WEBP', 'GIF', 'TIFF', 'BMP']
    },
    {
        id: 'audio',
        label: 'Audio',
        sublabel: 'Transformer',
        icon: MusicNotes,
        accent: '#8B5CF6',
        accentRgb: '139,92,246',
        desc: 'Ubah format audio (MP3, WAV, AAC, FLAC). Atur bitrate dan gabungkan beberapa file menjadi satu.',
        link: '/convert',
        formats: ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'WMA']
    },
    {
        id: 'video',
        label: 'Video',
        sublabel: 'Metamorphosis',
        icon: VideoCamera,
        accent: '#0EA5E9',
        accentRgb: '14,165,233',
        desc: 'Transcode video, potong dan gabungkan klip. Ditenagai FFmpeg WebAssembly di perangkat Anda.',
        link: '/convert',
        formats: ['MP4', 'MKV', 'AVI', 'MOV', 'WEBM', 'FLV']
    },
    {
        id: 'esign',
        label: 'e-Sign',
        sublabel: 'PDF',
        icon: FilePdf,
        accent: '#10B981',
        accentRgb: '16,185,129',
        desc: 'Tanda tangani PDF dengan tinta digital atau QR kriptografis SHA-256. Verifikasi integritas kapan saja.',
        link: '/sign-your-pdf',
        formats: ['SHA-256', 'QR Code', 'Coretan', 'Verify']
    }
]

export default function FeatureShowcase() {
    const containerRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const signaturePathRef = useRef(null)
    const progressRef = useRef(0)

    // Memoize the state setter to avoid unnecessary renders
    const updateActive = useCallback((idx) => {
        setActiveIndex(prev => prev !== idx ? idx : prev)
    }, [])

    useEffect(() => {
        // Prepare signature path
        if (signaturePathRef.current) {
            const length = signaturePathRef.current.getTotalLength()
            signaturePathRef.current.style.strokeDasharray = length
            signaturePathRef.current.style.strokeDashoffset = length
        }

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
                onUpdate: (self) => {
                    progressRef.current = self.progress
                    const segmentSize = 1 / features.length
                    const idx = Math.min(features.length - 1, Math.floor(self.progress / segmentSize))
                    updateActive(idx)

                    // Signature draw when e-Sign is active
                    if (signaturePathRef.current) {
                        const pathLength = signaturePathRef.current.getTotalLength()
                        if (idx === 3) {
                            const segStart = 3 * segmentSize
                            let p = (self.progress - segStart) / segmentSize
                            p = Math.max(0, Math.min(1, p))
                            signaturePathRef.current.style.strokeDashoffset = pathLength * (1 - p)
                        } else {
                            signaturePathRef.current.style.strokeDashoffset = pathLength
                        }
                    }
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [updateActive])

    const current = features[activeIndex]

    return (
        <section ref={containerRef} className="relative w-full min-h-[500vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-700" style={{
                backgroundColor: `rgba(${current.accentRgb}, 0.04)`
            }}>

                {/* ── Giant Background Number ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span
                        className="text-[30vw] sm:text-[25vw] font-black leading-none transition-all duration-700 tabular-nums"
                        style={{ color: `rgba(${current.accentRgb}, 0.06)` }}
                    >
                        0{activeIndex + 1}
                    </span>
                </div>

                {/* ── Ambient Glow ── */}
                <div
                    className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
                    style={{
                        background: `radial-gradient(circle, rgba(${current.accentRgb}, 0.15) 0%, transparent 70%)`,
                        top: '30%',
                        left: '20%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />

                {/* ── Main Content Grid ── */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 flex flex-col md:flex-row items-center gap-12 md:gap-20 h-full py-16 md:py-0">

                    {/* Left Column: Typography & Info */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        {/* Step indicator */}
                        <div className="flex items-center gap-3 mb-8">
                            {features.map((_, i) => (
                                <div
                                    key={i}
                                    className="h-1 rounded-full transition-all duration-500"
                                    style={{
                                        width: activeIndex === i ? '40px' : '12px',
                                        backgroundColor: activeIndex === i ? current.accent : 'rgba(148,163,184,0.2)'
                                    }}
                                />
                            ))}
                            <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-500 tabular-nums tracking-widest">
                                0{activeIndex + 1} / 0{features.length}
                            </span>
                        </div>

                        {/* Feature title – oversized */}
                        <div className="overflow-hidden mb-2">
                            <h2
                                key={`label-${activeIndex}`}
                                className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white animate-[slideUp_0.5s_ease-out]"
                            >
                                {current.label}
                            </h2>
                        </div>
                        <div className="overflow-hidden mb-8">
                            <h3
                                key={`sublabel-${activeIndex}`}
                                className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] animate-[slideUp_0.5s_ease-out_0.08s_both]"
                                style={{ color: current.accent }}
                            >
                                {current.sublabel}
                            </h3>
                        </div>

                        {/* Description */}
                        <p
                            key={`desc-${activeIndex}`}
                            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mb-10 animate-[fadeIn_0.6s_ease-out_0.15s_both]"
                        >
                            {current.desc}
                        </p>

                        {/* CTA */}
                        <Link
                            href={current.link}
                            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95 shadow-lg w-fit"
                            style={{ backgroundColor: current.accent, boxShadow: `0 12px 30px rgba(${current.accentRgb}, 0.25)` }}
                        >
                            Coba Sekarang
                            <ArrowRight weight="bold" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right Column: Visual Theater */}
                    <div className="w-full md:w-1/2 flex items-center justify-center relative h-[45vh] md:h-[70vh]">

                        {/* ── Visual: Floating Format Pills ── */}
                        <div
                            key={`pills-${activeIndex}`}
                            className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 animate-[fadeIn_0.5s_ease-out]"
                        >
                            {current.formats.map((fmt, i) => (
                                <span
                                    key={fmt}
                                    className="px-4 py-2 rounded-full text-sm font-black tracking-wider border backdrop-blur-md transition-all duration-500 animate-[popIn_0.4s_ease-out_both]"
                                    style={{
                                        borderColor: `rgba(${current.accentRgb}, 0.3)`,
                                        backgroundColor: `rgba(${current.accentRgb}, 0.08)`,
                                        color: current.accent,
                                        animationDelay: `${i * 0.07}s`
                                    }}
                                >
                                    {fmt}
                                </span>
                            ))}
                        </div>

                        {/* ── Central Hero Visual ── */}
                        <div
                            key={`visual-${activeIndex}`}
                            className="relative z-10 animate-[scaleIn_0.5s_ease-out]"
                        >
                            {activeIndex === 0 && (
                                <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full flex items-center justify-center" style={{ border: `2px solid rgba(${current.accentRgb}, 0.3)`, background: `rgba(${current.accentRgb}, 0.05)` }}>
                                    <div className="absolute w-full h-full border border-dashed rounded-full animate-[spin_25s_linear_infinite]" style={{ borderColor: `rgba(${current.accentRgb}, 0.2)` }} />
                                    <ImageIcon className="w-20 h-20 sm:w-24 sm:h-24" weight="duotone" style={{ color: current.accent }} />
                                </div>
                            )}

                            {activeIndex === 1 && (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="flex items-end gap-1.5 h-36 sm:h-44">
                                        {[40, 65, 50, 80, 35, 70, 55, 75, 45, 60, 85, 50, 70, 45, 60].map((h, i) => (
                                            <div
                                                key={i}
                                                className="w-2.5 sm:w-3 rounded-full animate-pulse"
                                                style={{
                                                    height: `${h}%`,
                                                    animationDelay: `${i * 0.08}s`,
                                                    animationDuration: `${1 + (i * 0.12)}s`,
                                                    background: `linear-gradient(to top, ${current.accent}, rgba(${current.accentRgb}, 0.5))`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeIndex === 2 && (
                                <div className="relative w-64 sm:w-72 h-44 sm:h-48 rounded-2xl overflow-hidden flex items-center justify-center" style={{ border: `1px solid rgba(${current.accentRgb}, 0.2)`, background: 'rgba(15,23,42,0.8)' }}>
                                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(${current.accentRgb}, 0.1) 0%, transparent 60%)` }} />
                                    <VideoCamera className="w-16 h-16 sm:w-20 sm:h-20 relative z-10" weight="duotone" style={{ color: current.accent }} />
                                    {/* Film strips */}
                                    <div className="absolute top-0 left-0 right-0 h-4 bg-slate-900/90 flex">
                                        {Array.from({ length: 14 }).map((_, i) => (
                                            <div key={i} className="flex-1 m-0.5 rounded-[1px]" style={{ background: 'rgba(148,163,184,0.1)' }} />
                                        ))}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-900/90 flex">
                                        {Array.from({ length: 14 }).map((_, i) => (
                                            <div key={i} className="flex-1 m-0.5 rounded-[1px]" style={{ background: 'rgba(148,163,184,0.1)' }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeIndex === 3 && (
                                <div className="w-[220px] sm:w-[260px] aspect-[3/4] rounded-2xl p-5 shadow-2xl" style={{ background: 'rgba(15,23,42,0.9)', border: `1px solid rgba(${current.accentRgb}, 0.2)` }}>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
                                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Dokumen.pdf</span>
                                        <FilePdf className="w-4 h-4" style={{ color: current.accent }} />
                                    </div>
                                    <div className="flex flex-col gap-2 mb-6">
                                        <div className="w-3/4 h-1.5 bg-slate-800 rounded" />
                                        <div className="w-full h-1.5 bg-slate-800 rounded" />
                                        <div className="w-5/6 h-1.5 bg-slate-800 rounded" />
                                        <div className="w-2/3 h-1.5 bg-slate-800 rounded" />
                                    </div>
                                    <div className="border-t border-dashed border-slate-800 pt-4 flex items-center justify-between">
                                        <svg className="w-24 h-10" viewBox="0 0 200 80">
                                            <path ref={signaturePathRef} d="M10,50 Q40,10 80,60 T140,20 T190,40" fill="none" stroke={current.accent} strokeWidth="4" strokeLinecap="round" />
                                        </svg>
                                        <QrCode className="w-10 h-10 text-slate-600" weight="thin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Bottom: Floating Feature Nav ── */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/10 dark:border-slate-800 rounded-full px-2 py-2 z-20 shadow-2xl">
                    {features.map((feature, i) => {
                        const Icon = feature.icon
                        const isActive = activeIndex === i
                        return (
                            <div
                                key={feature.id}
                                className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 cursor-default"
                                style={{
                                    backgroundColor: isActive ? `rgba(${feature.accentRgb}, 0.15)` : 'transparent',
                                }}
                            >
                                <Icon
                                    className="w-4 h-4 transition-colors duration-500"
                                    weight={isActive ? 'fill' : 'regular'}
                                    style={{ color: isActive ? feature.accent : 'rgba(148,163,184,0.4)' }}
                                />
                                {isActive && (
                                    <span
                                        className="text-xs font-bold tracking-wide animate-[fadeIn_0.3s_ease-out]"
                                        style={{ color: feature.accent }}
                                    >
                                        {feature.label}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
