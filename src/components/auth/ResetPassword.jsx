import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ButtonBlobFill from "../shadcn-space/radix/button/ButtonBlobFill"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ArrowLeft, Loader } from "lucide-react"

const ResetPassword = ({ onBack, className, ...props }) => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!email.trim()) {
            setError("Email tidak boleh kosong")
            return
        }

        if (!email.includes("@")) {
            setError("Format email tidak valid (harus mengandung '@')")
            return
        }

        setIsLoading(true)
        try {
            const actionCodeSettings = {
                // Mengarahkan kembali ke halaman login (dinamis lokal / vercel)
                url: window.location.origin + "/login",
                handleCodeInApp: false,
            }
            await sendPasswordResetEmail(auth, email, actionCodeSettings)
            setSuccess("Link reset kata sandi telah dikirim ke email Anda. Silakan periksa folder masuk atau spam Anda.")
            setEmail("")
        } catch (err) {
            console.error("Gagal mengirim email reset:", err.code, err.message)
            if (err.code === "auth/user-not-found") {
                setError("Email tidak terdaftar.")
            } else if (err.code === "auth/invalid-email") {
                setError("Format email tidak valid.")
            } else {
                setError("Terjadi kesalahan. Silakan coba lagi.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="relative rounded-2xl overflow-hidden bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40">
                {/* Converto accent line at top */}
                <div className="h-1 w-full bg-gradient-to-r from-[#e5322d] via-rose-400 to-[#e5322d]" />

                {/* Card Header */}
                <div className="text-center pt-8 pb-2 px-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Setel Ulang Kata Sandi</h2>
                    <p className="text-sm text-slate-400 mt-1">Masukkan email Anda untuk menerima link reset</p>
                </div>

                {/* Card Content */}
                <div className="px-8 pb-8 pt-4">
                    {success ? (
                        <div className="space-y-6 text-center">
                            <div className="p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm rounded-xl leading-relaxed">
                                {success}
                            </div>
                            <Button
                                type="button"
                                onClick={onBack}
                                variant="ghost"
                                className="group w-full text-slate-400 hover:text-white rounded-xl h-11 hover:bg-white/10"
                            >
                                <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-2 transition-all duration-200" /> Kembali ke Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError("");
                                        }}
                                        className={cn(
                                            "bg-white/10 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-[#e5322d] focus-visible:border-[#e5322d] transition-colors",
                                            error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                                        )}
                                    />
                                    {error && (
                                        <span className="text-red-500 text-xs pl-1">{error}</span>
                                    )}
                                </div>

                                <ButtonBlobFill
                                    type="submit"
                                    text={isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="size-4 animate-spin" /> Mengirim...
                                        </span>
                                    ) : (
                                        "Kirim Link Reset"
                                    )}
                                    variant="secondary"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-[#e5322d] to-rose-600 hover:from-[#c42a26] hover:to-rose-700 rounded-xl h-11 text-white font-semibold shadow-lg shadow-[#e5322d]/20"
                                />

                                <div className="text-center pt-2">
                                    <Button
                                        type="button"
                                        onClick={onBack}
                                        variant="link"
                                        className="group text-sm text-slate-400 hover:text-white underline underline-offset-4 h-auto p-0"
                                    >
                                        <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-2 transition-all duration-200" /> Batal dan kembali ke Login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;