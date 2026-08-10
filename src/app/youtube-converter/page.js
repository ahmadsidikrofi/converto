import Header from "@/components/Header"
import YoutubeConverterClient from "@/components/YoutubeConverterClient"

const YoutubeConverterPage = () => {
    return (
        <main className="flex flex-col items-center p-10">
            <Header
                title="Konverter Video YouTube menjadi MP4 & MP3"
                description="Ingin simpan video YouTube untuk ditonton offline? Coba Konverter YouTube Converter dari Converto! Alat online gratis ini memungkinkan Anda mengunduh video dan audio dari YouTube dengan kualitas tinggi dan menyimpannya langsung di perangkat Anda — tanpa perlu instalasi software tambahan."
            />

            <div className="mt-12 text-center lg:max-w-5xl lg:w-full">
                <YoutubeConverterClient />
            </div>
        </main>
    )
}

export default YoutubeConverterPage