'use client'

import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import Link from "next/link"
import MobileNavbar from "./MobileNavbar"
import Image from "next/image"
import { useTheme } from "next-themes"

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    return (
        <nav className={`flex items-center justify-between  max-sm:px-5 sm:px-5 md:px-16 py-10 dark:bg-slate-800`}>
            <Link href="/" className='flex items-center gap-2'>
                <Image src="/Converto-logo.png" width={728} height={728} alt='Converto Logo' className='w-10' />
                <h2 className="text-3xl font-bold text-[#e5322d]">Converto</h2>
            </Link>
            <div className="hidden lg:flex gap-3">
                <Link href="/">
                    <Button variant="ghost" className="lg:text-lg font-medium">Home</Button>
                </Link>
                <Link href="/compress">
                    <Button variant="ghost" className="lg:text-lg font-medium">Compressor</Button>
                </Link>
                <Link href="/about">
                    <Button variant="ghost" className="lg:text-lg font-medium">About</Button>
                </Link>
                <Link href="/privacy-policy">
                    <Button variant="ghost" className="lg:text-lg font-medium">Privacy Policy</Button>
                </Link>
            </div>
            <div className="hidden lg:flex items-center gap-3">
                <Button variant="ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    {theme === 'light' ? <SunIcon className="h-5 w-5"/> : <MoonIcon className="h-5 w-5"/>}
                </Button>
                <Link target="_blank" href="https://github.com/ahmadsidikrofi/converto">
                    <Button className="rounded-full bg-slate-800 p-3 flex items-center justify-center gap-3 hover:bg-white  hover:text-slate-800">
                        <p className="">Github Repo</p> 
                        <GitHubLogoIcon className="w-4 h-4"/>
                    </Button>
                </Link>
            </div>
            <div className="lg:hidden block">
                <MobileNavbar />
            </div>
        </nav>
    )
}
export default Navbar