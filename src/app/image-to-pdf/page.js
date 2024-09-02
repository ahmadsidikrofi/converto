import Header from "@/components/Header";
import ImageToPdf from "@/components/ImageToPdf";

const ImageToPdfPage = () => {
    return ( 
        <main className="flex flex-col items-center p-10">
            <Header 
                title="IMAGE TO PDF"
                description="Dari foto ke PDF? Semuanya bisa dalam sekejap dengan Converto!
                    Ubah gambar jadi dokumen keren, gampang banget, dan langsung siap share. 
                    Keep it simple, keep it classy, convert sekarang, dan langsung unduh!🔥"
            />
            <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
                <ImageToPdf />
            </div>
        </main>
    )
}
 
export default ImageToPdfPage;