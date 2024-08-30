import DropzoneRemoverBg from "@/components/DropzoneRemoverBg";

const BackgroundRemover = () => {
    return ( 
        <main className="flex flex-col items-center p-10">
            <div className="relative flex flex-col place-items-center gap-5">
                <h1 className="lg:text-5xl sm:text-4xl max-sm:text-2xl text-center font-semibold text-[#e5322d]">Quickly Remove Your Background</h1>
                <p className="text-center md:break-words text-lg max-sm:text-sm text-slate-500 md:w-[60%]">
                    Buat gambar lebih bersih dan fokus dengan Converto! 
                    Hilangkan background dengan sekali klik dan bikin hasilnya jadi lebih pro. 
                    Gampang, cepat, dan hasilnya bikin puas!
                </p>
            </div>

            <div className="mt-10 text-center lg:max-w-5xl lg:w-full">
                <DropzoneRemoverBg />
            </div>
        </main>
    );
}
 
export default BackgroundRemover;