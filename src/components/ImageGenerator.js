'use client'
import { Download, Sparkle, DownloadSimple} from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";

const ImageGenerator = () => {
    return ( 
        <div className="mt-5 flex flex-col items-center gap-3">
            <div className="relative">
                <Image alt="..." height={728} width={728} src="/default_image.svg" className="object-cover w-52 h-52 rounded-lg" />
                <Button className="absolute right-1 top-0"> <DownloadSimple className="h-4 w-4" /> </Button>
            </div>
            <div className="relative w-[40rem]">
                <Input className="border-2 border-red-500 rounded-full w-full h-12 pr-20 focus:border-none" placeholder="Describe what you want to see with phrases, and separate them with"/>
                <Button className="border-2 border-red-900 absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 flex items-center gap-2 rounded-full group"> 
                    <Sparkle className="h-4 w-4 group-hover:scale-150 group-hover:text-red-200 transition-all ease-linear" />
                    <span >Generate</span>
                </Button>
            </div>
        </div>
    )
}
 
export default ImageGenerator;