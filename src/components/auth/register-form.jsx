'use client'

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ButtonBlobFill from "../shadcn-space/radix/button/ButtonBlobFill"
import InputWithAnimatedCheckmark from "../shadcn-space/radix/input/InputWithAnimatedCheckmark"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"
import { postUserToFirestore } from "@/lib/services/user"

export function RegisterForm({
    className,
    ...props
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;
        const newErrors = { email: "", password: "" };

        if (!email.trim()) {
            newErrors.email = "Email tidak boleh kosong";
            valid = false;
        } else if (!email.includes("@")) {
            newErrors.email = "Format email tidak valid (harus mengandung '@')";
            valid = false;
        }

        if (!password) {
            newErrors.password = "Kata sandi tidak boleh kosong";
            valid = false;
        } else {
            const hasNumber = /\d/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            if (password.length < 10 || !hasNumber || !hasUppercase || !hasSpecial) {
                newErrors.password = "Kata sandi belum memenuhi syarat keamanan";
                valid = false;
            }
        }

        setErrors(newErrors);

        if (valid) {
            setIsLoading(true)
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const res = userCredential.user
                await postUserToFirestore(res)
                router.push('/')
            } catch (error) {
                if (error.code === "auth/email-already-in-use") {
                    setErrors(prev => ({ ...prev, email: "Email ini sudah terdaftar." }))
                } else if (error.code === "auth/invalid-email") {
                    setErrors(prev => ({ ...prev, email: "Format email tidak valid." }))
                } else if (error.code === "auth/weak-password") {
                    setErrors(prev => ({ ...prev, password: "Kata sandi terlalu lemah" }))
                } else {
                    setErrors(prev => ({ ...prev, email: "Terjadi kesalahan saat mendaftar. Coba lagi." }))
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider()
        try {
            setIsLoading(true)
            const res = await signInWithPopup(auth, provider)
            await postUserToFirestore(res.user)
            router.push('/')
        } catch (error) {
            console.error("Gagal masuk lewat Google:", error.code, error.message)
            if (error.code !== "auth/popup-closed-by-user") {
                setErrors((prev) => ({ ...prev, email: "Gagal masuk: " + error.message }))
            } else {
                setErrors((prev) => ({ ...prev, email: "" }))
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {/* Frosted Glass Card */}
            <div className="relative rounded-2xl overflow-hidden bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
                {/* Converto accent line at top */}
                <div className="h-1 w-full bg-gradient-to-r from-[#e5322d] via-rose-400 to-[#e5322d]" />

                {/* Card Header */}
                <div className="text-center pt-8 pb-2 px-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Buat Akun Baru</h2>
                    <p className="text-sm text-slate-400 mt-1">Bergabung dengan Converto secara gratis</p>
                </div>

                {/* Card Content */}
                <div className="px-8 pb-8 pt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5">
                            {/* Google Login Button */}
                            <Button
                                onClick={handleGoogleSignIn}
                                variant="ghost"
                                disabled={isLoading}
                                type="button"
                                className="w-full flex items-center justify-center gap-2.5 rounded-xl h-11 bg-white/10 hover:bg-white/15 border border-white/10 text-white hover:text-white/80 cursor-pointer transition-all duration-200"
                            >
                                {isLoading ? (
                                    <Loader className="size-4 animate-spin transition-all duration-800" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                    </svg>
                                )}
                                <span className="text-sm font-medium">Daftar dengan Google</span>
                            </Button>

                            {/* Divider */}
                            <div className="relative text-center text-sm">
                                <div className="absolute inset-0 top-1/2 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <span className="relative z-10 bg-black/60 px-3 text-slate-500 text-xs uppercase tracking-widest">
                                    atau
                                </span>
                            </div>

                            {/* Email & Password with Animated Checkmark */}
                            <div className="grid gap-4">
                                <InputWithAnimatedCheckmark
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    emailError={errors.email}
                                    passwordError={errors.password}
                                />

                                {/* Submit Button */}
                                <ButtonBlobFill
                                    type="submit"
                                    text={isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="size-4 animate-spin" /> Memproses...
                                        </span>
                                    ) : (
                                        "Daftarkan ke Converto"
                                    )}
                                    variant="secondary"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-[#e5322d] to-rose-600 hover:from-[#c42a26] hover:to-rose-700 rounded-xl h-11 text-white font-semibold shadow-lg shadow-[#e5322d]/20"
                                />
                            </div>

                            {/* Login Link */}
                            <div className="text-center text-sm text-slate-400">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-[#e5322d] hover:text-rose-400 underline underline-offset-4 font-medium transition-colors">
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
