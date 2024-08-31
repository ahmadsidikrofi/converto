import ImageToPdf from "@/components/ImageToPdf";

const ImageToPdfPage = () => {
    return ( 
        <main className="flex flex-col items-center p-10">
            <div className="relative flex flex-col place-items-center gap-5">
                <h1 className="lg:text-5xl sm:text-4xl max-sm:text-2xl text-nowrap font-semibold text-[#e5322d]">IMAGE TO PDF</h1>
                <p className="text-center md:break-words text-lg max-sm:text-sm text-slate-500 md:w-[60%]">
                    Dari foto ke PDF? Semuanya bisa dalam sekejap dengan Converto!
                    Ubah gambar jadi dokumen keren, gampang banget, dan langsung siap share. 
                    Keep it simple, keep it classy, convert sekarang, dan langsung unduh!🔥
                </p>
            </div>

            <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
                <ImageToPdf />
            </div>
        </main>
    )
}
 
export default ImageToPdfPage;