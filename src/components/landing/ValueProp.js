'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightning, ShieldCheck, Infinity as InfinityIcon } from '@phosphor-icons/react'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const points = [
    {
        icon: Lightning,
        color: 'rose',
        title: 'Secepat Kilat',
        desc: 'WebAssembly di browser Anda. Tanpa antrean server.'
    },
    {
        icon: ShieldCheck,
        color: 'emerald',
        title: 'Privasi Mutlak',
        desc: 'File tidak pernah meninggalkan perangkat Anda.'
    },
    {
        icon: InfinityIcon,
        color: 'sky',
        title: 'Tanpa Batas',
        desc: 'Gratis selamanya. Tanpa batasan apapun.'
    }
]

export default function ValueProp() {
    const containerRef = useRef(null)
    const cardRef = useRef(null)
    const pointRefs = useRef([])
    const headingRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Card 3D rotation pinned to scroll
            gsap.to(cardRef.current, {
                rotateY: 360,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5, // buttery smooth
                    pin: false, // we pin the sticky wrapper via CSS
                }
            })

            // Heading fade in
            gsap.from(headingRef.current, {
                opacity: 0,
                y: 40,
                duration: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            })

            // Staggered point reveals
            pointRefs.current.forEach((el, i) => {
                if (!el) return
                gsap.fromTo(el,
                    { opacity: 0, x: 60 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: `${15 + i * 25}% center`,
                            end: `${30 + i * 25}% center`,
                            scrub: 1,
                        }
                    }
                )
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative w-full min-h-[200vh]">
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center px-6 sm:px-16 md:px-24 gap-12 md:gap-20 overflow-hidden bg-background">

                {/* Left: 3D Rotating Card */}
                <div className="w-full md:w-1/2 flex items-center justify-center" style={{ perspective: '1200px' }}>
                    <div
                        ref={cardRef}
                        className="w-[260px] sm:w-[320px] aspect-square rounded-[2.5rem] bg-gradient-to-br from-white to-rose-50 dark:from-slate-800 dark:to-rose-950/30 border border-slate-200/50 dark:border-rose-500/20 shadow-2xl shadow-rose-500/10 flex flex-col items-center justify-center text-center p-8 transform-gpu will-change-transform"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Ambient glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/15 blur-3xl rounded-full pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/15 blur-3xl rounded-full pointer-events-none" />

                        <Image
                            src="/isometric-card.png"
                            alt="Converto isometric mockup"
                            width={280}
                            height={280}
                            className="relative z-10 drop-shadow-lg pointer-events-none select-none"
                            priority
                        />
                    </div>
                </div>

                {/* Right: Value Points */}
                <div className="w-full md:w-1/2 flex flex-col gap-10 max-w-lg">
                    <h2
                        ref={headingRef}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
                    >
                        Kenapa<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5322d] to-rose-400">Converto</span>?
                    </h2>

                    {points.map((point, i) => {
                        const Icon = point.icon
                        const colorMap = {
                            rose: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-600 dark:text-rose-400' },
                            emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400' },
                            sky: { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-600 dark:text-sky-400' }
                        }
                        const colors = colorMap[point.color]
                        return (
                            <div
                                key={i}
                                ref={el => pointRefs.current[i] = el}
                                className="flex items-start gap-5 opacity-0"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                                    <Icon className="w-7 h-7" weight="bold" />
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{point.title}</h3>
                                    <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{point.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
