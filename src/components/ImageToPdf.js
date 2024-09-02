'use client'
import { CheckCircle, FilePng, SpinnerGap, TrayArrowUp, Warning, XCircle } from "@phosphor-icons/react"
import ReactDropzone from "react-dropzone"
import { useToast } from "./ui/use-toast"
import { useEffect, useRef, useState } from "react"
import LoadFfmpeg from "../../utils/load-ffmpeg"
import CompressFileName from "../../utils/compress-file-name"
import jsPDF from "jspdf"
import IconFile from "../../utils/icon-file"
import { Button } from "./ui/button"
import { TrashSimple } from "@phosphor-icons/react/dist/ssr"
import { Badge } from "./ui/badge"

const ImageToPdf = () => {
    const { toast } = useToast()
    const [isHover, setIsHover] = useState(false)
    const [actions, setActions] = useState([])
    const [isDone, setIsDone] = useState(false)
    const [files, setFiles] = useState([])
    const [isReady, setIsReady] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isConverting, setIsConverting] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
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
            const image = new Image()
            const objectUrl = URL.createObjectURL(file)
            image.onload = () => {
                const dimensions = {
                    width: image.width,
                    height: image.height,
                }
                tmp.push({
                    file_name: file.name,
                    file_size: file.size,
                    file_url: objectUrl,
                    from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
                    to: null,
                    file_type: file.type,
                    file: file,
                    is_converted: false,
                    is_converting: false,
                    is_error: false,
                    selectedFormat: null,
                    dimensions
                })
                setActions(tmp)
            }
            image.src = objectUrl
        })
    }

    const handleRemoveFile = (fileName) => {
        setActions(actions.filter((action) => action.file_name !== fileName))
    }

    const checkIsReady = () => {
        let tmpReady = true
        setIsChecking(true)
        setTimeout(() => {
            setIsChecking(false)
            setIsReady(tmpReady)
        }, 1000)
    }

    const handleConvertToPDF = async () => {
        if (!isReady) return
        setIsConverting(true)

        let convertingToPDFAction = actions.map((action) => ({
            ...action,
            is_converted: false,
            is_error: false,
            is_converting: true
        }))
        setActions(convertingToPDFAction)

        const pdf = new jsPDF()
        try {
            const convertedFiles =  await Promise.all(
                convertingToPDFAction.map((action, i) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image()
                        img.src = action.file_url
                        img.onload = () => {
                            const imgWidth = pdf.internal.pageSize.getWidth()
                            const imgHeight =  pdf.internal.pageSize.getHeight()
                            if (i > 0) pdf.addPage()
                            pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
                            resolve()
                        }
                        img.onerror = reject
                    })
                })
            )
            setActions((prevActions) => prevActions.map((action) => ({
                ...action,
                is_converting: false,
                is_converted: true,
                pdf,
            })))
            setTimeout(() => {
                setIsDone(true)
                setIsConverting(false)
                setIsLoaded(false)
                toast({
                    title: "Conversion Successfull",
                    description: "Seluruh gambarmu sukses menjadi PDF 🗃️.",
                    duration: 3000
                })
            }, 2000)
        } catch (err) {
            console.error("Error while convert to pdf", err)
            setActions((prevActions) => prevActions.map((action) => ({
                ...action,
                is_error: true,
                is_converting: false,
            })))
            toast({
                title: "Terlalu kuat",
                description: "Gambarmu tidak mau jadi PDF.",
                duration: 3000
            })
        }
    }

    const handleDownloadAll = async () => {
        setIsDownloading(true)
        setTimeout(() => {setIsDownloading(false)}, 1000)
        const pdf = new jsPDF({
            format: 'a4'
        })
        await Promise.all(actions.map(async(action, i) => {
            const imgData = await new Promise((resolve, reject) => {
                const img = new Image()
                img.src = action.file_url
                img.onload = () => resolve(img)
                img.onerror = reject
            })
            if (i > 0) pdf.addPage()
            const imgWidth = pdf.internal.pageSize.getWidth()
            const imgHeight = (imgData.height * imgWidth) / imgData.width // Hitung tinggi berdasarkan lebar
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
        }))
        pdf.save('Secara keseluruhan...pdf')
    }

    const handleDownloadPerImage = (action) => {
        const pdf = new jsPDF({
            format: 'a4'
        })
        const img = new Image()
        img.src = action.file_url;
        img.onload = () => {
            const imgWidth = pdf.internal.pageSize.getWidth()
            const imgHeight = (img.height * imgWidth) / img.width
            pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
            pdf.save(`${CompressFileName(action.file_name)}.pdf`)
        }
    }

    const resetFile = () => {
        setIsDone(false)
        setIsConverting(false)
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
                {actions.map((action, i) => (
                    <div key={i} className="w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border max-sm:border-none h-fit lg:h-20 max-sm:px-0 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between">
                        <div className="flex items-center gap-4 w-full max-sm:px-8">
                            <span className="text-red-500 sm:text-sm max-sm:text-sm">
                                {IconFile(action.file_type)}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-md font-medium overflow-x-hidden max-sm:text-[12px]">
                                    {CompressFileName(action.file_name)}
                                </span>
                                <span className="text-md font-medium overflow-x-hidden max-sm:block hidden text-muted-foreground text-[10px]">
                                    {action.dimensions.width} x {action.dimensions.height} px
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 w-96">
                            <span className="text-md font-medium overflow-x-hidden max-sm:hidden">
                                {action.dimensions.width} x {action.dimensions.height} px
                            </span>
                        </div>
                        {action.is_converted ? (
                            <Badge className="bg-emerald-500 flex gap-2 items-center p-1 lg:mx-20 max-sm:mx-8">
                                <span>Done</span>
                                <CheckCircle />
                            </Badge>
                        ) : isConverting ? (
                            <Badge className="flex gap-2 items-center p-1 lg:mx-20 max-sm:mx-8">
                                <span>Converting</span>
                                <SpinnerGap className="animate-spin" />
                            </Badge>
                        ) : action.is_error ? (
                            <Badge variant='destructive' className="p-1 lg:mx-20 lg:w-[25rem] flex gap-2 max-sm:mx-8">
                                <span>Failed when converting</span>
                                <Warning className="w-4 h-4" />
                            </Badge>
                        ) : isChecking ? (
                            <Badge className="bg-amber-500 flex gap-2 items-center p-1 lg:mx-20 max-sm:mx-8">
                                <span>Checking</span>
                                <SpinnerGap className="animate-spin" />
                            </Badge>
                        ) : (
                            <Badge className="bg-emerald-500 p-1 lg:mx-20 lg:w-[20rem] flex justify-center gap-2 max-sm:mx-8">
                                <span className="text-center">Ready to be PDF</span>
                                <CheckCircle className="h-4 w-4" />
                            </Badge>
                        )}
                        <div className="flex justify-end">
                            {action.is_converted ? (
                                <Button onClick={() => handleDownloadPerImage(action)} variant='outline' className='p-3 max-sm:mx-8'>
                                    <span>Download</span>
                                </Button>
                            ) : (
                                <Button onClick={() => handleRemoveFile(action.file_name)} variant='ghost' className='mx-3 p-3 max-sm:hidden'>
                                    <TrashSimple className="w-6 h-6" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    {isDone ? (
                        <div className="flex flex-col justify-center gap-3 max-sm:mx-8">
                            <Button onClick={handleDownloadAll} className='bg-[#e5322d] hover:bg-red-500 p-5'>
                                {isDownloading ? (
                                    <div className="flex gap-1">
                                        <span className="animate-spin text-lg">
                                            <SpinnerGap className="animate-spin" />
                                        </span>
                                        <span>Downloading...</span>
                                    </div>
                                ) : (
                                    <span>Download All PDF</span>
                                )}
                            </Button>
                            <Button onClick={resetFile} variant='outline' className='p-5'>Convert another file(s)</Button>
                        </div>
                    ) : (
                        <div className="max-sm:px-8">
                            <Button disabled={isConverting || !isReady} onClick={handleConvertToPDF} className='bg-[#e5322d] hover:bg-red-500 hover:rounded-xl p-5 text-md max-sm:text-sm transition-all ease-in-out'>
                                {isConverting ? (
                                    <div className="flex gap-2 items-center">
                                        <span className="animate-spin text-lg">
                                            <SpinnerGap className="animate-spin" />
                                        </span>
                                        <span>Converting...</span>
                                        <span className="animate-spin text-lg">
                                            <SpinnerGap className="animate-spin" />
                                        </span>
                                    </div>
                                ) : (
                                    <span>Convert to PDF</span>
                                )}
                            </Button>
                        </div>
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
 
export default ImageToPdf;