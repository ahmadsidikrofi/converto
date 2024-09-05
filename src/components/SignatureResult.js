'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";
import { SpinnerBall } from "@phosphor-icons/react";
import { Label } from "./ui/label";

const SignatureResult = ({ sign, isCanvasEmpty, isBGTransparent, setIsBGTransparent }) => {
    const [signResult, setSignResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const updateCanvasResult = () => {
        if (sign) {
            const canvas = sign.getCanvas()
            const ctx = canvas.getContext("2d")
            if (!isBGTransparent) {
                ctx.globalCompositeOperation = "destination-over"
                ctx.fillStyle = "white"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            } 
            // console.log(signResult)
            setSignResult(sign.getTrimmedCanvas().toDataURL('/image/png'))
        }
    }
    const handleSaveSign = () => {
        updateCanvasResult()
    }

    const handleBgTransparent = () => {
        setIsBGTransparent((prevState) => !prevState)
        updateCanvasResult()
    }

    const handleDownloadSignature = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            const link = document.createElement('a')
            link.href = signResult
            link.download = "Your_signature.png"
            link.click()
        }, 2000)
    }
    return (
        <Dialog>
            <DialogTrigger asChild >
                <Button onClick={handleSaveSign} disabled={isCanvasEmpty} className="bg-rose-600 max-sm:text-sm text-lg rounded-full">Save</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Benar begini tanda tanganmu?</DialogTitle>
                    <DialogDescription>
                        Apabila ada perubahan masih bisa dirubah, jika mantap maka siap unduh
                    </DialogDescription>
                </DialogHeader>
                <div className="p-3">
                    <Image src={signResult} width={1360} height={1360} alt="My Sign" className="w-full h-full"/>
                </div>
                <DialogFooter>
                    <div className="flex gap-[9.5rem]">
                        <div className="flex items-center space-x-2">
                            <Switch id="transparent-background"
                                checked={isBGTransparent}
                                onCheckedChange={handleBgTransparent}
                            />
                            <Label htmlFor="transparent-background"><span className="max-sm:text-[12px]">Transparent Background</span></Label>
                        </div>
                        <Button onClick={handleDownloadSignature} disabled={isLoading} className="bg-rose-600 rounded-full flex gap-2 items-center">
                            {isLoading ? <SpinnerBall className="animate-spin h-5 w-5"/> : null}
                            <span className="max-sm:text-[12px]">Download Sign</span>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SignatureResult;