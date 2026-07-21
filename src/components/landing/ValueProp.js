'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightning, ShieldCheck, Infinity as InfinityIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { animate } from 'animejs'
import ScrollFloat from '@/components/ScrollFloat'

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
    const blobRef = useRef(null)
    const blobBgRef = useRef(null)
    const glowRef = useRef(null)
    const pointRefs = useRef([])
    const iconRefs = useRef([])
    const descRefs = useRef([])

    // ── SVG Morphing blob ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!blobRef.current) return
        animate(blobRef.current, {
            d: [
                'M45.7,-76.3C58.8,-69.3,68.7,-55.3,77.5,-41C86.3,-26.7,94.1,-11.1,91.8,3.2C89.5,17.5,77.2,30.5,65.8,42.5C54.4,54.5,43.9,65.5,30.6,71.2C17.3,76.9,1.1,77.3,-14.2,74.1C-29.5,70.9,-44,64.2,-55.9,53.8C-67.8,43.4,-77.2,29.3,-81.1,13.8C-85,-1.7,-83.4,-18.6,-76.3,-33C-69.2,-47.4,-56.6,-59.4,-42.6,-66C-28.6,-72.6,-13.2,-73.8,1.7,-76C16.6,-78.2,32.6,-83.3,45.7,-76.3Z',
                'M39.6,-65.4C51.6,-55.5,61.7,-43.5,69.5,-29.7C77.3,-15.9,82.8,-0.3,81.1,14.6C79.4,29.5,70.6,43.7,59.3,54.7C48,65.7,34.3,73.5,19.3,78.3C4.3,83.1,-12,84.9,-26.6,80.1C-41.2,75.3,-54.1,63.9,-64,50.4C-73.9,36.9,-80.8,21.3,-82.1,5.3C-83.4,-10.7,-79.1,-27.1,-69.8,-40.3C-60.5,-53.5,-46.2,-63.5,-31.9,-71C-17.6,-78.5,-3.3,-83.5,5.6,-80.4C14.5,-77.3,27.6,-75.3,39.6,-65.4Z'
            ],
            ease: 'inOutSine',
            duration: 4000,
            alternate: true,
            loop: true,
        })
    }, [])

    // ── GSAP: Layered Parallax + Kinetic Typography ───────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── [LAYER 1] Card – moderate depth parallax ──────────────────────
            gsap.to(cardRef.current, {
                rotateY: 360,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5,
                },
            })

            // Card vertical parallax — drifts up slower than scroll
            gsap.fromTo(cardRef.current,
                { y: 50 },
                {
                    y: -50,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 2,
                    },
                }
            )

            // ── [LAYER 2] Primary blob – faster parallax ──────────────────────
            gsap.fromTo(blobBgRef.current,
                { y: -80, x: -20 },
                {
                    y: 120,
                    x: 20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                    },
                }
            )

            // ── [LAYER 3] Radial glow – counter-parallax (opposite direction) ─
            gsap.fromTo(glowRef.current,
                { y: 60, scale: 0.8 },
                {
                    y: -80,
                    scale: 1.4,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 3,  // extra slow = deeper depth feel
                    },
                }
            )



            // ── STAGGERED REVEAL: Icon → Title → Desc per point ───────────────
            pointRefs.current.forEach((el, i) => {
                if (!el) return

                const icon = iconRefs.current[i]
                const title = el.querySelector('h3')
                const desc = descRefs.current[i]

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `${10 + i * 26}% center`,
                        end: `${28 + i * 26}% center`,
                        scrub: 1.2,
                    },
                })

                // 1st: Icon pops in with spring-like scale + slight rotation
                tl.fromTo(icon,
                    { scale: 0.4, opacity: 0, rotate: -15 },
                    { scale: 1, opacity: 1, rotate: 0, ease: 'back.out(2)', duration: 0.4 }
                )
                    // 2nd: Title slides up
                    .fromTo(title,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, ease: 'power3.out', duration: 0.4 },
                        '<0.15'
                    )
                    // 3rd: Description fades + slides
                    .fromTo(desc,
                        { y: 18, opacity: 0 },
                        { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
                        '<0.15'
                    )
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative w-full min-h-[250vh]">
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center px-6 sm:px-16 md:px-24 gap-12 md:gap-20 overflow-x-clip bg-transparent">

                {/* ── LAYER 3: Counter radial glow (deepest / slowest) ───────── */}
                <div
                    ref={glowRef}
                    className="absolute top-1/4 right-0 w-[400px] h-[400px] pointer-events-none -z-20"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(229,50,45,0.12) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                        willChange: 'transform',
                    }}
                />

                {/* ── LAYER 2: Primary morphing blob (mid-speed) ────────────── */}
                <div
                    ref={blobBgRef}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] opacity-15 dark:opacity-20 pointer-events-none blur-3xl -z-10"
                    style={{ willChange: 'transform' }}
                >
                    <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[#e5322d]">
                        <path ref={blobRef} d="M45.7,-76.3C58.8,-69.3,68.7,-55.3,77.5,-41C86.3,-26.7,94.1,-11.1,91.8,3.2C89.5,17.5,77.2,30.5,65.8,42.5C54.4,54.5,43.9,65.5,30.6,71.2C17.3,76.9,1.1,77.3,-14.2,74.1C-29.5,70.9,-44,64.2,-55.9,53.8C-67.8,43.4,-77.2,29.3,-81.1,13.8C-85,-1.7,-83.4,-18.6,-76.3,-33C-69.2,-47.4,-56.6,-59.4,-42.6,-66C-28.6,-72.6,-13.2,-73.8,1.7,-76C16.6,-78.2,32.6,-83.3,45.7,-76.3Z" />
                    </svg>
                </div>

                {/* ── LAYER 1: 3D Rotating Card ─────────────────────────────── */}
                <div className="w-full md:w-1/2 flex items-center justify-center" style={{ perspective: '1200px' }}>
                    <div
                        ref={cardRef}
                        className="w-[260px] sm:w-[320px] aspect-square rounded-[2.5rem] bg-gradient-to-br from-white to-rose-50 dark:from-slate-800 dark:to-rose-950/30 border border-slate-200/50 dark:border-rose-500/20 shadow-2xl shadow-rose-500/10 flex flex-col items-center justify-center text-center p-8 transform-gpu"
                        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                    >
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

                {/* ── RIGHT: Kinetic Typography + Staggered Points ──────────── */}
                <div className="w-full md:w-1/2 flex flex-col gap-10 max-w-lg">

                    {/* Kinetic Heading — ScrollFloat character reveal */}
                    <div className="flex flex-col gap-2">
                        <ScrollFloat
                            animationDuration={1}
                            ease='back.inOut(2)'
                            scrollStart='top bottom'
                            scrollEnd='bottom center'
                            stagger={0.02}
                            containerClassName='!my-0 leading-tight'
                            textClassName='!text-4xl sm:!text-5xl md:!text-6xl font-black tracking-tight text-slate-900 dark:text-white block leading-none pb-2'
                        >
                            Kenapa
                        </ScrollFloat>
                        <ScrollFloat
                            animationDuration={1}
                            ease='back.inOut(2)'
                            scrollStart='top bottom'
                            scrollEnd='bottom center'
                            stagger={0.02}
                            containerClassName='!my-0 leading-tight'
                            textClassName='!text-4xl sm:!text-5xl md:!text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#e5322d] to-rose-400 block leading-none pb-2'
                        >
                            Converto?
                        </ScrollFloat>
                    </div>

                    {/* Staggered value points */}
                    {points.map((point, i) => {
                        const Icon = point.icon
                        const colorMap = {
                            rose: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-600 dark:text-rose-400' },
                            emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400' },
                            sky: { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-600 dark:text-sky-400' },
                        }
                        const colors = colorMap[point.color]
                        return (
                            <div
                                key={i}
                                ref={el => pointRefs.current[i] = el}
                                className="flex items-start gap-5"
                            >
                                {/* Icon — animated first */}
                                <div
                                    ref={el => iconRefs.current[i] = el}
                                    className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 opacity-0`}
                                    style={{ willChange: 'transform, opacity' }}
                                >
                                    <Icon className="w-7 h-7" weight="bold" />
                                </div>

                                <div>
                                    <h3
                                        className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight opacity-0"
                                        style={{ willChange: 'transform, opacity' }}
                                    >
                                        {point.title}
                                    </h3>
                                    <p
                                        ref={el => descRefs.current[i] = el}
                                        className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mt-1 opacity-0"
                                        style={{ willChange: 'transform, opacity' }}
                                    >
                                        {point.desc}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}

