import DropzoneRemoverBg from "@/components/DropzoneRemoverBg";
import Header from "@/components/Header";

const BackgroundRemover = () => {
    return ( 
        <main className="flex flex-col items-center p-10">
            <Header 
                title="Quickly Remove Your Background"
                description="Buat gambar lebih bersih dan fokus dengan Converto! 
                    Hilangkan background dengan sekali klik dan bikin hasilnya jadi lebih pro. 
                    Gampang, cepat, dan hasilnya bikin puas!"
            />
            <div className="mt-10 text-center lg:max-w-5xl lg:w-full">
                <DropzoneRemoverBg />
            </div>
        </main>
    );
}
 
export default BackgroundRemover;