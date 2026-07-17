'use client'
import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { QrCode, ArrowRight } from "@phosphor-icons/react"
import Link from 'next/link'

export default function ScrollCard() {
    const wrapperRef = useRef(null)
    const cardRef = useRef(null)

    useEffect(() => {
        // Setup animation
        const anim = animate(cardRef.current, {
            rotateX: [30, -15],
            rotateY: [-35, 25],
            rotateZ: [-5, 5],
            scale: [0.8, 1.1],
            ease: 'linear',
            autoplay: false
        })

        const onScroll = () => {
            if(!wrapperRef.current) return
            
            const rect = wrapperRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            
            // Progress goes from 0 to 1 as the element passes through the viewport
            const scrollDistance = windowHeight + rect.height
            const scrolled = windowHeight - rect.top
            
            let progress = scrolled / scrollDistance
            // Clamp between 0 and 1
            progress = Math.max(0, Math.min(1, progress))
            
            anim.seek(anim.duration * progress)
        }

        window.addEventListener('scroll', onScroll)
        // trigger once
        onScroll()
        
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <section ref={wrapperRef} className="py-40 w-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/30">
            {/* The 3D perspective wrapper */}
            <div style={{ perspective: '1200px' }} className="relative group">
                
                {/* The Card */}
                <div 
                    ref={cardRef} 
                    className="w-[320px] sm:w-[400px] aspect-[4/3] bg-gradient-to-tr from-white to-rose-50 dark:from-slate-800 dark:to-rose-950/40 rounded-[2.5rem] p-8 border border-white/50 dark:border-rose-500/20 shadow-2xl shadow-rose-500/10 flex flex-col items-center justify-center text-center transform-gpu"
                >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full pointer-events-none"></div>

                    <QrCode weight="duotone" className="w-20 h-20 text-[#e5322d] mb-6 relative z-10" />
                    
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 relative z-10 tracking-tight">
                        Integritas Mutlak.
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 relative z-10 leading-relaxed max-w-[250px]">
                        Rasakan pengalaman Tanda Tangan Digital masa depan yang tak bisa dipalsukan.
                    </p>
                    
                    <Link href="/sign-your-pdf" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm relative z-10 shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2">
                        Buktikan Sekarang <ArrowRight weight="bold" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
