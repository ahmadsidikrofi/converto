'use client'
import { FileIcon, UploadIcon } from "@radix-ui/react-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"  
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import ReactDropzone from "react-dropzone";
import ByteToSize from "../../utils/byte-to-size";
import LoadFfmpeg from "../../utils/load-ffmpeg"
import CompressFileName from "../../utils/compress-file-name"
import ConvertFile from "../../utils/convertFile"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { useEffect, useRef, useState } from "react"
import { Action } from "../../types.d"
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
  };

const Dropzone = () => {
    const { toast } = useToast()
    const [isHover, setIsHover] = useState(false)
    const [actions, setActions] = useState([])
    const [isReady, setIsReady] = useState(false)
    const [files, setFiles] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [convert, setConvert] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const ffmpegRef = useRef(null)
    const [defaultValues, setDefaultValues] = useState("video")
    const [selected, setSelected] = useState('...')
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
        "audio/*": [],
        "video/*": [],
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
                is_converted: false,
                is_converting: false,
                is_error: false
            })
            setActions(tmp)
        })
    }
    const updateActions = (file_name, to) => {
        setActions(
            actions.map((action) => {
                if (action.file_name === file_name) {
                    console.log("FILE FOUNDED")
                    return {
                        ...action,
                        to,
                    }
                }
                return action
            })
        )
    }

    const handleHover = () => setIsHover(true)
    const handleExitHover = () => {
        setIsHover(false)
    }

    const checkIsReady = () => {
        let tmpReady = true
        actions.forEach((action) => {
            if (!action.to) tmpReady = false
        })
        setIsReady(tmpReady)
    }

    useEffect(() => {
        if (!actions.length) {
            setIsDone(false)
            setFiles([])
            setIsReady(false)
            setConvert(false)
        }
    }, [actions])
    useEffect(() => {
        load()
    }, [])
    const load = async () => {
        const ffmpeg_response = await LoadFfmpeg()
        ffmpegRef.current = ffmpeg_response
        setIsLoaded(true)
        setTimeout(() => {
            setIsLoaded(false)
        }, 3000)
    }

    if (actions.length) {
        return (
            <div className="space-y-6">
                {actions.map((action, i) => (
                    <div key={i} className="w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border h-fit lg:h-20 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between">
                        {isLoaded && (
                            <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
                        )}
                        <div className="flex items-center gap-1 w-96">
                            <span className="text-md font-medium overflow-x-hidden">
                                {CompressFileName(action.file_name)}
                            </span>
                        </div>
                    </div>
                ))}
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
                    title: 'Error when upload file(s)',
                    description: 'Allowed files: Audio, Image, Video',
                    duration: 4000,
                })
            }}
            onError={() => {
                toast({
                    variant: 'destructive',
                    title: 'Error when upload file(s)',
                    description: 'Allowed files: Audio, Image, Video',
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
                                <div className="flex flex-col items-center justify-center gap-3 ">
                                    <FileIcon className="w-14 h-14 text-[#e5322d]" />
                                    <p className="md:text-xl sm:text-sm max-sm:text-sm font-semibold">Drop it here 🤩</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col items-center justify-center gap-3 ">
                                    <UploadIcon className="w-14 h-14 text-[#e5322d]" />
                                    <p className="md:text-xl sm:text-sm max-sm:text-sm font-semibold">Select your files</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </ReactDropzone>
    )

}
 
export default Dropzone;