'use client'
import { TrashIcon, CheckCircledIcon } from "@radix-ui/react-icons"
import ReactDropzone from "react-dropzone"
import { toast, useToast } from "./ui/use-toast"
import { useEffect, useRef, useState } from "react"
import IconFile from "../../utils/icon-file"
import CompressFileName from "../../utils/compress-file-name"
import ByteToSize from "../../utils/byte-to-size"
import LoadFfmpeg from "../../utils/load-ffmpeg"
import { Button } from "./ui/button"
import imageCompression from 'browser-image-compression'
import { Skeleton } from "./ui/skeleton"
import { FilePng, FileVideo, SpinnerGap, TrayArrowUp, Lightning, WhatsappLogo, CheckCircle } from "@phosphor-icons/react"
import JSZip from "jszip"
import ShimmerProgress from "./shadcn-space/radix/progress/ShimmerProgress"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const extensions = {
    image: [
        "jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "raw", "tga",
    ],
    video: [
        "mp4", "mov", "mkv", "webm", "avi", "flv", "wmv", "3gp", "m4v",
    ],
}

// Get video duration in seconds via HTML5 Video metadata
const getVideoMetadata = (file) => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve({
                duration: video.duration || 10,
                width: video.videoWidth || 1280,
                height: video.videoHeight || 720
            });
        };
        video.onerror = () => resolve({ duration: 10, width: 1280, height: 720 });
        video.src = URL.createObjectURL(file);
    });
};

const DropzoneCompressor = () => {
    const { toast } = useToast()
    const [isHover, setIsHover] = useState(false)
    const [actions, setActions] = useState([])
    const [isDone, setIsDone] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [files, setFiles] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isCompressingAll, setIsCompressingAll] = useState(false)
    const [masterProgress, setMasterProgress] = useState(0)

    const ffmpegRef = useRef(null)
    const progressCallbackRef = useRef(null)
    const progressIntervalRef = useRef(null)
    const startTimeRef = useRef(null)

    const accepted_files = {
        "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".ico", ".tif", ".tiff", ".tga"],
        "video/*": [".mp4", ".mov", ".mkv", ".webm", ".avi", ".flv", ".wmv", ".3gp", ".m4v"],
    }

    const handleHover = () => setIsHover(true)
    const handleExitHover = () => setIsHover(false)

    const handleUpload = async (data) => {
        handleExitHover()
        setFiles(data)

        const tmp = []
        for (const file of data) {
            const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase()
            const isVideo = extensions.video.includes(ext) || file.type.includes('video')

            let meta = { duration: 10, width: 1280, height: 720 }
            if (isVideo) {
                meta = await getVideoMetadata(file)
            }

            tmp.push({
                file_name: file.name,
                file_size: file.size,
                from: ext,
                file_type: file.type,
                file: file,
                isVideo: isVideo,
                duration: meta.duration,
                width: meta.width,
                height: meta.height,
                preset: isVideo ? "whatsapp" : "balanced", // Default video preset: <25MB WhatsApp
                resolution: "auto",
                is_compressed: false,
                is_compressing: false,
                is_error: false,
                progress: 0,
                status: "Ready",
                url: null,
                compressed_size: null,
            })
        }
        setActions(tmp)
        setIsDone(false)
    }

    const handlePresetChange = (fileName, presetValue) => {
        setActions(prev => prev.map(act => act.file_name === fileName ? { ...act, preset: presetValue } : act))
    }

    const handleResolutionChange = (fileName, resValue) => {
        setActions(prev => prev.map(act => act.file_name === fileName ? { ...act, resolution: resValue } : act))
    }

    const calculateEstimatedSize = (action) => {
        if (!action.isVideo) {
            return Math.round(action.file_size * 0.45); // ~55% reduction for images
        }
        const duration = action.duration || 10;
        let targetSizeMB = 24;

        if (action.preset === 'whatsapp') {
            targetSizeMB = Math.min(24.5, (action.file_size / (1024 * 1024)) * 0.4);
        } else if (action.preset === 'balanced') {
            targetSizeMB = (action.file_size / (1024 * 1024)) * 0.5;
        } else if (action.preset === 'extreme') {
            targetSizeMB = (action.file_size / (1024 * 1024)) * 0.25;
        }

        return Math.min(action.file_size, Math.round(targetSizeMB * 1024 * 1024));
    }

    // Compress a single image
    const compressSingleImage = async (actionItem) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        }
        try {
            const compressedFile = await imageCompression(actionItem.file, options)
            const url = URL.createObjectURL(compressedFile)
            return {
                url,
                file: compressedFile,
                compressed_size: compressedFile.size
            }
        } catch (error) {
            console.error('Image compression failed:', error)
            throw error
        }
    }

    // Compress a single video with FFmpeg WASM
    const compressSingleVideo = async (ffmpeg, actionItem, onProgress) => {
        const ext = actionItem.from
        const uniqueId = Date.now() + "_" + Math.random().toString(36).substring(2, 7)
        const input = `cin_${uniqueId}.${ext}`
        const output = `cout_${uniqueId}.mp4`

        await ffmpeg.writeFile(input, new Uint8Array(await actionItem.file.arrayBuffer()))

        const duration = actionItem.duration || 10
        let videoBitrateKbps = 1000

        if (actionItem.preset === 'whatsapp') {
            // Target size < 24.5 MB
            const targetBytes = 24.5 * 1024 * 1024
            const totalBitrateBps = (targetBytes * 8) / duration
            const audioBitrateBps = 96000
            videoBitrateKbps = Math.max(150, Math.round((totalBitrateBps - audioBitrateBps) / 1000))
        } else if (actionItem.preset === 'balanced') {
            const targetBytes = actionItem.file_size * 0.5
            const totalBitrateBps = (targetBytes * 8) / duration
            videoBitrateKbps = Math.max(200, Math.round((totalBitrateBps - 96000) / 1000))
        } else if (actionItem.preset === 'extreme') {
            const targetBytes = actionItem.file_size * 0.25
            const totalBitrateBps = (targetBytes * 8) / duration
            videoBitrateKbps = Math.max(120, Math.round((totalBitrateBps - 64000) / 1000))
        }

        // Scale resolution flag
        let vfFilter = "scale=-2:min(ih\\,720)"
        if (actionItem.resolution === '1080p') vfFilter = "scale=-2:1080"
        else if (actionItem.resolution === '720p') vfFilter = "scale=-2:720"
        else if (actionItem.resolution === '480p') vfFilter = "scale=-2:480"

        const cmd = [
            '-i', input,
            '-vf', vfFilter,
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-b:v', `${videoBitrateKbps}k`,
            '-maxrate', `${videoBitrateKbps * 1.2}k`,
            '-bufsize', `${videoBitrateKbps * 2}k`,
            '-threads', '1',
            '-c:a', 'aac',
            '-b:a', '96k',
            output
        ]

        try {
            await ffmpeg.exec(cmd)
            const data = await ffmpeg.readFile(output)
            const blob = new Blob([data], { type: 'video/mp4' })
            const url = URL.createObjectURL(blob)
            return {
                url,
                file: new File([blob], actionItem.file_name, { type: 'video/mp4' }),
                compressed_size: blob.size
            }
        } finally {
            try { await ffmpeg.deleteFile(input) } catch (e) {}
            try { await ffmpeg.deleteFile(output) } catch (e) {}
        }
    }

    // Execute compression for all files in queue sequentially
    const handleCompressAll = async () => {
        if (!actions.length) return
        setIsCompressingAll(true)
        setMasterProgress(5)

        let ffmpeg = ffmpegRef.current
        if (!ffmpeg) {
            ffmpeg = await LoadFfmpeg()
            ffmpegRef.current = ffmpeg
        }

        const total = actions.length
        let completed = 0

        // Attach ffmpeg progress listener
        let currentFileIdx = 0
        const progressCallback = ({ progress: p }) => {
            if (typeof p !== 'number' || isNaN(p) || p < 0 || p > 1) return
            const pct = Math.min(99, Math.round(p * 100))
            const masterPct = Math.min(99, Math.round(((currentFileIdx + p) / total) * 100))

            setMasterProgress(masterPct)
            setActions(prev => prev.map((act, idx) => idx === currentFileIdx ? { ...act, progress: pct } : act))
        }

        try {
            ffmpeg.on('progress', progressCallback)
        } catch (e) {}

        for (let i = 0; i < total; i++) {
            currentFileIdx = i
            const item = actions[i]

            setActions(prev => prev.map((act, idx) => idx === i ? { ...act, is_compressing: true, status: "Compressing...", progress: 5 } : act))

            try {
                let res
                if (item.isVideo) {
                    res = await compressSingleVideo(ffmpeg, item)
                } else {
                    res = await compressSingleImage(item)
                }

                completed++
                setActions(prev => prev.map((act, idx) => idx === i ? {
                    ...act,
                    is_compressing: false,
                    is_compressed: true,
                    is_error: false,
                    url: res.url,
                    compressed_file: res.file,
                    compressed_size: res.compressed_size,
                    progress: 100,
                    status: "Compressed"
                } : act))

                setMasterProgress(Math.round((completed / total) * 100))
            } catch (err) {
                console.error("Compression error on file:", item.file_name, err)
                setActions(prev => prev.map((act, idx) => idx === i ? {
                    ...act,
                    is_compressing: false,
                    is_compressed: false,
                    is_error: true,
                    status: "Failed"
                } : act))

                // Re-initialize FFmpeg WASM if crashed
                if (item.isVideo) {
                    try {
                        ffmpeg = await LoadFfmpeg()
                        ffmpegRef.current = ffmpeg
                        ffmpeg.on('progress', progressCallback)
                    } catch (rErr) {}
                }
            }
        }

        try { ffmpeg.off('progress', progressCallback) } catch (e) {}
        setIsCompressingAll(false)
        setIsDone(true)

        toast({
            title: "Compression Completed 🎉",
            description: "Seluruh media Anda berhasil diperkecil dengan sukses!",
            duration: 4000
        })
    }

    const handleRemoveFile = (fileName) => {
        setActions(actions.filter(action => action.file_name !== fileName))
    }

    const resetFile = () => {
        setIsDone(false)
        setActions([])
        setFiles([])
        setIsReady(false)
    }

    const handleDownloadFile = () => {
        setIsDownloading(true)
        setTimeout(() => {
            setIsDownloading(false)
            if (actions.length > 1) {
                const zip = new JSZip()
                actions.forEach((action) => {
                    if (action.is_compressed && (action.compressed_file || action.file)) {
                        zip.file(action.file_name, action.compressed_file || action.file)
                    }
                })
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(content)
                    link.download = 'compressed_media.zip'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                })
            } else {
                const action = actions[0]
                if (action.is_compressed && action.url) {
                    const link = document.createElement('a')
                    link.href = action.url
                    link.download = action.file_name
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
            }
        }, 1000)
    }

    const load = async () => {
        try {
            const ffmpeg_response = await LoadFfmpeg()
            ffmpegRef.current = ffmpeg_response
            setIsLoaded(true)
        } catch (e) {
            console.error("FFmpeg load failed:", e)
        }
    }

    useEffect(() => {
        load()
    }, [])

    if (actions.length) {
        return (
            <div className="space-y-6 text-left">
                {actions.map((action, i) => {
                    const estSize = calculateEstimatedSize(action);
                    const savingPct = Math.max(5, Math.round((1 - estSize / action.file_size) * 100));

                    return (
                        <div key={i} className="w-full py-4 relative rounded-xl border bg-card text-card-foreground p-4 lg:px-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 shadow-sm">
                            {/* File Info */}
                            <div className="flex items-center gap-4 min-w-[240px] max-w-sm">
                                <span className="text-red-500 text-xl">
                                    {action.isVideo ? <FileVideo weight="duotone" className="w-8 h-8 text-red-500" /> : <FilePng weight="duotone" className="w-8 h-8 text-blue-500" />}
                                </span>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-semibold truncate">
                                        {CompressFileName(action.file_name)}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>Awal: {ByteToSize(action.file_size)}</span>
                                        {action.is_compressed && (
                                            <span className="text-emerald-500 font-medium">
                                                ➔ {ByteToSize(action.compressed_size)} (-{Math.round((1 - action.compressed_size / action.file_size) * 100)}%)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preset Options for Videos */}
                            {action.isVideo && !action.is_compressed && !action.is_compressing && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-medium text-muted-foreground">Target Compression</span>
                                        <Select value={action.preset} onValueChange={(val) => handlePresetChange(action.file_name, val)}>
                                            <SelectTrigger className="w-[190px] h-9 text-xs">
                                                <SelectValue placeholder="Preset" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="whatsapp">
                                                    <div className="flex items-center gap-1.5">
                                                        <WhatsappLogo className="w-4 h-4 text-emerald-500" />
                                                        <span>Target &lt; 25MB (WA/Email)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="balanced">
                                                    <div className="flex items-center gap-1.5">
                                                        <Lightning className="w-4 h-4 text-amber-500" />
                                                        <span>Balanced (-50% Size)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="extreme">
                                                    <span>Extreme (-75% Size)</span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-medium text-muted-foreground">Resolusi</span>
                                        <Select value={action.resolution} onValueChange={(val) => handleResolutionChange(action.file_name, val)}>
                                            <SelectTrigger className="w-[120px] h-9 text-xs">
                                                <SelectValue placeholder="Resolusi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="auto">Auto / HD</SelectItem>
                                                <SelectItem value="1080p">1080p (FHD)</SelectItem>
                                                <SelectItem value="720p">720p (HD)</SelectItem>
                                                <SelectItem value="480p">480p (SD)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground font-normal py-1 px-2.5">
                                        Estimasi: ~{ByteToSize(estSize)} (-{savingPct}%)
                                    </Badge>
                                </div>
                            )}

                            {/* Status & Actions */}
                            <div className="flex items-center gap-3 ml-auto">
                                {action.is_compressed ? (
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-emerald-600 flex gap-1.5 items-center px-2.5 py-1">
                                            <span>Selesai</span>
                                            <CheckCircledIcon className="w-4 h-4" />
                                        </Badge>
                                        <Button onClick={() => {
                                            const link = document.createElement('a')
                                            link.href = action.url
                                            link.download = action.file_name
                                            link.click()
                                        }} variant="outline" size="sm" className="h-9">
                                            Download
                                        </Button>
                                    </div>
                                ) : action.is_compressing ? (
                                    <div className="w-48">
                                        <ShimmerProgress
                                            variant="inline"
                                            value={action.progress || 10}
                                            statusText="Mengompres..."
                                            showPercentage={true}
                                        />
                                    </div>
                                ) : (
                                    <Button onClick={() => handleRemoveFile(action.file_name)} variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                                        <TrashIcon className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Master Progress Bar */}
                {isCompressingAll && (
                    <div className="my-6">
                        <ShimmerProgress
                            variant="master"
                            value={masterProgress}
                            statusText={`Mengompres ${actions.length} media...`}
                            showPercentage={true}
                        />
                    </div>
                )}

                {/* Bottom Control Bar */}
                <div className="flex justify-end gap-3 pt-4">
                    {isDone ? (
                        <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
                            <Button onClick={handleDownloadFile} disabled={isDownloading} className="bg-[#e5322d] hover:bg-red-600 text-white p-5 px-8">
                                {isDownloading ? "Mengunduh..." : (actions.length > 1 ? "Download All (ZIP)" : "Download File")}
                            </Button>
                            <Button onClick={resetFile} variant="outline" className="p-5">
                                Kompres Berkas Lainnya
                            </Button>
                        </div>
                    ) : (
                        <Button
                            disabled={isCompressingAll}
                            onClick={handleCompressAll}
                            className="bg-[#e5322d] hover:bg-red-600 text-white p-5 px-8 text-md font-medium transition-all"
                        >
                            {isCompressingAll ? (
                                <div className="flex gap-2 items-center">
                                    <SpinnerGap className="animate-spin w-5 h-5" />
                                    <span>Sedang Mengompres...</span>
                                </div>
                            ) : (
                                <span>Mulai Kompresi Sekarang</span>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <ReactDropzone
            onDragEnter={handleHover}
            onDragLeave={handleExitHover}
            onDrop={handleUpload}
            accept={accepted_files}
            onDropRejected={() => {
                handleExitHover()
                toast({
                    variant: 'destructive',
                    title: 'Format berkas tidak didukung',
                    description: 'Silahkan upload file gambar (PNG/JPG/WEBP) atau video (MP4/MOV/MKV/WEBM).',
                    duration: 4000,
                })
            }}
        >
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="border-dashed border-2 border-slate-300 dark:border-slate-700 p-8 min-h-[220px] rounded-3xl cursor-pointer hover:border-red-500 transition-colors flex flex-col items-center justify-center bg-card shadow-sm">
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                        {isHover ? (
                            <>
                                <FileVideo className="w-16 h-16 text-[#e5322d] animate-bounce" />
                                <p className="text-xl font-semibold">Drop berkas di sini! 🤩</p>
                            </>
                        ) : (
                            <>
                                <TrayArrowUp weight="duotone" className="w-16 h-16 text-[#e5322d]" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-xl font-semibold">Pilih Berkas Gambar atau Video Anda</p>
                                    <p className="text-sm text-muted-foreground">atau drag & drop berkas ke sini</p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">Gambar (PNG, JPG, WEBP)</Badge>
                                    <Badge variant="outline" className="text-xs">Video (MP4, MOV, MKV, WEBM)</Badge>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </ReactDropzone>
    )
}

export default DropzoneCompressor