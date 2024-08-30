'use client'
import Image from "next/image";
import Dropzone from "@/components/Dropzone";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-10">
      <div className="relative flex flex-col place-items-center gap-5">
        <h1 className="md:text-5xl sm:text-4xl max-sm:text-2xl text-nowrap font-semibold text-[#e5322d]">Infinite Free File Converter</h1>
        <p className="text-center md:break-words text-lg max-sm:text-sm text-slate-500 md:w-[60%]"> 
          Buka potensi kreativitasmu dengan Converto – platform online andalan buat konversi multimedia 
          tanpa batas dan gratis!. Ubah gambar, audio, dan video dengan mudah tanpa ada batasan. 
          Mulai konversi sekarang dan bikin kontenmu jadi lebih keren!  
        </p>
      </div>

      <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
        <Dropzone />
      </div>
    </main>
  );
}
