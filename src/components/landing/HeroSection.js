'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import Link from 'next/link'
import { ArrowRight, Star } from '@phosphor-icons/react'
import { Button } from "../ui/button"

export default function HeroSection() {
    const blobRef = useRef(null)

    useEffect(() => {
        // SVG Morphing Animation
        animate(blobRef.current, {
            d: [
                "M45.7,-76.3C58.8,-69.3,68.7,-55.3,77.5,-41C86.3,-26.7,94.1,-11.1,91.8,3.2C89.5,17.5,77.2,30.5,65.8,42.5C54.4,54.5,43.9,65.5,30.6,71.2C17.3,76.9,1.1,77.3,-14.2,74.1C-29.5,70.9,-44,64.2,-55.9,53.8C-67.8,43.4,-77.2,29.3,-81.1,13.8C-85,-1.7,-83.4,-18.6,-76.3,-33C-69.2,-47.4,-56.6,-59.4,-42.6,-66C-28.6,-72.6,-13.2,-73.8,1.7,-76C16.6,-78.2,32.6,-83.3,45.7,-76.3Z",
                "M39.6,-65.4C51.6,-55.5,61.7,-43.5,69.5,-29.7C77.3,-15.9,82.8,-0.3,81.1,14.6C79.4,29.5,70.6,43.7,59.3,54.7C48,65.7,34.3,73.5,19.3,78.3C4.3,83.1,-12,84.9,-26.6,80.1C-41.2,75.3,-54.1,63.9,-64,50.4C-73.9,36.9,-80.8,21.3,-82.1,5.3C-83.4,-10.7,-79.1,-27.1,-69.8,-40.3C-60.5,-53.5,-46.2,-63.5,-31.9,-71C-17.6,-78.5,-3.3,-83.5,5.6,-80.4C14.5,-77.3,27.6,-75.3,39.6,-65.4Z"
            ],
            ease: 'inOutSine',
            duration: 4000,
            alternate: true,
            loop: true
        });

        // Entrance Animation for Content
        animate('.hero-content', {
            translateY: [30, 0],
            opacity: [0, 1],
            ease: 'outExpo',
            duration: 1500,
            delay: stagger(150)
        });
    }, [])

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
            {/* Morphing Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-15 dark:opacity-20 pointer-events-none blur-3xl">
                <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[#e5322d]">
                    <path ref={blobRef} d="M45.7,-76.3C58.8,-69.3,68.7,-55.3,77.5,-41C86.3,-26.7,94.1,-11.1,91.8,3.2C89.5,17.5,77.2,30.5,65.8,42.5C54.4,54.5,43.9,65.5,30.6,71.2C17.3,76.9,1.1,77.3,-14.2,74.1C-29.5,70.9,-44,64.2,-55.9,53.8C-67.8,43.4,-77.2,29.3,-81.1,13.8C-85,-1.7,-83.4,-18.6,-76.3,-33C-69.2,-47.4,-56.6,-59.4,-42.6,-66C-28.6,-72.6,-13.2,-73.8,1.7,-76C16.6,-78.2,32.6,-83.3,45.7,-76.3Z" />
                </svg>
            </div>

            <div className="z-10 flex flex-col items-center text-center px-4 max-w-4xl">
                <div className="hero-content opacity-0 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 mb-6 border border-rose-200 dark:border-rose-900/50 shadow-sm">
                    Memperkenalkan Converto
                </div>

                <h1 className="hero-content opacity-0 text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                    Ubah & Tanda Tangani <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5322d] to-rose-400">
                        Tanpa Batas.
                    </span>
                </h1>

                <p className="hero-content opacity-0 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
                    Satu platform andalan untuk konversi gambar, audio, dan video. Kini dilengkapi fitur e-Sign PDF dengan verifikasi kriptografi tingkat tinggi. Gratis selamanya.
                </p>

                <div className="hero-content opacity-0 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <Link href="/convert">
                        <Button className="rounded-full w-full sm:w-auto px-4 py-6 bg-[#e5322d] hover:bg-rose-600 text-white font-bold text-lg shadow-lg shadow-rose-500/25 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            Mulai Konversi
                        </Button>
                    </Link>
                    <Link href="/sign-your-pdf">
                        <Button className="rounded-full w-full sm:w-auto px-4 py-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 text-slate-700 dark:text-slate-200 font-bold text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-lg flex items-center justify-center gap-2">
                            Coba e-Sign PDF <ArrowRight weight="bold" className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
