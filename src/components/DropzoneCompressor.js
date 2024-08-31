'use client'
import { TrashIcon } from "@radix-ui/react-icons"
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
import { FilePng, SpinnerGap, TrayArrowUp } from "@phosphor-icons/react"
import JSZip from "jszip"
const extensions = {
    image: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "ico",
      "tif",
      "tiff",
      "svg",
      "raw",
      "tga",
    ],
    video: [
      "mp4",
      "m4v",
      "mp4v",
      "3gp",
      "3g2",
      "avi",
      "mov",
      "wmv",
      "mkv",
      "flv",
      "ogv",
      "webm",
      "h264",
      "264",
      "hevc",
      "265",
    ],
    audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
}

const DropzoneCompressor = () => {
    const { toast } = useToast()
    const [isHover, setIsHover] = useState(false)
    const [actions, setActions] = useState([])
    const [isDone, setIsDone] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [files, setFiles] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const ffmpegRef = useRef(null)
    const accepted_files = {
        "image/*": [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".bmp",
            ".webp",
            ".ico",
            ".tif",
            ".tiff",
            ".raw",
            ".tga",
        ],
    }

    const handleHover = () => setIsHover(true)
    const handleExitHover = () => {
        setIsHover(false)
    }
    
    const handleUpload = (data) => {
        handleExitHover()
        setFiles(data)
        const tmp = []
        data.forEach((file) => {
            // const formData = new FormData()
            tmp.push({
                file_name: file.name,
                file_size: file.size,
                from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
                to: null,
                file_type: file.type,
                file: file,
                is_compressed: false,
                is_compressing: false,
                is_error: false,
                selectedFormat: null
            })
            setActions(tmp)
        })
    }

    const checkIsReady = () => {
        let tmpReady = true
        actions.forEach((action) => {
            if (!action.to) tmpReady = false
        })
        setIsReady(tmpReady)
    }

    const handleCompressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        }
    
        try {
            setActions(prevActions => prevActions.map(action => 
                action.file_name === file.name ? { ...action, is_compressing: true } : action
            ))
            const compressedFile = await imageCompression(file, options)
            console.log('Compressed file:', compressedFile)
            setActions(prevActions => prevActions.map(action => 
                action.file_name === file.name ? { ...action, file: compressedFile, file_size: compressedFile.size, is_compressing: false, is_compressed: true } : action
            ))
            toast({
                title: "Berhasil diperkecil",
                description: "Gambarmu sudah seukuran kelingking yeay.",
                duration: 4000
            })
            setIsDone(true)
        } catch (error) {
            console.error('Error during compression:', error)
            setActions(prevActions => prevActions.map(action =>
                action.file_name === file.name ? { ...action, is_compressing: false, is_error: true } : action
            ))
        }
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
        setTimeout(() => {setIsDownloading(false)}, 3000)
        if (actions.length > 1) {
            const zip = new JSZip()
            actions.forEach((action) => {
                if (action.is_compressed && action.file) {
                    zip.file(action.file_name, action.file)
                }
            })
            zip.generateAsync({ type: 'blob' }).then((content) => {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(content)
                link.download = 'compressed_file.zip'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        } else {
            const action = actions[0]
            if (action.is_compressed && action.file) {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(action.file)
                link.download = action.file_name
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        }
    }


    const load = async () => {
        const ffmpeg_response = await LoadFfmpeg()
        ffmpegRef.current = ffmpeg_response
        setIsLoaded(true)
        setTimeout(() => {
            setIsLoaded(false)
        }, 3000)
    }

    useEffect(() => {
        if (!actions.length) {
            setIsDone(false)
            setFiles([])
            setIsReady(false)
        } else {
            checkIsReady()
        }
    }, [actions])
    useEffect(() => {
        load()
    }, [])

    if (actions.length) {
        return (
            <div className="space-y-6">
                {actions.filter(action => action.file_type.includes('image')).map((action, i) => (
                    <div key={i} className="w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border max-sm:border-none h-fit lg:h-20 max-sm:px-0 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between">
                        <div className="flex items-center gap-4 w-full max-sm:px-8">
                            <span className="text-red-500  sm:text-sm max-sm:text-sm">
                                {IconFile(action.file_type)}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-md font-medium overflow-x-hidden max-sm:text-[12px]">
                                    {CompressFileName(action.file_name)}
                                </span>
                                {action.is_compressing ? (
                                    <div className="space-y-2 max-sm:block hidden">
                                        <Skeleton className="h-4 w-[50px]" /> 
                                    </div>
                                ) : (
                                    <span className="text-md font-medium overflow-x-hidden max-sm:block hidden text-muted-foreground text-[10px]">
                                        ({ByteToSize(action.file_size)})
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 w-96">
                            <span className="text-md font-medium overflow-x-hidden max-sm:hidden">
                                {action.is_compressing ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[80px]" /> 
                                    </div>
                                ) : (
                                    <>{ByteToSize(action.file_size)}</>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 w-96 max-sm:px-8 max-sm:justify-between">
                            <Button disabled={action.is_compressing} onClick={() => handleCompressImage(action.file)} variant='outline'>
                            {action.is_compressing ? (
                                <div className="flex gap-2 items-center">
                                    <span className="animate-spin text-lg">
                                        <SpinnerGap className="animate-spin" />
                                    </span>
                                    <span>Compressing...</span>
                                </div>
                            ) : (
                                <span>Compress now</span>
                            )}
                            </Button>
                            <Button onClick={() => handleRemoveFile(action.file_name)} variant='ghost' className='p-3 max-sm:block hidden'>
                                <TrashIcon className="w-6 h-6" />
                            </Button>
                        </div>
                        <div className="flex justify-end max-sm:hidden">
                            <Button onClick={() => handleRemoveFile(action.file_name)} variant='ghost' className='p-3'>
                                <TrashIcon className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    {isDone ? (
                        <div className="flex flex-col justify-center gap-3">
                            <Button onClick={handleDownloadFile} disabled={isDownloading} className='bg-[#e5322d] hover:bg-red-500 p-5'>
                                {isDownloading ? (
                                    <div className="flex gap-2">
                                        <span className="animate-spin text-lg">
                                            <SpinnerGap className="animate-spin" />
                                        </span>
                                        <span>Downloading...</span>
                                    </div>
                                ) : (
                                    <span>{actions.length > 1 ? "Download all" : "Download file"}</span>
                                )}
                            </Button>
                            <Button onClick={resetFile} variant='outline' className='p-5'>Compress another file(s)</Button>
                        </div>
                    ) : null }
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
                    title: 'Terjadi error saat mengunggah gambar',
                    description: 'Cuma gambar yang boleh kemari🙏',
                    duration: 4000,
                })
            }}
            onError={() => {
                toast({
                    variant: 'destructive',
                    title: 'Terjadi error saat mengunggah gambar',
                    description: 'Cuma gambar yang boleh kemari🙏',
                    duration: 4000,
                })
            }}
        >
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="border-dashed border-2 border-slate-300 p-5 h-44 rounded-3xl cursor-pointer">
                    <input {...getInputProps()} />
                    <div>
                        {isHover ? (
                            <>
                                <div className="flex flex-col items-center justify-center gap-3 my-3">
                                    <FilePng className="w-14 h-14 text-[#e5322d]"/>
                                    <p className="md:text-xl sm:text-sm max-sm:text-sm font-semibold">Drop it here 🤩</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col items-center justify-center gap-3 my-3">
                                    <TrayArrowUp weight="duotone" className="w-14 h-14 text-[#e5322d]" />
                                    <div className="flex flex-col">
                                        <p className="md:text-xl sm:text-sm max-sm:text-sm font-semibold">Select your file(s)</p>
                                        <p className="text-sm text-muted-foreground">or just drop here</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </ReactDropzone>
    )
}
 
export default DropzoneCompressor;