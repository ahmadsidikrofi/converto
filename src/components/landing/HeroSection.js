'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
    ArrowRight,
    CheckCircle,
    Lightning,
    FilePdf,
    ShieldCheck,
    Cpu,
    LockSimple,
    TerminalWindow,
    FileVideo,
    Fingerprint,
    GlobeX,
    FolderLock,
    ArrowsHorizontal
} from '@phosphor-icons/react'
import { Button } from "../ui/button"

export default function HeroSection() {
    const [activeTab, setActiveTab] = useState(0)
    const [simulatedProgress, setSimulatedProgress] = useState(68)

    // Smooth simulated transcode progress for the demo UI
    useEffect(() => {
        const timer = setInterval(() => {
            setSimulatedProgress((prev) => (prev >= 98 ? 32 : prev + 1))
        }, 800)
        return () => clearInterval(timer)
    }, [])

    const tabs = [
        { id: 0, title: "WASM Transcode Engine", icon: Cpu, badge: "Live Demo" },
        { id: 1, title: "e-Sign & Kriptografi PDF", icon: Fingerprint, badge: "SHA-256" },
        { id: 2, title: "Arsitektur Zero-Upload", icon: GlobeX, badge: "100% Offline" }
    ]

    return (
        <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-28 md:pt-32 md:pb-36 overflow-x-clip bg-white dark:bg-slate-950">
            {/* Architectural Grid Background with Edge Fading */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Subtle Horizontal Architectural Divider */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800/80 to-transparent pointer-events-none" />

            <div className="z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-6xl mx-auto w-full">
                {/* Main Heading - Clean SaaS Engineering Typography */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 max-w-4xl leading-[1.08] mb-6 font-sans"
                >
                    Konversi File & Tanda Tangani PDF.{' '}
                    <span className="text-slate-500 dark:text-slate-400 font-bold block sm:inline">
                        Langsung di Browser Anda.
                    </span>
                </motion.h1>

                {/* Sub-Headline - Functional & Technical Explanation */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed mb-10"
                >
                    Ditenagai <span className="text-slate-900 dark:text-slate-200 font-semibold">WebAssembly (WASM)</span> untuk pemrosesan video, audio, dan gambar secara lokal. Dilengkapi tanda tangan PDF berverifikasi kriptografis SHA-256—<span className="underline decoration-[#e5322d]/40 underline-offset-4 font-medium">tanpa proses upload ke server eksternal.</span>
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto justify-center mb-8"
                >
                    <Link href="/convert" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto rounded-xl px-7 py-6 bg-[#e5322d] hover:bg-[#d12823] text-white font-semibold text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2.5 group">
                            <Lightning weight="fill" className="w-5 h-5 text-white/90" />
                            <span>Mulai Konversi Sekarang</span>
                            <ArrowRight weight="bold" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link href="/sign-your-pdf" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto rounded-xl px-7 py-6 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-2xs">
                            <FilePdf weight="duotone" className="w-5 h-5 text-emerald-500" />
                            <span>e-Sign & Verifikasi PDF</span>
                        </Button>
                    </Link>
                </motion.div>

                {/* Trust Metrics / Micro-Copy Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 max-w-3xl mb-16"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">0 KB</span> Bandwidth Upload
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                        Tanpa Registrasi & Batasan File
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                        Enkripsi SHA-256 Lokal
                    </div>
                </motion.div>

                {/* THE PROOF ENGINE: Interactive SaaS Technical Preview Console */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                    className="w-full max-w-5xl text-left rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-slate-900/5 dark:shadow-none overflow-hidden backdrop-blur-xl"
                >
                    {/* Window Header / Tab Switcher */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 gap-3">
                        <div className="flex items-center gap-2 sm:mr-4">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 ml-2 hidden md:inline">
                                converto-engine-v2.wasm
                            </span>
                        </div>

                        {/* Interactive Navigation Tabs */}
                        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-200/50 dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${isActive
                                                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#e5322d]' : 'text-slate-400'}`} />
                                        <span>{tab.title}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${isActive ? 'bg-[#e5322d]/10 text-[#e5322d] dark:bg-rose-500/10 dark:text-rose-400' : 'bg-slate-300/50 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                            {tab.badge}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Console Interactive Body */}
                    <div className="p-6 sm:p-8 min-h-[340px] flex flex-col justify-between bg-white dark:bg-slate-950/40 font-sans">
                        <AnimatePresence mode="wait">
                            {activeTab === 0 && (
                                <motion.div
                                    key="tab-0"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-[#e5322d]">
                                                <FileVideo weight="duotone" className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">raw_4k_footage_v2.mp4</span>
                                                    <span className="text-[11px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-slate-600 dark:text-slate-300">146.2 MB</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                                                    <span>Target: MKV (libx264 Ultrafast Preset)</span>
                                                    <span>•</span>
                                                    <span className="text-emerald-500 font-semibold">Offline Transcoding</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col md:items-end">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">Sisa Waktu: 1m 14s</span>
                                                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">{simulatedProgress}%</span>
                                            </div>
                                            <div className="w-full md:w-48 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#e5322d] transition-all duration-300 rounded-full"
                                                    style={{ width: `${simulatedProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulated Log Terminal */}
                                    <div className="rounded-xl bg-slate-900 dark:bg-slate-950 p-4 border border-slate-800 text-slate-300 font-mono text-xs space-y-2 leading-relaxed shadow-inner overflow-hidden">
                                        <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800 pb-2 mb-2">
                                            <span className="flex items-center gap-1.5">
                                                <TerminalWindow className="w-4 h-4 text-emerald-400" />
                                                WASM Worker Console Output
                                            </span>
                                            <span>WebAssembly Core v0.12.10</span>
                                        </div>
                                        <p className="text-emerald-400">&gt; [system] WASM memory initialized successfully in client browser.</p>
                                        <p>&gt; [ffmpeg] Input: Video 3840x2160 (4K), H.264 Audio AAC 48kHz Stereo</p>
                                        <p>&gt; [transcode] Applying high-performance CPU preset: -preset ultrafast -crf 28</p>
                                        <p className="text-amber-300/90">&gt; [progress] frame=1420 fps=118 q=28.0 size=34816kB time=00:01:12.42 bitrate=3936.1kbits/s</p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 1 && (
                                <motion.div
                                    key="tab-1"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Enkripsi Kriptografis</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                Setiap dokumen ditandatangani menggunakan algoritma hash SHA-256 yang secara instan mengunci integritas isi berkas PDF Anda.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                                <Fingerprint className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Verifikasi Tanpa Ragu</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                Sistem QR Code dan metadata kriptografis memungkinkan pihak ketiga memverifikasi keaslian dokumen kapan saja tanpa keragu-raguan.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                                <FolderLock className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Privasi Dokumen Hukum</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                Dokumen rahasia atau surat penting tidak pernah menyentuh cloud server. Seluruh proses penandatanganan diselesaikan secara lokal di browser.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mock Document Hash Verification Stamp */}
                                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-200 font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                                                <LockSimple weight="bold" className="w-4 h-4" />
                                                <span>DOKUMEN TERVERIFIKASI &amp; BERKUNCI DIGITAL</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-mono break-all">
                                                Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                                            </p>
                                        </div>
                                        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 font-mono font-bold text-xs shrink-0">
                                            VALIDATED SHA-256
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 2 && (
                                <motion.div
                                    key="tab-2"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Traditional Cloud Converter */}
                                        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 relative opacity-75">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Konverter Cloud Biasa</span>
                                                <span className="text-[11px] px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded font-semibold">Risiko Kebocoran Data</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
                                                Alamat File: Browser ➔ Internet ➔ Server Cloud Pihak Ketiga
                                            </p>
                                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                    Waktu tunggu lama untuk upload dan download file berukuran besar.
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                    File pribadi disimpan tạm di server asing yang rentan diretas.
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                    Sering terdapat pembatasan ukuran file (misal maksimal 50 MB).
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Converto Client-Side Engine */}
                                        <div className="p-5 rounded-xl border-2 border-[#e5322d]/40 dark:border-rose-500/40 bg-white dark:bg-slate-900/90 relative shadow-lg shadow-rose-500/5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold font-mono text-[#e5322d] dark:text-rose-400 uppercase tracking-wider">Converto WASM Architecture</span>
                                                <span className="text-[11px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded font-semibold">100% Client-Side RAM</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                                                Alamat File: Memori Browser (Proses Secara Lokal Langsung Selesai)
                                            </p>
                                            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium">
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    0 KB bandwidth internet terpakai untuk transfer berkas ke server.
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Keamanan 100% mutlak: Berkas tidak pernah meninggalkan komputer Anda.
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Konversi multi-file &amp; ukuran besar sesuka hati tanpa batasan sistem.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Console Footer Specification Strip */}
                        <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="font-semibold text-slate-700 dark:text-slate-300">SYSTEM STATUS: ALL ENGINES OPERATIONAL</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[11px]">
                                <span>CLIENT_STORAGE: IN_MEMORY</span>
                                <span>•</span>
                                <span>SEC_MODULE: ENABLED</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
