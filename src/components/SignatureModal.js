'use client'

import React, { useState, useEffect, useRef } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAuth } from "@/lib/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { appToast as toast } from "@/store/useToastStore"
import {
    PenNib,
    QrCode,
    ArrowCounterClockwise,
    Info,
    FloppyDisk,
    CheckCircle,
    Trash,
} from "@phosphor-icons/react"
import { Pen } from 'lucide-react';

const LOCAL_STORAGE_KEY = "converto_saved_signature"
const LOCAL_STORAGE_NAME_KEY = "converto_saved_signer_name"

export default function SignatureModal({
    isOpen,
    onOpenChange,
    onApplySignature,
    signerName,
    setSignerName
}) {
    const { user, userData } = useAuth()
    const sigCanvas = useRef(null)

    // Saved signature state
    const [savedSignature, setSavedSignature] = useState(null)
    const [shouldSaveSignature, setShouldSaveSignature] = useState(true)
    const [selectedTab, setSelectedTab] = useState("draw")
    const [selectedPenColor, setSelectedPenColor] = useState("black")
    const [isSavingCloud, setIsSavingCloud] = useState(false)

    // Load saved signature on mount / when auth changes
    useEffect(() => {
        const loadSignature = async () => {
            // 1. Coba baca dari LocalStorage terlebih dahulu (Instan 0ms)
            if (typeof window !== "undefined") {
                const localSig = localStorage.getItem(LOCAL_STORAGE_KEY)
                const localName = localStorage.getItem(LOCAL_STORAGE_NAME_KEY)

                if (localSig) {
                    setSavedSignature(localSig)
                    setSelectedTab("saved")
                }
                if (localName && setSignerName && !signerName) {
                    setSignerName(localName)
                }
            }

            // 2. Jika user login, cek sinkronisasi Firestore
            if (user?.uid) {
                try {
                    const userDocRef = doc(db, "users", user.uid)
                    const userDocSnap = await getDoc(userDocRef)
                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data()
                        if (data.savedSignature) {
                            setSavedSignature(data.savedSignature)
                            setSelectedTab("saved")
                            // Update local storage cache
                            localStorage.setItem(LOCAL_STORAGE_KEY, data.savedSignature)
                        }
                        if (data.savedSignerName && setSignerName && !signerName) {
                            setSignerName(data.savedSignerName)
                            localStorage.setItem(LOCAL_STORAGE_NAME_KEY, data.savedSignerName)
                        }
                    }
                } catch (err) {
                    console.warn("Gagal sinkronisasi tanda tangan dari cloud:", err)
                }
            }
        }

        if (isOpen) {
            loadSignature()
        }
    }, [isOpen, user?.uid])

    // Save signature to Storage & Firestore
    const persistSignature = async (dataURL) => {
        // Simpan ke LocalStorage
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, dataURL)
            if (signerName) {
                localStorage.setItem(LOCAL_STORAGE_NAME_KEY, signerName)
            }
            setSavedSignature(dataURL)
        } catch (e) {
            console.error("Gagal simpan ke localStorage:", e)
        }

        // Simpan ke Firebase jika user login
        if (user?.uid) {
            setIsSavingCloud(true)
            try {
                const userDocRef = doc(db, "users", user.uid)
                await setDoc(userDocRef, {
                    savedSignature: dataURL,
                    savedSignerName: signerName || "",
                    savedSignatureUpdatedAt: new Date().toISOString()
                }, { merge: true })
            } catch (err) {
                console.error("Gagal simpan tanda tangan ke Firestore:", err)
            } finally {
                setIsSavingCloud(false)
            }
        }
    }

    // Delete saved signature
    const handleDeleteSavedSignature = async () => {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY)
            setSavedSignature(null)
            setSelectedTab("draw")

            if (user?.uid) {
                const userDocRef = doc(db, "users", user.uid)
                await setDoc(userDocRef, {
                    savedSignature: null,
                    savedSignatureUpdatedAt: new Date().toISOString()
                }, { merge: true })
            }
            toast.success("Tanda tangan tersimpan berhasil dihapus", {
                position: 'top-center',
                style: { background: "#dcfce7", color: "#166534", border: "1px solid #4ade80" },
            })
        } catch (error) {
            console.error("Gagal menghapus TTD:", error)
            toast.error("Gagal menghapus tanda tangan tersimpan")
        }
    }

    // Handle apply from DRAW tab
    const handleApplyFromDraw = async (mode) => {
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
            toast.info("Harap buat coretan terlebih dahulu", {
                position: 'top-center',
                style: { background: "#fee2e2", color: "#991b1b", border: "1px solid #b91c1c" },
            })
            return
        }

        const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')

        // Jika user memilih untuk menyimpan
        if (shouldSaveSignature) {
            await persistSignature(dataURL)
        }

        onApplySignature(dataURL, mode)
        onOpenChange(false)
    }

    // Handle apply from SAVED tab
    const handleApplyFromSaved = (mode) => {
        if (!savedSignature) return
        onApplySignature(savedSignature, mode)
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] rounded-2xl p-0 overflow-hidden bg-background">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                            <PenNib className="w-5 h-5 text-rose-500" weight="fill" />
                            Tanda Tangan Digital
                        </DialogTitle>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Pilih tanda tangan tersimpan atau gambar tanda tangan baru untuk dokumen PDF Anda.
                    </p>
                </DialogHeader>

                {/* Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <div className="px-6">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-1 rounded-xl">
                            <TabsTrigger
                                value="saved"
                                disabled={!savedSignature}
                                className="rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs flex items-center gap-1.5"
                            >
                                <FloppyDisk className="w-4 h-4 text-emerald-500" weight="fill" />
                                TTD Tersimpan
                            </TabsTrigger>
                            <TabsTrigger
                                value="draw"
                                className="rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs flex items-center gap-1.5"
                            >
                                <Pen className="w-4 h-4 text-rose-500" weight="fill" />
                                Gambar Baru
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ================= TAB 1: SAVED SIGNATURE ================= */}
                    <TabsContent value="saved" className="mt-4 focus-visible:outline-none">
                        {savedSignature ? (
                            <div className="space-y-4 px-6">
                                {/* Saved Signature Card Preview */}
                                <div className="border-2 border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-b from-emerald-50/30 to-transparent dark:from-emerald-950/20 rounded-2xl p-5 flex flex-col items-center justify-center relative group">
                                    <div className="h-32 w-full flex items-center justify-center bg-white dark:bg-slate-900/90 rounded-xl border border-border shadow-inner p-4">
                                        <img
                                            src={savedSignature}
                                            alt="Tanda Tangan Tersimpan"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>

                                    {/* Action row under preview */}
                                    <div className="w-full flex items-center justify-between mt-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                            <CheckCircle className="w-4 h-4" weight="fill" />
                                            Siap ditempelkan langsung ke PDF
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleDeleteSavedSignature}
                                            className="text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 font-medium transition-colors"
                                        >
                                            <Trash className="w-3.5 h-3.5" />
                                            Hapus TTD
                                        </button>
                                    </div>
                                </div>

                                {/* Multi-Signer Notice */}
                                <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-900/50 rounded-xl p-3 flex gap-3 items-start">
                                    <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" weight="fill" />
                                    <div>
                                        <h4 className="text-xs font-bold text-sky-800 dark:text-sky-400">Informasi Penandatangan</h4>
                                        <p className="text-[11px] text-sky-700/80 dark:text-sky-500/80 mt-0.5 leading-relaxed">
                                            Pilih opsi output di bawah ini. Tanda tangan tersimpan akan langsung ditempelkan pada halaman aktif dokumen Anda.
                                        </p>
                                    </div>
                                </div>

                                {/* Output Options */}
                                <div className="border-t border-border/80 pt-4 pb-4">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                                        Tempelkan ke PDF sebagai:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleApplyFromSaved('signature')}
                                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all text-left group shadow-xs"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 group-hover:bg-rose-500/20 transition-colors">
                                                <PenNib className="w-4 h-4 text-rose-500" weight="fill" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-semibold text-foreground">Coretan Saja</p>
                                                <p className="text-[10px] text-muted-foreground">TTD tinta digital</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleApplyFromSaved('qrcode')}
                                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all text-left group shadow-xs"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                                                <QrCode className="w-4 h-4 text-sky-500" weight="fill" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-semibold text-foreground">QR Code Saja</p>
                                                <p className="text-[10px] text-muted-foreground">Verifikasi digital</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleApplyFromSaved('both')}
                                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-500 hover:bg-emerald-50/70 transition-all text-left group shadow-xs"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                                                <PenNib className="w-4 h-4 text-emerald-600 dark:text-emerald-400" weight="fill" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">Keduanya</p>
                                                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Coretan + QR Code</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                                Belum ada tanda tangan yang tersimpan.
                            </div>
                        )}
                    </TabsContent>

                    {/* ================= TAB 2: DRAW NEW ================= */}
                    <TabsContent value="draw" className="mt-4 focus-visible:outline-none space-y-4">
                        {/* Canvas Area */}
                        <div className="mx-6 border-2 border-dashed border-border rounded-xl bg-white dark:bg-slate-900 flex flex-col justify-center overflow-hidden relative shadow-inner">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor={selectedPenColor}
                                canvasProps={{
                                    className: 'w-full sm:w-[600px] h-[190px] bg-transparent cursor-crosshair'
                                }}
                            />
                            {/* Signature line hint */}
                            <div className="absolute bottom-10 left-8 right-8 border-b border-border/80 pointer-events-none" />

                            <div className="flex items-center justify-between px-6 pb-2.5 pt-1 bg-muted/20 border-t border-border/40">
                                {/* Ink color selection */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-muted-foreground font-medium">Tinta:</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPenColor("black")}
                                        className={`w-5 h-5 rounded-full bg-slate-900 border-2 transition-all ${selectedPenColor === "black" ? "border-rose-500 scale-110 shadow-xs" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                        title="Hitam"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPenColor("#1e3a8a")}
                                        className={`w-5 h-5 rounded-full bg-blue-900 border-2 transition-all ${selectedPenColor === "#1e3a8a" ? "border-rose-500 scale-110 shadow-xs" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                        title="Biru Dokumen"
                                    />
                                </div>

                                {/* Clear Button */}
                                <button
                                    type="button"
                                    onClick={() => sigCanvas.current?.clear()}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-rose-500 transition-colors"
                                >
                                    <ArrowCounterClockwise className="w-3.5 h-3.5" />
                                    Hapus & Gambar Ulang
                                </button>
                            </div>
                        </div>

                        {/* Save Checkbox Preference */}
                        <div className="mx-6 p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between shadow-xs">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={shouldSaveSignature}
                                    onChange={(e) => setShouldSaveSignature(e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-rose-500 focus:ring-rose-500 cursor-pointer accent-rose-500"
                                />
                                <div>
                                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        <FloppyDisk className="w-3.5 h-3.5 text-emerald-500" weight="fill" />
                                        Simpan tanda tangan ini
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        {user
                                            ? "Tersinkron ke akun Anda untuk digunakan di perangkat lain"
                                            : "Tersimpan di browser ini agar tidak perlu menggambar ulang"
                                        }
                                    </p>
                                </div>
                            </label>
                            {user ? (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                                    Cloud Sync
                                </span>
                            ) : (
                                <span className="text-[10px] bg-slate-500/10 text-muted-foreground font-semibold px-2 py-0.5 rounded-full">
                                    Lokal
                                </span>
                            )}
                        </div>

                        {/* Multi-Signer Info Notice */}
                        <div className="mx-6">
                            <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-900/50 rounded-xl p-3 flex gap-3 items-start">
                                <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" weight="fill" />
                                <div>
                                    <h4 className="text-xs font-bold text-sky-800 dark:text-sky-400">Informasi Penandatangan Ganda</h4>
                                    <p className="text-[11px] text-sky-700/80 dark:text-sky-500/80 mt-0.5 leading-relaxed">
                                        Anda bebas menambahkan QR Code kapan saja. Namun, jika dokumen ini ditandatangani bergantian (beda waktu), selalu pastikan untuk memindai <strong>QR Code milik penandatangan terakhir</strong> saat memverifikasi dokumen versi final.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Output Options */}
                        <div className="border-t border-border/80 px-6 py-4 bg-muted/10">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                                Tampilkan di PDF sebagai
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleApplyFromDraw('signature')}
                                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all text-left group shadow-xs"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 group-hover:bg-rose-500/20 transition-colors">
                                        <PenNib className="w-4 h-4 text-rose-500" weight="fill" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-foreground">Coretan Saja</p>
                                        <p className="text-[10px] text-muted-foreground">TTD tinta digital</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleApplyFromDraw('qrcode')}
                                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all text-left group shadow-xs"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                                        <QrCode className="w-4 h-4 text-sky-500" weight="fill" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-foreground">QR Code Saja</p>
                                        <p className="text-[10px] text-muted-foreground">Verifikasi digital</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleApplyFromDraw('both')}
                                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-500 hover:bg-emerald-50/70 transition-all text-left group shadow-xs"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                                        <PenNib className="w-4 h-4 text-emerald-600 dark:text-emerald-400" weight="fill" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">Keduanya</p>
                                        <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Coretan + QR Code</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
