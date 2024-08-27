'use client'
import { FileIcon, TrashIcon, UploadIcon } from "@radix-ui/react-icons"
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
import { TrayArrowUp } from "@phosphor-icons/react"

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
    const [isReady, setIsReady] = useState(false)
    const [files, setFiles] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isCompressing, setIsCompressing] = useState(false)
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
            // Update actions with the compressed file
            setActions(prevActions => prevActions.map(action => 
                action.file_name === file.name ? { ...action, file: compressedFile, file_size: compressedFile.size, is_compressing: false } : action
            ))
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
            setIsCompressing(false)
        } else {
            checkIsReady()
        }
    }, [actions, setIsCompressing])
    useEffect(() => {
        load()
    }, [])

    if (actions.length) {
        return (
            <div className="space-y-6">
                {actions.filter(action => action.file_type.includes('image')).map((action, i) => (
                    <div key={i} className="w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border h-fit lg:h-20 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between">
                        <div className="flex items-center gap-4 w-full">
                            <span className="text-red-500">
                                {IconFile(action.file_type)}
                            </span>
                            <span className="text-md font-medium overflow-x-hidden">
                                {CompressFileName(action.file_name)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 w-96">
                            <span className="text-md font-medium overflow-x-hidden">
                                {action.is_compressing ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[80px]" /> 
                                    </div>
                                ) : (
                                    <>{ByteToSize(action.file_size)}</>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 w-96">
                            <Button disabled={action.is_compressing ? true : false} onClick={() => handleCompressImage(action.file)} variant='outline'>Compress now</Button>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => handleRemoveFile(action.file_name)} variant='ghost' className='p-3'>
                                <TrashIcon className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    {isDone ? (
                        <div className="flex flex-col justify-center gap-3">
                            <Button className='bg-[#e5322d] hover:bg-red-500 p-5'>{actions.length > 1 ? "Download all" : "Download file"}</Button>
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
                    title: 'Error when upload file(s)',
                    description: 'Only image allowed',
                    duration: 4000,
                })
            }}
            onError={() => {
                toast({
                    variant: 'destructive',
                    title: 'Error when upload file(s)',
                    description: 'Only image allowed',
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