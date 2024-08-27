'use client'
import Image from "next/image";
import Dropzone from "@/components/Dropzone";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-10">
      <div className="relative flex flex-col place-items-center gap-5">
        <h1 className="md:text-5xl sm:text-4xl max-sm:text-2xl text-nowrap font-semibold text-[#e5322d]">Infinite Free File Converter</h1>
        <p className="text-center md:break-words text-lg max-sm:text-sm text-slate-500 md:w-[60%]"> Unlock your creative potential with Converto – your go-to online platform for limitless and free multimedia conversion. Seamlessly convert images, audio, and videos without any boundaries. Begin converting today and take your content to the next level!</p>
      </div>

      <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
        <Dropzone />
      </div>
    </main>
  );
}
