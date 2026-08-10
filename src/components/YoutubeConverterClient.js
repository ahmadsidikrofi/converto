'use client'

import { useState } from "react"
import { appToast as toast } from "@/store/useToastStore"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { YoutubeLogo, Download, MagnifyingGlass, CircleNotch, FileVideo, FileAudio } from "@phosphor-icons/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Skeleton } from "./ui/skeleton"
import { Badge } from "./ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Slide variants for tabs
const variants = {
  enter: (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -48 : 48, opacity: 0 })
}
const transition = { type: "spring", stiffness: 340, damping: 32 }

export default function YoutubeConverterClient() {
    const [url, setUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [videoData, setVideoData] = useState(null)
    const [activeTab, setActiveTab] = useState("mp4")
    const [hoveredTab, setHoveredTab] = useState(null)
    const [direction, setDirection] = useState(1)
    const [selectedVideoQuality, setSelectedVideoQuality] = useState("")
    const [isDownloading, setIsDownloading] = useState(false)

    const handleTabChange = (newId) => {
        const tabsArr = ['mp4', 'mp3']
        const prevIdx = tabsArr.indexOf(activeTab)
        const nextIdx = tabsArr.indexOf(newId)
        setDirection(nextIdx > prevIdx ? 1 : -1)
        setActiveTab(newId)
    }

    const fetchVideoInfo = async (e) => {
        if (e) e.preventDefault()
        if (!url) {
            toast.error("Harap masukkan link YouTube terlebih dahulu")
            return
        }

        setIsLoading(true)
        setVideoData(null)
        setSelectedVideoQuality("")

        try {
            const res = await fetch(`/api/youtube/info?url=${encodeURIComponent(url)}`)
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Gagal mengambil data video")
                setIsLoading(false)
                return
            }

            setVideoData(data)

            // Auto select best video quality
            if (data.videoFormats && data.videoFormats.length > 0) {
                setSelectedVideoQuality(data.videoFormats[0].itag.toString())
            }

            toast.success("Video berhasil ditemukan!")
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan koneksi saat mengambil info video.")
        } finally {
            setIsLoading(false)
        }
    }

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00"
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const handleDownload = async () => {
        if (!videoData) return

        let downloadUrl = `/api/youtube/download?url=${encodeURIComponent(url)}&type=${activeTab}`
        if (activeTab === 'mp4' && selectedVideoQuality) {
            downloadUrl += `&itag=${selectedVideoQuality}`
        } else if (activeTab === 'mp3' && videoData.bestAudioFormat) {
            downloadUrl += `&itag=${videoData.bestAudioFormat.itag}`
        }

        setIsDownloading(true)
        toast.success("Proses unduhan dimulai, harap tunggu...")

        try {
            const response = await fetch(downloadUrl)
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.error || "Gagal mendownload file")
            }

            // Baca seluruh response sebagai blob
            const blob = await response.blob()

            if (blob.size === 0) {
                throw new Error("File yang diunduh kosong (0 bytes)")
            }

            // Buat URL dari blob dan trigger download
            const blobUrl = window.URL.createObjectURL(blob)
            const ext = activeTab === 'mp3' ? 'mp3' : 'mp4'
            const safeTitle = videoData.title.replace(/[^\w\s-]/gi, "").trim()

            const a = document.createElement('a')
            a.href = blobUrl
            a.download = `${safeTitle}.${ext}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            
            // Cleanup blob URL setelah beberapa detik
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000)

            toast.success(`${ext.toUpperCase()} berhasil diunduh! (${(blob.size / 1024 / 1024).toFixed(1)} MB)`)
        } catch (error) {
            console.error("Download error:", error)
            toast.error(error.message || "Terjadi kesalahan saat mengunduh file.")
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="w-full mx-auto space-y-8">
            {/* Maintenance & Coming Soon Banner */}
            <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-orange-500/5 backdrop-blur-md shadow-xl text-center relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    Pemeliharaan Server & Optimasi Cloud
                </div>
                
                <div className="space-y-3 max-w-xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Fitur YouTube Converter Sedang Dioptimalkan
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Kami sedang memperbarui infrastruktur serverless agar pengunduhan video YouTube dapat menembus proteksi batasan cloud secara stabil. Fitur ini akan segera diaktifkan kembali!
                    </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md"
                    >
                        Gunakan File Converter (100% Aktif)
                    </a>
                </div>
            </div>

            {/* Form Input Section */}
            <form onSubmit={fetchVideoInfo} className="relative group max-w-3xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
                <div className="relative flex items-center bg-card border-2 border-slate-200 dark:border-slate-800 rounded-full p-2 shadow-lg hover:border-red-500/50 transition-colors">
                    <div className="pl-4 pr-2 text-red-500">
                        <YoutubeLogo weight="fill" className="w-8 h-8" />
                    </div>
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 border-0 shadow-none focus-visible:ring-0 text-md sm:text-lg bg-transparent h-12"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-red-500 rounded-full px-6 h-12 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
                        ) : (
                            <MagnifyingGlass weight="bold" className="w-5 h-5" />
                        )}
                        <span className="font-semibold hidden sm:inline">Cari Video</span>
                    </Button>
                </div>
            </form>

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="w-full rounded-3xl border bg-card p-6 flex flex-col sm:flex-row gap-6 animate-pulse max-w-4xl mx-auto">
                    <Skeleton className="w-full sm:w-[360px] aspect-video rounded-xl" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                        <div className="pt-4 space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            )}

            {/* Video Metadata & Download Panel */}
            {videoData && !isLoading && (
                <div className="w-full max-w-4xl mx-auto rounded-3xl border bg-card/80 backdrop-blur-sm p-6 lg:p-8 flex flex-col lg:flex-row gap-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    {/* Thumbnail Display */}
                    <div className="w-full lg:w-[420px] shrink-0 relative group rounded-2xl overflow-hidden shadow-md">
                        {videoData.thumbnail ? (
                            <img
                                src={videoData.thumbnail}
                                alt={videoData.title}
                                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full aspect-video bg-muted flex items-center justify-center">
                                <YoutubeLogo className="w-16 h-16 text-muted-foreground opacity-50" />
                            </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-md">
                            {formatDuration(videoData.duration)}
                        </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="flex-1 flex flex-col text-left">
                        <h3 className="text-xl lg:text-2xl font-bold line-clamp-2 leading-tight">{videoData.title}</h3>
                        <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2">
                            <YoutubeLogo weight="duotone" className="w-5 h-5 text-red-500" />
                            {videoData.author}
                        </p>

                        {/* Format Tabs (MP4 vs MP3) */}
                        <div className="mt-8 flex-1">
                            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                <TabsList 
                                    className="flex w-full border-b border-border bg-transparent p-0 rounded-none h-auto gap-0 justify-start"
                                    onMouseLeave={() => setHoveredTab(null)}
                                >
                                    {/* Tab MP4 */}
                                    <TabsTrigger 
                                        value="mp4" 
                                        onMouseEnter={() => setHoveredTab('mp4')}
                                        className={cn(
                                            "relative flex items-center cursor-pointer justify-center text-sm font-medium transition-colors outline-none whitespace-nowrap bg-transparent",
                                            "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
                                            "dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent dark:data-[state=active]:text-foreground",
                                            "border-transparent data-[state=active]:border-transparent shadow-none data-[state=active]:shadow-none after:hidden",
                                            activeTab === 'mp4' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="relative flex items-center gap-2 px-6 py-3 rounded-md z-10">
                                            {hoveredTab === 'mp4' && (
                                                <motion.span layoutId="ytdl-tabs-hover" className="absolute inset-0 bg-muted/70 rounded-md pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                            )}
                                            <FileVideo weight="duotone" className={cn("w-5 h-5 relative z-10 transition-colors duration-300", activeTab === 'mp4' ? "text-blue-500" : "")} />
                                            <span className="relative z-10">Video (MP4)</span>
                                        </span>
                                        {activeTab === 'mp4' && (
                                            <motion.div layoutId="ytdl-tabs-indicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-red-500" initial={false} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                        )}
                                    </TabsTrigger>

                                    {/* Tab MP3 */}
                                    <TabsTrigger 
                                        value="mp3" 
                                        onMouseEnter={() => setHoveredTab('mp3')}
                                        className={cn(
                                            "relative flex items-center cursor-pointer justify-center text-sm font-medium transition-colors outline-none whitespace-nowrap bg-transparent",
                                            "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
                                            "dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent dark:data-[state=active]:text-foreground",
                                            "border-transparent data-[state=active]:border-transparent shadow-none data-[state=active]:shadow-none after:hidden",
                                            activeTab === 'mp3' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="relative flex items-center gap-2 px-6 py-3 rounded-md z-10">
                                            {hoveredTab === 'mp3' && (
                                                <motion.span layoutId="ytdl-tabs-hover" className="absolute inset-0 bg-muted/70 rounded-md pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                            )}
                                            <FileAudio weight="duotone" className={cn("w-5 h-5 relative z-10 transition-colors duration-300", activeTab === 'mp3' ? "text-amber-500" : "")} />
                                            <span className="relative z-10">Audio (MP3)</span>
                                        </span>
                                        {activeTab === 'mp3' && (
                                            <motion.div layoutId="ytdl-tabs-indicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-red-500" initial={false} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                        )}
                                    </TabsTrigger>
                                </TabsList>
                                
                                {/* Animated Content */}
                                <div className="mt-6 relative overflow-hidden min-h-[100px]">
                                    <AnimatePresence mode="wait" custom={direction}>
                                        {activeTab === 'mp4' && (
                                            <motion.div
                                                key="mp4"
                                                custom={direction}
                                                variants={variants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={transition}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-muted-foreground">Pilih Kualitas Video</label>
                                                    <Select value={selectedVideoQuality} onValueChange={setSelectedVideoQuality}>
                                                        <SelectTrigger className="w-full h-12 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                                                            <SelectValue placeholder="Pilih resolusi video" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {videoData.videoFormats.length > 0 ? (
                                                                videoData.videoFormats.map((format) => (
                                                                    <SelectItem key={format.itag} value={format.itag.toString()}>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-semibold">{format.qualityLabel}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <SelectItem value="none" disabled>Tidak ada format MP4 tersedia</SelectItem>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                        {activeTab === 'mp3' && (
                                            <motion.div
                                                key="mp3"
                                                custom={direction}
                                                variants={variants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={transition}
                                                className="p-4 border-2 border-dashed border-amber-500/30 bg-amber-500/5 rounded-xl flex items-center gap-4"
                                            >
                                                <div className="p-3 bg-amber-500/20 rounded-full text-amber-500 shrink-0">
                                                    <FileAudio weight="fill" className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm sm:text-base">High Quality MP3</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        Bitrate terbaik ({videoData.bestAudioFormat?.audioBitrate || 128} kbps) otomatis dipilih untuk kualitas suara paling jernih.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Tabs>
                        </div>

                        {/* Download Submit Button */}
                        <div className="mt-6">
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading || (activeTab === 'mp4' && !selectedVideoQuality)}
                                className="w-full bg-[#e5322d] hover:bg-red-600 text-white rounded-xl p-6 text-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/25"
                            >
                                {isDownloading ? (
                                    <>
                                        <CircleNotch weight="bold" className="w-6 h-6 animate-spin" />
                                        Menyiapkan Unduhan...
                                    </>
                                ) : (
                                    <>
                                        <Download weight="bold" className="w-6 h-6" />
                                        Download {activeTab.toUpperCase()}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
