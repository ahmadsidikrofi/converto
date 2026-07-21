'use client';

import ScrollReveal from '@/components/ScrollReveal';

export default function Manifesto() {
    return (
        <section className="relative w-full bg-background flex flex-col md:flex-row items-start justify-between px-6 sm:px-16 md:px-24">

            {/* Left Side: Context / Branding (Pinned) */}
            <div className="sticky top-0 h-screen w-full md:w-1/2 flex flex-col justify-center gap-6 md:pr-10 z-10">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    Privasi Anda, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5322d] to-rose-400">Prioritas Kami.</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed max-w-md font-medium">
                    Kami memindahkan studio konversi langsung ke dalam browser Anda. Tidak ada waktu tunggu upload. Tidak ada resiko kebocoran data.
                </p>
                <div className="mt-4">
                    <button className="px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm tracking-wide hover:scale-105 transition-transform">
                        MULAI KONVERSI
                    </button>
                </div>
            </div>

            {/* Right Side: Giant Manifesto Typography (Scrolls naturally) */}
            <div className="w-full md:w-1/2 relative py-[30vh] md:py-[50vh]">
                {/* Subtle background glow for the text */}
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                <ScrollReveal
                    baseOpacity={0.05}
                    enableBlur={true}
                    baseRotation={3}
                    blurStrength={10}
                    containerClassName="max-w-3xl ml-auto"
                    textClassName="text-[clamp(1.8rem,4vw,4.5rem)] leading-[1.2] font-black text-slate-900 dark:text-white tracking-tight text-left"
                    rotationEnd="bottom center"
                    wordAnimationEnd="bottom center"
                >
                    Kenapa harus mengunggah file rahasia Anda ke server orang lain? Converto memproses semuanya langsung di perangkat Anda. Tanpa waktu upload. Tanpa risiko privasi. Lebih cepat, lebih aman, sepenuhnya milik Anda.
                </ScrollReveal>
            </div>

        </section>
    );
}
