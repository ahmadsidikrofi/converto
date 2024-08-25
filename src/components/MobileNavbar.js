'use client'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Button } from "./ui/button"

const MobileNavbar = () => {
    return (
        <nav>
            <Sheet>
                <SheetTrigger><HamburgerMenuIcon className="w-5 h-5" /></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="mt-10 text-center">
                            <h2 className="text-xl font-bold text-[#e5322d]">Converto</h2>
                        </SheetTitle>
                        <SheetDescription>
                            <div className="flex flex-col justify-center items-center">
                                <Link href="/">
                                    <Button variant="ghost" className="text-md font-medium">Home</Button>
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