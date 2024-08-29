'use client'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Button } from "./ui/button"
import { MoonStars, SunHorizon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

const MobileNavbar = () => {
    const { theme, setTheme } = useTheme()
    return (
        <nav>
            <Sheet>
                <SheetTrigger><HamburgerMenuIcon className="w-5 h-5" /></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="mt-10 text-center">
                            <div className="flex gap-2 justify-center mb-5">
                                <Button onClick={() => setTheme(theme === 'light' ?  'dark' : 'light')} variant='outline'>
                                    {theme === 'light' ? <MoonStars className="w-4 h-4" /> : <SunHorizon className="w-4 h-4" />}
                                </Button>
                                <Link target="_blank" href="https://github.com/ahmadsidikrofi/converto">
                                    <Button variant='outline'><GitHubLogoIcon className="w-4 h-4" /></Button>
                                </Link>
                            </div>
                            <h2 className="text-xl font-bold text-[#e5322d]">Converto</h2>
                        </SheetTitle>
                        <SheetDescription>
                            <div className="flex flex-col justify-center items-center">
                                <Link href="/">
                                    <Button variant="ghost" className="text-md font-medium">Home</Button>
                                </Link>
                                <Link href="/compress">
                                    <Button variant="ghost" className="text-sm lg:text-lg font-medium">Compressor</Button>
                                </Link>
                                <Link href="/about">
                                    <Button variant="ghost" className="text-md font-medium">About</Button>
                                </Link>
                                <Link href="/privacy-policy">
                                    <Button variant="ghost" className="text-md font-medium">Privacy Policy</Button>
                                </Link>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </nav>
    )
}
export default MobileNavbar