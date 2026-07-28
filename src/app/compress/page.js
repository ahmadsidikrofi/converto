import DropzoneCompressor from "@/components/DropzoneCompressor";
import Header from "@/components/Header";

const CompressPage = () => {
    return (
        <main className="flex flex-col items-center p-10">
            <Header 
                title="Ultra-Fast Media & Video Compressor"
                description="Kompres video 4K & gambar raksasa Anda secara instan di peramban tanpa mengunggah berkas ke server. Dapatkan ukuran di bawah 25MB untuk WhatsApp & Email dengan sekali klik tanpa kehilangan kualitas!"
            />

            <div className="mt-12 text-center lg:max-w-5xl lg:w-full">
                <DropzoneCompressor />
            </div>
        </main>
    );
}
 
export default CompressPage;