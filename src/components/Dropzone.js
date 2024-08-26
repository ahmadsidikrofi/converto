'use client'
import { CheckCircledIcon, CircleIcon, EyeClosedIcon, FileIcon, TrashIcon, UploadIcon } from "@radix-ui/react-icons"
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
import IconFile from "../../utils/icon-file"
import { Close, WarningProvider } from "@radix-ui/react-dialog"
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
    const [isConverting, setIsConvert] = useState(false)
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
                is_error: false,
                selectedFormat: null
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
                        selectedFormat: to
                    }
                }
                return action
            })
        )
    }

    const handleConvert = async () => {
        if (!ffmpegRef.current) return
        setIsLoaded(true)
        setIsConvert(true)
        let convertingAction = actions.map((action) => ({
            ...action,
            is_converting: true,
            is_converted: false,
            is_error: false
        }))
        setActions(convertingAction)
        const ffmpeg = ffmpegRef.current

        try {
            const convertedFiles = await Promise.all(
                convertingAction.map(async (action) => {
                    try {
                        const result = await ConvertFile(ffmpeg, action);
                        return {
                            ...action,
                            is_converting: false,
                            is_converted: true,
                            is_error: false,
                            url: result.url,
                            output: result.output
                        };
                    } catch (err) {
                        console.error('Error converting file:', action.file_name, err);
                        return {
                            ...action,
                            is_converted: false,
                            is_converting: false,
                            is_error: true
                        };
                    }
                })
            )
            setActions(convertedFiles)
            setIsLoaded(false)
            setIsConvert(false)
            setIsDone(true)

            toast({
                title: "Conversion Successful!",
                description: "All files have been converted successfully.",
            })
        } catch (error) {
            console.error('Conversion failed', error);
            toast({
                title: "Conversion Failed",
                description: "There was an error converting the files.",
            });
            setIsLoaded(false);
        }    
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

    const handleRemoveFile = (fileName) => {
        setActions(actions.filter((action) => action.file_name !== fileName))
    }

    const resetFile = () => {
        setIsDone(false)
        setIsConvert(false)
        setActions([])
        setFiles([])
        setIsReady(false)
    }

    useEffect(() => {
        if (!actions.length) {
            setIsDone(false)
            setFiles([])
            setIsReady(false)
            setIsConvert(false)
        } else {
            checkIsReady()
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
                        {/* {!isLoaded && (
                            <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
                        )} */}
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
                                {ByteToSize(action.file_size)}
                            </span>
                        </div>
                        {action.is_converted ? (
                            <Badge className="bg-emerald-600 flex gap-2 items-center p-1 lg:mx-20">
                                <span>Done</span>
                                <CheckCircledIcon />
                            </Badge>
                        ) : action.is_converting ? (
                            <Badge className="flex gap-2 items-center p-1 lg:mx-20">
                                <span>Converting</span>
                                <CircleIcon className="animate-spin" />
                            </Badge>
                        ) : action.is_error ? (
                            <Badge variant='destructive' className="p-1 lg:mx-20 lg:w-[35%]">
                                <span>Failed when converting</span>
                            </Badge>
                        ) : (
                            <div className="flex items-center gap-4 w-96">
                                <span className="text-md text-nowrap font-medium overflow-x-hidden text-muted-foreground">Convert to</span>
                                <Select
                                    onValueChange={(value) => {
                                        if (extensions.video.includes(value)) {
                                            setDefaultValues('video')
                                        } else if (extensions.audio.includes(value)) {
                                            setDefaultValues('audio')
                                        }
                                        setSelected(value)
                                        updateActions(action.file_name, value)
                                    }}
                                    value={action.selectedFormat}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent className='h-fit'>
                                        {action.file_type.includes('image') ?
                                            <div className="grid grid-cols-3 ">
                                                {extensions.image.map((image, i) => (
                                                    <div key={i} className="mx-auto">
                                                        <SelectItem value={image}>{image}</SelectItem>
                                                    </div>
                                                ))}
                                            </div> : null
                                        }
                                        {action.file_type.includes('video') ?
                                            <div>
                                                <Tabs defaultValue={defaultValues} className="w-[300px]">
                                                    <TabsList className="w-full grid grid-cols-2">
                                                        <TabsTrigger value="video">Video</TabsTrigger>
                                                        <TabsTrigger value="audio">Audio</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="video">
                                                        <div className="grid grid-cols-3 ">
                                                            {extensions.video.map((video, i) => (
                                                                <div key={i} className="mx-auto">
                                                                    <SelectItem value={video}>{video}</SelectItem>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TabsContent>
                                                    <TabsContent value="audio">
                                                        <div className="grid grid-cols-2">
                                                            {extensions.audio.map((audio) => (
                                                                <div key={i} className="mx-auto">
                                                                    <SelectItem value={audio}>{audio}</SelectItem>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                            : null
                                        }
                                        {action.file_type.includes('audio') ?
                                            <div className="grid grid-cols-2">
                                                {extensions.audio.map((audio, i) => (
                                                    <div key={i} className="mx-auto">
                                                        <SelectItem value={audio}>{audio}</SelectItem>
                                                    </div>
                                                ))}
                                            </div> : null
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="flex justify-end">
                            {action.is_converted ? (
                                <Button variant='outline' className='p-3'>
                                    <span>Download</span>
                                </Button>
                            ) : (
                                <Button onClick={() => handleRemoveFile(action.file_name)} variant='ghost' className='rounded-full p-3'>
                                    <TrashIcon className="w-6 h-6" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    {isDone ? (
                        <div className="flex flex-col justify-center gap-3">
                            <Button className='bg-[#e5322d] hover:bg-red-500 p-5'>{actions.length > 1 ? "Download all" : "Download file"}</Button>
                            <Button onClick={resetFile} variant='outline' className='p-5'>Convert another file(s)</Button>
                        </div>
                    ) : (
                        <Button disabled={!isReady || isConverting} onClick={handleConvert} className='bg-[#e5322d] hover:bg-red-500 hover:rounded-xl p-5 text-md transition-all ease-in-out'>
                            {isConverting ? (
                                <div className="flex gap-2 items-center">
                                    <span className="animate-spin text-lg">
                                        <CircleIcon />
                                    </span>
                                    <span>Convert Now</span>
                                    <span className="animate-spin text-lg">
                                        <CircleIcon />
                                    </span>
                                </div>
                            ) : (
                                <span>Convert Now</span>
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