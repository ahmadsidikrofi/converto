import React from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link";
import Image from 'next/image';

// Start of Selection
const NavMenuTab = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="lg:text-lg font-medium">All Tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <Image src="/Converto-logo.png" height={728} width={728} alt="Converto Logo" className='w-32 h-32' />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            Converto
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Buka potensi kreativitasmu dengan Converto – 
                                            platform online andalan buat konversi multimedia. 
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <Link href="/background-remover">
                                <ListItem title="Background Remover">
                                    Buat gambar lebih bersih dan fokus dengan Converto! 
                                    Hilangkan background dengan sekali klik dan bikin hasilnya jadi lebih pro. 
                                    Gampang, cepat, dan hasilnya bikin puas!
                                </ListItem>
                            </Link>
                            <Link href="/compress">
                                <ListItem title="Image Reducer">
                                    Gak perlu khawatir soal ukuran file lagi! Dengan Converto, 
                                    kamu bisa kompres gambar jadi lebih kecil tanpa mengorbankan kualitas.
                                    Simpan space, stay sharp, dan siap untuk dipamerkan ke mana saja! Compress now and Tadaa🤩
                                </ListItem>
                            </Link>
                            <Link href="/">
                                <ListItem title="Convert Files">
                                    Buka potensi kreativitasmu dengan Converto – 
                                    platform online andalan buat konversi multimedia. 
                                </ListItem>
                            </Link>
                            <Link href="/image-to-pdf">
                                <ListItem title="Image To PDF">
                                    Dari foto ke PDF? Semuanya bisa dalam sekejap dengan Converto!
                                    Ubah gambar jadi dokumen keren, gampang banget, dan langsung siap share. 
                                    Keep it simple, keep it classy, convert sekarang, dan langsung unduh!🔥
                                </ListItem>
                            </Link>
                            <Link href="/image-generator">
                                <ListItem title="AI Image Generator">
                                    Dari foto ke PDF? Semuanya bisa dalam sekejap dengan Converto!
                                    Ubah gambar jadi dokumen keren, gampang banget, dan langsung siap share. 
                                    Keep it simple, keep it classy, convert sekarang, dan langsung unduh!🔥
                                </ListItem>
                            </Link>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef((props, ref) => {
  const { className, title, children, ...rest } = props;
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          {...rest}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default NavMenuTab;