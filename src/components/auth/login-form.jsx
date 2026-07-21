'use client'

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ButtonBlobFill from "../shadcn-space/radix/button/ButtonBlobFill"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Eye, EyeClosed, Loader } from "lucide-react"
import ResetPassword from "./ResetPassword"

export function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openResetPassword, setOpenResetPassword] = useState(false)
  const router = useRouter()

  if (openResetPassword) {
    return <ResetPassword onBack={() => setOpenResetPassword(false)} className={className} {...props} />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      newErrors.password = "Password tidak boleh kosong";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true)
      try {
        await signInWithEmailAndPassword(auth, email, password)
        router.push('/')
      } catch (error) {
        console.log(error)
        newErrors.email = "Email atau password salah"
        newErrors.password = ""
        setErrors(newErrors)
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
          <p className="text-sm text-slate-400 mt-1">Masuk ke akun Converto Anda</p>
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
                <span className="text-sm font-medium">Masuk dengan Google</span>
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

              {/* Email & Password Fields */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={cn(
                      "bg-white/10 border-white/10 text-white placeholder:text-slate-200 rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-[#e5322d] focus-visible:border-[#e5322d] transition-colors",
                      errors.email && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                    )}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs pl-1">{errors.email}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-slate-300 text-sm">Kata Sandi</Label>
                    <Button onClick={() => setOpenResetPassword(true)} variant="link" className="h-auto p-0 ml-auto text-xs text-slate-500 hover:text-[#e5322d] underline-offset-4 hover:underline transition-colors">
                      Lupa kata sandi?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={cn(
                      "bg-white/10 border-white/10 text-white placeholder:text-slate-200 rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-[#e5322d] focus-visible:border-[#e5322d] transition-colors",
                      errors.password && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                    )}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs pl-1">{errors.password}</span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-12 bottom-[118px] -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-transparent"
                >
                  {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </Button>

                {/* Submit Button */}
                <ButtonBlobFill
                  type="submit"
                  text={isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="size-4 animate-spin" /> Memasuki...
                    </span>
                  ) : (
                    "Masuk ke Converto"
                  )}
                  variant="secondary"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#e5322d] to-rose-600 hover:from-[#c42a26] hover:to-rose-700 rounded-xl h-11 text-white font-semibold shadow-lg shadow-[#e5322d]/20"
                />
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-slate-400">
                Belum punya akun?{" "}
                <Link href="/register" className="text-[#e5322d] hover:text-rose-400 underline underline-offset-4 font-medium transition-colors">
                  Daftar sekarang
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
