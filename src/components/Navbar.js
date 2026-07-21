'use client'

import { useState, useEffect } from "react"
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import Link from "next/link"
import MobileNavbar from "./MobileNavbar"
import Image from "next/image"
import { useTheme } from "next-themes"
import NavMenuTab from "./NavigationMenu"
import { usePathname } from "next/navigation"
import DropdownMenuProfile from "./shadcn-space/radix/dropdown-menu/dropdown-menu-profile"

const Navbar = () => {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const hiddenRoutes = ["/login", "/register"]
    if (hiddenRoutes.includes(pathname)) return null

    return (
        <div className={`sticky top-0 z-50 transition-all duration-300 w-full ${isScrolled ? 'pt-4 px-4 sm:px-6 md:px-8 pb-2' : 'p-0'}`}>
            <nav className={`mx-auto flex items-center justify-between transition-all duration-300 ease-in-out ${
                isScrolled 
                    ? 'py-3 px-6 shadow-lg bg-white/70 dark:bg-black/70 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-2xl max-w-6xl' 
                    : 'py-5 px-5 md:px-16 shadow-[0_2px_4px_rgba(0,0,0,0.1)] bg-background border-b border-transparent rounded-none max-w-full'
            }`}>
                <Link href="/" className='flex items-center gap-2'>
                    <Image src="/Converto-logo.png" width={728} height={728} alt='Converto Logo' className={`transition-all duration-300 ${isScrolled ? 'w-8' : 'w-10'}`} />
                    <h2 className={`font-bold text-[#e5322d] transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-3xl'}`}>Converto</h2>
                </Link>
                
                <div className="hidden z-20 lg:flex gap-3 items-center">
                    <div>
                        <NavMenuTab />
                    </div>
                    <Link href="/about">
                        <Button variant="ghost" className="lg:text-lg font-medium">About</Button>
                    </Link>
                    <Link href="/privacy-policy">
                        <Button variant="ghost" className="lg:text-lg font-medium">Privacy Policy</Button>
                    </Link>
                </div>
                
                <div className="hidden lg:flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                        {theme === 'light' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                    </Button>
                    <DropdownMenuProfile />
                </div>
                
                <div className="lg:hidden block">
                    <MobileNavbar />
                </div>
            </nav>
        </div>
    )
}
export default Navbar