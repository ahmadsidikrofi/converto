'use client'
import Dropzone from "@/components/Dropzone";
import Header from "@/components/Header";

const ConvertPage = () => {
    return (
        <main className="flex flex-col items-center p-10">
            <Header title="Infinite Free File Converter"
                description="Buka potensi kreativitasmu dengan Converto – platform online andalan buat konversi multimedia 
          tanpa batas dan gratis!. Ubah gambar, audio, dan video dengan mudah tanpa ada batasan. 
          Mulai konversi sekarang dan bikin kontenmu jadi lebih keren! "
            />

            <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
                <Dropzone />
            </div>
        </main>
    )
}

export default ConvertPage