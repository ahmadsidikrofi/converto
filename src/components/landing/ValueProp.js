'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
    Lightning, 
    ShieldCheck, 
    Infinity as InfinityIcon, 
    Cpu, 
    LockSimple, 
    CheckCircle, 
    Activity, 
    HardDrive,
    TerminalWindow
} from '@phosphor-icons/react'
import ScrollFloat from '@/components/ScrollFloat'

gsap.registerPlugin(ScrollTrigger)

const points = [
    {
        icon: Lightning,
        tag: 'WASM Multi-Thread',
        title: 'Secepat Kilat',
        desc: 'Pemrosesan langsung di dalam memori WebAssembly peramban Anda. Hasil konversi selesai secara instan tanpa perlu antre di server eksternal.'
    },
    {
        icon: ShieldCheck,
        tag: 'SHA-256 Cryptography',
        title: 'Privasi Mutlak',
        desc: 'Berkas rahasia, video pribadi, maupun kontrak hukum tidak pernah di-upload ke server asing. Data terisolasi 100% di perangkat Anda.'
    },
    {
        icon: InfinityIcon,
        tag: 'Zero Quota Limits',
        title: 'Tanpa Batasan',
        desc: 'Bebas mengonversi video ukuran berat atau mentranscode ratusan berkas sekaligus tanpa batasan kuota harian ataupun registrasi.'
    }
]

export default function ValueProp() {
    const containerRef = useRef(null)
    const cardRef = useRef(null)
    const blobBgRef = useRef(null)
    const glowRef = useRef(null)
    const pointRefs = useRef([])
    const iconRefs = useRef([])
    const descRefs = useRef([])

    // ── GSAP: Layered Parallax + Kinetic Typography ───────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── [LAYER 1] Card – moderate depth parallax with 360 Y-rotation ────
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

            // ── [LAYER 2] Architectural Grid Blueprint – mid-speed parallax ───
            gsap.fromTo(blobBgRef.current,
                { y: -70, x: -15 },
                {
                    y: 100,
                    x: 15,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                    },
                }
            )

            // ── [LAYER 3] Telemetry accent box – counter-parallax ─────────────
            gsap.fromTo(glowRef.current,
                { y: 50, scale: 0.9 },
                {
                    y: -70,
                    scale: 1.1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 3,
                    },
                }
            )

            // ── STAGGERED REVEAL: Icon → Title → Desc per point ───────────────
            pointRefs.current.forEach((el, i) => {
                if (!el) return

                const icon = iconRefs.current[i]
                const title = el.querySelector('h3')
                const desc = descRefs.current[i]
                const tag = el.querySelector('.point-tag')

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `${10 + i * 26}% center`,
                        end: `${28 + i * 26}% center`,
                        scrub: 1.2,
                    },
                })

                // 1st: Icon & tag pop in
                tl.fromTo(icon,
                    { scale: 0.6, opacity: 0, y: 15 },
                    { scale: 1, opacity: 1, y: 0, ease: 'back.out(2)', duration: 0.4 }
                )
                .fromTo(tag,
                    { opacity: 0, x: -10 },
                    { opacity: 1, x: 0, ease: 'power2.out', duration: 0.3 },
                    '<0.1'
                )
                // 2nd: Title slides up
                .fromTo(title,
                    { y: 25, opacity: 0 },
                    { y: 0, opacity: 1, ease: 'power3.out', duration: 0.4 },
                    '<0.1'
                )
                // 3rd: Description fades + slides
                .fromTo(desc,
                    { y: 15, opacity: 0 },
                    { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
                    '<0.15'
                )
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} className="relative w-full min-h-[250vh] bg-transparent">
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center px-6 sm:px-16 md:px-20 lg:px-24 gap-12 md:gap-16 lg:gap-20 overflow-x-clip bg-transparent">

                {/* ── LAYER 3: Counter-Parallax Telemetry Element (Deepest layer) ─ */}
                <div
                    ref={glowRef}
                    className="absolute top-1/4 right-8 lg:right-1/4 w-40 h-40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/30 pointer-events-none -z-20 p-4 hidden sm:flex flex-col justify-between backdrop-blur-2xs"
                    style={{ willChange: 'transform' }}
                >
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>SYS_INFO</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-[#e5322d] rounded-full" />
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 dark:text-slate-400">LATENCY: 0.00ms</p>
                    </div>
                </div>

                {/* ── LAYER 2: Architectural Grid Blueprint (Mid-speed parallax) ─ */}
                <div
                    ref={blobBgRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:left-1/4 w-[340px] sm:w-[500px] md:w-[480px] lg:w-[540px] h-[440px] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10 p-5 flex flex-col justify-between opacity-70 dark:opacity-60"
                    style={{ willChange: 'transform' }}
                >
                    <div className="flex justify-between text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                        <span>ARCHITECTURE // CLIENT_MEM_MODULE</span>
                        <span>OFFLINE_CAPABLE</span>
                    </div>
                    <div className="flex justify-between items-end text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                        <span>ZERO SERVER UPLOAD FOOTPRINT</span>
                        <span>WASM &amp; SHA-256</span>
                    </div>
                </div>

                {/* ── LAYER 1: 3D Rotating Two-Sided Web-Based Card ───────────── */}
                <div className="w-full md:w-5/12 flex items-center justify-center shrink-0" style={{ perspective: '1400px' }}>
                    <div
                        ref={cardRef}
                        className="w-[280px] sm:w-[320px] lg:w-[350px] h-[340px] sm:h-[370px] relative transform-gpu select-none shadow-2xl shadow-slate-900/10 dark:shadow-none rounded-2xl"
                        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                    >
                        {/* ── FRONT FACE: WASM Compute Engine UI ── */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 flex flex-col justify-between [backface-visibility:hidden]">
                            {/* Window Top Bar */}
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#e5322d]" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 ml-2">WASM_ENGINE</span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[#e5322d] dark:text-rose-400">ACTIVE</span>
                            </div>

                            {/* Core Visual Performance Metrics */}
                            <div className="my-auto py-4 space-y-4 text-left">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                                        <span>TRANSCODE SPEED</span>
                                        <span className="text-slate-900 dark:text-white font-bold">MULTI-THREADED</span>
                                    </div>
                                    <div className="text-4xl sm:text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                                        45.8<span className="text-2xl text-[#e5322d] font-bold">x</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Local browser speed vs standard cloud encoders</p>
                                </div>

                                {/* Simulated Telemetry Wave Grid */}
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 space-y-2">
                                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Cpu weight="bold" className="w-4 h-4 text-emerald-500" />
                                            CPU Cores Utilized
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Local RAM</span>
                                    </div>
                                    <div className="grid grid-cols-6 gap-1 h-8 items-end">
                                        <div className="bg-[#e5322d] h-[60%] rounded-xs" />
                                        <div className="bg-[#e5322d] h-[90%] rounded-xs" />
                                        <div className="bg-[#e5322d]/80 h-[75%] rounded-xs" />
                                        <div className="bg-emerald-500 h-[100%] rounded-xs" />
                                        <div className="bg-[#e5322d] h-[85%] rounded-xs" />
                                        <div className="bg-emerald-500 h-[70%] rounded-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Status */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                                    <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500" />
                                    No Server Uploads
                                </span>
                                <span className="text-[11px] text-slate-400 font-bold">v0.12.10</span>
                            </div>
                        </div>

                        {/* ── BACK FACE (When GSAP flips card 180 deg): e-Sign Cryptography UI ── */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white backdrop-blur-xl p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
                            {/* Window Top Bar */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <LockSimple weight="bold" className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-mono font-bold text-slate-200">PDF_SECURITY_MODULE</span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 font-bold text-emerald-400">SHA-256</span>
                            </div>

                            {/* Center Security Blueprint */}
                            <div className="my-auto py-4 space-y-4 text-left">
                                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-semibold">
                                        <span>DOCUMENT INTEGRITY</span>
                                        <span className="text-emerald-400 font-mono">VERIFIED</span>
                                    </div>
                                    <p className="text-[11px] font-mono text-slate-400 break-all leading-relaxed bg-slate-900 p-2 rounded border border-slate-800">
                                        8f4e3ca218b96d8471c...99a721d009e
                                    </p>
                                </div>
                                <div className="space-y-2 text-xs text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Tanda Tangan Tinta &amp; QR Kriptografis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Anti-Tamper Contract Seal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Status */}
                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                                <span>NETWORK BANDWIDTH:</span>
                                <span className="font-bold text-emerald-400">0.00 KB (OFFLINE)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Kinetic Typography + Staggered Points ──────── */}
                <div className="w-full md:w-7/12 flex flex-col gap-8 md:gap-10 max-w-xl">

                    {/* Kinetic Heading — ScrollFloat character reveal (Preserved exactly as requested) */}
                    <div className="flex flex-col gap-1.5">
                        <ScrollFloat
                            animationDuration={1}
                            ease='back.inOut(2)'
                            scrollStart='top bottom'
                            scrollEnd='bottom center'
                            stagger={0.02}
                            containerClassName='!my-0 leading-tight'
                            textClassName='!text-4xl sm:!text-5xl md:!text-6xl font-black tracking-tight text-slate-900 dark:text-white block leading-none pb-2 font-sans'
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
                            textClassName='!text-4xl sm:!text-5xl md:!text-6xl font-black tracking-tight text-[#e5322d] dark:text-rose-500 block leading-none pb-2 font-sans'
                        >
                            Converto?
                        </ScrollFloat>
                    </div>

                    {/* Staggered value points — Engineered SaaS specs */}
                    <div className="space-y-8">
                        {points.map((point, i) => {
                            const Icon = point.icon;
                            return (
                                <div
                                    key={i}
                                    ref={el => pointRefs.current[i] = el}
                                    className="flex items-start gap-4.5 sm:gap-6 group"
                                >
                                    {/* Icon — animated first */}
                                    <div
                                        ref={el => iconRefs.current[i] = el}
                                        className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0 text-[#e5322d] dark:text-rose-400 transition-colors group-hover:border-[#e5322d]/40"
                                        style={{ willChange: 'transform, opacity' }}
                                    >
                                        <Icon className="w-6 sm:w-7 h-6 sm:h-7" weight="duotone" />
                                    </div>

                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3
                                                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight opacity-0 font-sans"
                                                style={{ willChange: 'transform, opacity' }}
                                            >
                                                {point.title}
                                            </h3>
                                            <span className="point-tag text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 opacity-0 uppercase tracking-wider">
                                                {point.tag}
                                            </span>
                                        </div>
                                        <p
                                            ref={el => descRefs.current[i] = el}
                                            className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed opacity-0 font-normal"
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

            </div>
        </section>
    )
}
