'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, Eye, CloudSlash, LockKey } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const guarantees = [
    { icon: CloudSlash, text: 'Tidak ada file yang diunggah ke server kami.' },
    { icon: LockKey, text: 'Hashing SHA-256 dihitung di perangkat Anda.' },
    { icon: Eye, text: 'Hanya metadata & hash yang disimpan untuk verifikasi.' },
    { icon: ShieldCheck, text: 'Dokumen asli Anda 100% milik Anda selamanya.' },
]

export default function PrivacyDeepDive() {
    const containerRef = useRef(null)
    const terminalRef = useRef(null)
    const lineRefs = useRef([])
    const shieldRef = useRef(null)
    const ringRefs = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Terminal lines type in as user scrolls
            lineRefs.current.forEach((el, i) => {
                if (!el) return
                gsap.fromTo(el,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1,
                        x: 0,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `${10 + i * 18}% center`,
                            end: `${22 + i * 18}% center`,
                            scrub: 1,
                        }
                    }
                )
            })

            // Shield scale up
            if (shieldRef.current) {
                gsap.fromTo(shieldRef.current,
                    { scale: 0.5, opacity: 0, rotateZ: -20 },
                    {
                        scale: 1,
                        opacity: 1,
                        rotateZ: 0,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: '15% center',
                            end: '40% center',
                            scrub: 1.5,
                        }
                    }
                )
            }

            // Concentric rings expand
            ringRefs.current.forEach((el, i) => {
                if (!el) return
                gsap.fromTo(el,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `${20 + i * 10}% center`,
                            end: `${35 + i * 10}% center`,
                            scrub: 1.5,
                        }
                    }
                )
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative w-full min-h-[300vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-950 flex flex-col md:flex-row items-center">

                {/* ── Left: Shield Visual ── */}
                <div className="w-full md:w-1/2 h-[40vh] md:h-full flex items-center justify-center relative">
                    {/* Concentric rings */}
                    {[1, 2, 3].map((ring, i) => (
                        <div
                            key={ring}
                            ref={el => ringRefs.current[i] = el}
                            className="absolute rounded-full border border-dashed pointer-events-none"
                            style={{
                                width: `${180 + i * 80}px`,
                                height: `${180 + i * 80}px`,
                                borderColor: `rgba(16, 185, 129, ${0.2 - i * 0.05})`,
                                animationDuration: `${20 + i * 10}s`,
                                opacity: 0,
                                scale: 0
                            }}
                        >
                            <div className="w-full h-full rounded-full animate-[spin_30s_linear_infinite]" style={{
                                animationDuration: `${20 + i * 10}s`,
                                animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                                border: '1px dashed',
                                borderColor: 'inherit',
                                borderRadius: '9999px'
                            }} />
                        </div>
                    ))}

                    {/* Central shield */}
                    <div
                        ref={shieldRef}
                        className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-emerald-950/30 border border-emerald-500/30 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-emerald-500/10 z-10 transform-gpu will-change-transform"
                    >
                        <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500" weight="duotone" />
                        {/* Pulse ring */}
                        <div className="absolute inset-0 rounded-[2rem] border border-emerald-500/20 animate-ping opacity-20" />
                    </div>

                    {/* Ambient glow */}
                    <div className="absolute w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                </div>

                {/* ── Right: Terminal Console ── */}
                <div className="w-full md:w-1/2 h-[55vh] md:h-full flex items-center justify-center px-6 sm:px-12 md:px-16">
                    <div ref={terminalRef} className="w-full max-w-lg">
                        {/* Terminal header */}
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-t-2xl px-5 py-3">
                            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            <span className="ml-3 text-[11px] text-slate-500 font-mono font-bold tracking-wider">converto://privacy-audit</span>
                        </div>

                        {/* Terminal body */}
                        <div className="bg-slate-950 border border-t-0 border-slate-800 rounded-b-2xl p-6 sm:p-8 font-mono text-sm space-y-5">
                            {/* Section title */}
                            <div className="mb-6">
                                <p className="text-emerald-500 font-bold text-xs tracking-widest uppercase mb-2">SECURITY AUDIT — PASSED ✓</p>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-sans leading-[1.1]">
                                    Privasi Anda,<br />
                                    <span className="text-emerald-400">Prioritas Kami.</span>
                                </h3>
                            </div>

                            {/* Guarantee lines */}
                            {guarantees.map((g, i) => {
                                const Icon = g.icon
                                return (
                                    <div
                                        key={i}
                                        ref={el => lineRefs.current[i] = el}
                                        className="flex items-start gap-3 opacity-0"
                                    >
                                        <span className="text-emerald-600 select-none shrink-0 mt-0.5">
                                            <Icon className="w-5 h-5" weight="bold" />
                                        </span>
                                        <div>
                                            <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed">{g.text}</p>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Blinking cursor */}
                            <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
                                <span className="text-emerald-600 text-xs">$</span>
                                <span className="text-slate-500 text-xs font-sans">your-files-never-leave-your-device</span>
                                <span className="w-2 h-4 bg-emerald-500 animate-pulse rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
