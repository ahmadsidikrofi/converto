import { RegisterForm } from "@/components/register-form";
import Image from "next/image";
import AuthBackground from "@/components/AuthBackground";

export default function RegisterPage() {
    return (
        <>
            <AuthBackground />
            <div className="flex min-h-svh items-center justify-center p-6 md:p-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl items-center gap-6 md:gap-10 lg:gap-20 animate-fade-in-up">

                    {/* Left: Hero Branding Block */}
                    <div className="hidden sm:flex flex-col gap-5">
                        <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
                            <div className="flex flex-row items-center">
                                C
                                <Image
                                    src="/Converto-logo.png"
                                    alt="Converto Logo"
                                    width={62}
                                    height={62}
                                    className="drop-shadow-[0_0_25px_rgba(229,50,45,0.3)]"
                                />

                                nverto<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5322d] to-rose-400">.</span>
                            </div>
                        </h1>

                        {/* Tagline */}
                        <p className="text-lg text-slate-200 max-w-sm leading-relaxed">
                            Bergabunglah secara gratis dan nikmati konversi file, tanda tangan digital, dan verifikasi dokumen tanpa batas.
                        </p>
                    </div>

                    {/* Mobile: Compact branding (shown only on small screens) */}
                    <div className="flex md:hidden items-center justify-center gap-3">
                        <Image src="/Converto-logo.png" alt="Converto Logo" width={45} height={45} />
                        <span className="text-2xl font-bold text-white">Converto.</span>
                    </div>

                    {/* Right: Register Form */}
                    <RegisterForm />
                </div>
            </div>
        </>
    );
}
