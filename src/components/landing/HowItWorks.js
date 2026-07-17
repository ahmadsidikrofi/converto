'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UploadSimple, Sliders, DownloadSimple } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
    {
        num: '01',
        title: 'Drop',
        subtitle: 'Jatuhkan file Anda.',
        desc: 'Seret dan lepaskan file apa pun — gambar, audio, video, atau PDF — langsung ke peramban. Tidak ada pendaftaran, tidak ada antrean.',
        icon: UploadSimple,
        accent: '#e5322d',
        accentRgb: '229,50,45'
    },
    {
        num: '02',
        title: 'Tweak',
        subtitle: 'Sesuaikan sesuka hati.',
        desc: 'Pilih format tujuan, atur kualitas, atau tambahkan tanda tangan digital. Semua kendali ada di tangan Anda.',
        icon: Sliders,
        accent: '#8B5CF6',
        accentRgb: '139,92,246'
    },
    {
        num: '03',
        title: 'Done',
        subtitle: 'Unduh hasilnya.',
        desc: 'File Anda siap dalam hitungan detik. Unduh langsung — tidak ada watermark, tidak ada biaya tersembunyi.',
        icon: DownloadSimple,
        accent: '#10B981',
        accentRgb: '16,185,129'
    }
]

export default function HowItWorks() {
    const containerRef = useRef(null)
    const trackRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Horizontal scroll: move the track leftward as user scrolls vertically
            const track = trackRef.current
            const totalWidth = track.scrollWidth - window.innerWidth

            gsap.to(track, {
                x: -totalWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: `+=${totalWidth}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            })

            // Animate each card as it enters viewport
            const cards = track.querySelectorAll('.hiw-card')
            cards.forEach((card, i) => {
                gsap.from(card, {
                    opacity: 0,
                    scale: 0.85,
                    rotateY: 15,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: gsap.getById?.('hiw') || undefined,
                        start: 'left 80%',
                        toggleActions: 'play none none reverse',
                        horizontal: true
                    }
                })
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative w-full overflow-hidden bg-background">
            {/* Horizontal Track */}
            <div ref={trackRef} className="flex items-center h-screen will-change-transform">

                {/* Intro Panel */}
                <div className="flex-shrink-0 w-screen h-screen flex flex-col justify-center px-8 sm:px-20 md:px-32">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-4">Cara Kerja</p>
                    <h2 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-6">
                        Tiga langkah.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5322d] to-rose-400">
                            Tanpa hambatan.
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-lg">
                        Gulir ke samping untuk melihat betapa mudahnya.
                    </p>
                    {/* Scroll hint arrow */}
                    <div className="mt-10 flex items-center gap-3 text-slate-400 dark:text-slate-600 animate-pulse">
                        <div className="w-12 h-[2px] bg-current rounded" />
                        <span className="text-xs font-bold tracking-widest uppercase">Scroll</span>
                    </div>
                </div>

                {/* Step Cards */}
                {steps.map((step, i) => {
                    const Icon = step.icon
                    return (
                        <div
                            key={step.num}
                            className="hiw-card flex-shrink-0 w-screen h-screen flex items-center justify-center px-8 sm:px-16"
                        >
                            <div
                                className="relative w-full max-w-xl aspect-[4/3] rounded-[2.5rem] p-10 sm:p-14 flex flex-col justify-between overflow-hidden transform-gpu"
                                style={{
                                    background: `linear-gradient(135deg, rgba(${step.accentRgb}, 0.06) 0%, rgba(${step.accentRgb}, 0.02) 100%)`,
                                    border: `1px solid rgba(${step.accentRgb}, 0.15)`
                                }}
                            >
                                {/* Background number */}
                                <span
                                    className="absolute -bottom-8 -right-4 text-[12rem] sm:text-[16rem] font-black leading-none select-none pointer-events-none"
                                    style={{ color: `rgba(${step.accentRgb}, 0.07)` }}
                                >
                                    {step.num}
                                </span>

                                {/* Top: Icon */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: `rgba(${step.accentRgb}, 0.1)` }}
                                >
                                    <Icon className="w-8 h-8" weight="bold" style={{ color: step.accent }} />
                                </div>

                                {/* Bottom: Copy */}
                                <div className="relative z-10">
                                    <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg sm:text-xl font-semibold mb-3" style={{ color: step.accent }}>
                                        {step.subtitle}
                                    </p>
                                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* End spacer */}
                <div className="flex-shrink-0 w-[20vw]" />
            </div>
        </section>
    )
}
