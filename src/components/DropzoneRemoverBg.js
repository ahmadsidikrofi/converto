'use client'
import { FilePng, SpinnerGap, TrayArrowUp } from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"
import ReactDropzone from "react-dropzone"
import LoadFfmpeg from "../../utils/load-ffmpeg"
import { useToast } from "./ui/use-toast"
import CompressFileName from "../../utils/compress-file-name"
import ByteToSize from "../../utils/byte-to-size"
import { Button } from "./ui/button"
import { TrashIcon } from "@radix-ui/react-icons"
import JSZip from "jszip"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DropzoneRemoverBg = () => {
    const { toast } = useToast()
    const [isHover, setIsHover] = useState(false)
    const [actions, setActions] = useState([])
    const [isDone, setIsDone] = useState(false)
    const [files, setFiles] = useState([])
    const [isReady, setIsReady] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    // const [activeTab, setActiveTab] = useState('before')
    const ffmpegRef = useRef(null)
    const [isDownloading, setIsDownloading] = useState(false)
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
                file_url: URL.createObjectURL(file),
                from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
                to: null,
                file_type: file.type,
                file: file,
                is_removed: false,
                is_removing: false,
                is_error: false,
                selectedFormat: null,
                activeTab: 'before',
            })
            setActions(tmp)
        })
    }

    const handleRemoveFile = (file_name) => {
        setActions(actions.filter(action => action.file_name !== file_name))
    }

    const resetFile = () => {
        setIsDone(false)
        setActions([])
        setFiles([])
        setIsReady(false)
        // setActiveTab('before')
    }

    const handleDownloadFile = () => {
        setIsDownloading(true)
        setTimeout(() => {setIsDownloading(false)}, 2000)
        if (actions.length > 1) {
            const zip = new JSZip()
            const promises = actions.map(async(action) => {
                if (action.is_removed && action.remove_bg_url) {
                    return fetch(action.remove_bg_url)
                    .then((res) => res.blob())
                    .then((blob) => {
                        zip.file(action.file_name, blob);
                    });
                }
            })
            Promise.all(promises).then(() => {
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = 'bg_removed_downloaded.zip';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            });
        } else if (actions.length === 1) {
            const action = actions[0];
            if (action.is_removed && action.remove_bg_url) {
                const link = document.createElement('a');
                link.href = action.remove_bg_url;
                link.download = action.file_name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    const handleRemoveBackground = async (file_name) => {
        const updateActions = actions.map((action) => {
            if (action.file_name === file_name) {
                return { ...action, is_removing: true }
            }
            return action
        })
        setActions(updateActions)
        try {
            const formData = new FormData()
            formData.append('size', 'auto')
            formData.append('image_file', actions.find((action) => action.file_name === file_name).file)
    
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: { "X-Api-Key": "wryYWQSxXNB1D8qoeNjFpCKM" },
                body: formData,
            })
            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer()
                const blob = new Blob([arrayBuffer])
                const removedBgUrl = URL.createObjectURL(blob)

                const updateActions = actions.map((action) => {
                    if (action.file_name === file_name) {
                        return { ...action, is_removing: false, is_removed: true, remove_bg_url: removedBgUrl, activeTab: 'after' }
                    }
                    return action
                })
                setActions(updateActions)
                toast({
                    title: "Background menghilang",
                    description: "Backgroundmu sudah dihilangkan entah kemana.",
                    duration: 4000
                })
                // setActiveTab('after')
                setIsDone(true)
                console.log('Background berhasil dihapus')
            } else {
                throw new Error(`${response.status}: ${response.statusText}`)
            }
        } catch {
            const updatedActions = actions.map((action) => {
                if (action.file_name === file_name) {
                    return { ...action, is_error: true, is_removing: false, activeTab: 'before' }
                }
                return action
            })
            toast({
                variant: 'destructive',
                title: "Bukan Gambar Biasa",
                description: "Kemampuan kami tidak kuat menghilangkan backgroundmu.",
                duration: 6000
            })
            setIsDone(true)
            setActions(updatedActions)
        }
    }

    const checkIsReady = () => {
        let tmpReady = true
        actions.forEach((action) => {
            if (!action.to) tmpReady = false
        })
        setIsReady(tmpReady)
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
            // setActiveTab('before')
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
                {actions.filter((action) => action.file_type.includes('image')).map((action, i) => (
                    <div className="w-full py-4 space-y-2 lg:py-0 relative rounded-xl flex flex-col justify-center items-center" key={i}>
                        <div className="mt-12 z-10">
                            {!action.is_removed ? (
                                <Button disabled={action.is_removing ? true : false} onClick={() => handleRemoveBackground(action.file_name)} className="rounded-full p-3 bg-sky-500">Remove Background</Button>
                            ) : null}
                        </div>
                        <div className="border p-2 rounded-lg mx-auto z-10">
                            <Tabs value={action.activeTab} className="w-[320px] ">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="before" onClick={() => {
                                        const updateTab = actions.map((actionTab) => actionTab.file_name === action.file_name ? {...actionTab, activeTab: 'before'} : actionTab)
                                        setActions(updateTab)
                                    }}>Before</TabsTrigger>
                                    <TabsTrigger value="after" disabled={!action.is_removed} onClick={() => {
                                        const updateTab = actions.map((actionTab) => actionTab.file_name === action.file_name ? {...actionTab, activeTab: 'after'} : actionTab)
                                        setActions(updateTab)
                                    }}>After</TabsTrigger>
                                </TabsList>
                                <TabsContent value="before" className="flex flex-col items-center justify-center gap-3">
                                    <Image src={action.file_url} width={728} height={728} alt={action.file_name} className="w-80 h-full object-cover rounded-lg" />
                                    <Button onClick={() => handleRemoveFile(action.file_name)} variant='outline' className='p-2 mt-1 bg-sky-100 dark:bg-sky-700'>
                                        <TrashIcon className="w-6 h-6" />
                                    </Button>
                                </TabsContent>
                                <TabsContent value="after">
                                    {action.is_removed && action.remove_bg_url ? (
                                        <Image alt="..." src={action.remove_bg_url} width={728} height={728} className="w-80 h-full object-cover rounded-lg" />
                                    ) : action.is_removing ? (
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500"></div>
                                            <div className="w-80 h-80 bg-gray-300 rounded-lg animate-pulse"></div>
                                            <p className="text-gray-500">Menghapus background, mohon tunggu...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500"></div>
                                            <div className="w-80 h-60 bg-gray-300 rounded-lg animate-pulse"></div>
                                            <p className="text-slate-400">Gambar belum diproses atau terjadi kesalahan.</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>  
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium overflow-x-hidden max-sm:text-[12px]">
                                {CompressFileName(action.file_name)}
                            </span>
                            <div className="flex gap-1">
                                <span className="text-[10px] font-medium">
                                    ({ByteToSize(action.file_size)})
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className={`lg:sticky bottom-1/2 right-0 lg:flex lg:justify-end lg:pr-10`}>
                    {isDone ? (
                        <div className="flex flex-col justify-center gap-3">
                            <Button onClick={handleDownloadFile} disabled={isDownloading} className='bg-[#e5322d] hover:bg-red-500 p-5 max-sm:text-sm sm:text-sm text-lg'>
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
                            <Button onClick={resetFile} variant='outline' className='p-5 max-sm:text-sm sm:text-sm text-lg'>Remove another Background</Button>
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
    );
}
 
export default DropzoneRemoverBg;