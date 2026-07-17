'use client'
import { useRef } from 'react'
import Link from 'next/link'

export default function Footer() {
    const textRef = useRef(null)

    const handleMouseMove = (e) => {
        if (!textRef.current) return
        const rect = textRef.current.getBoundingClientRect()
        // Calculate coordinate relative to the text element
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        textRef.current.style.setProperty('--x', `${x}px`)
        textRef.current.style.setProperty('--y', `${y}px`)
    }

    const handleMouseLeave = () => {
        if (!textRef.current) return
        // Hide the spotlight outside viewport boundaries
        textRef.current.style.setProperty('--x', `-2000px`)
        textRef.current.style.setProperty('--y', `-2000px`)
    }

    return (
        <footer className="w-full bg-background border-t border-slate-200 dark:border-slate-800 pt-24 pb-12 px-6 sm:px-16 flex flex-col gap-16 overflow-hidden relative z-20">
            {/* Top Row: Tagline and Navigation Columns */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 w-full max-w-6xl mx-auto">
                <div className="flex flex-col gap-2">
                    <span className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                        Infinite free conversions.
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                        Ubah multimedia dan lindungi integritas dokumen Anda secara gratis, 100% diproses aman di sisi klien.
                    </p>
                </div>

                <div className="flex gap-16 sm:gap-24">
                    {/* Columns */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            Alat
                        </span>
                        <Link href="/convert" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#e5322d] dark:hover:text-rose-400 transition-colors">
                            Converter
                        </Link>
                        <Link href="/sign-your-pdf" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#e5322d] dark:hover:text-rose-400 transition-colors">
                            e-Sign PDF
                        </Link>
                        <Link href="/verify/new" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#e5322d] dark:hover:text-rose-400 transition-colors">
                            Verifikasi
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            Project
                        </span>
                        <a href="https://github.com/ahmadsidikrofi/converto" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#e5322d] dark:hover:text-rose-400 transition-colors">
                            GitHub
                        </a>
                        <Link href="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#e5322d] dark:hover:text-rose-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#e5322d] dark:hover:text-rose-400 transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>

            {/* Giant Interactive Spotlight Text */}
            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full flex justify-center py-6 select-none cursor-default relative"
            >
                <h2
                    ref={textRef}
                    style={{
                        '--x': '-2000px',
                        '--y': '-2000px',
                        backgroundImage: 'radial-gradient(circle 200px at var(--x) var(--y), #e5322d 0%, currentColor 70%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                    className="text-[16vw] font-black tracking-wider text-center leading-none text-slate-900 dark:text-white transition-all select-none duration-75"
                >
                    Conver<span className='text-[#e5322d]'>t</span>o
                </h2>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 dark:border-slate-900 pt-8 gap-4 w-full max-w-6xl mx-auto">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 tracking-wider uppercase">
                    Converto Studio
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">
                    Made with ❤️ by Rofi
                </span>
            </div>
        </footer>
    )
}
