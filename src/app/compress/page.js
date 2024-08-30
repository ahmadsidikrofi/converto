import DropzoneCompressor from "@/components/DropzoneCompressor";

const CompressPage = () => {
    return (
        <main className="flex flex-col items-center p-10">
            <div className="relative flex flex-col place-items-center gap-5">
                <h1 className="lg:text-5xl sm:text-4xl max-sm:text-2xl text-nowrap font-semibold text-[#e5322d]">Minimize Image In Second</h1>
                <p className="text-center md:break-words text-lg max-sm:text-sm text-slate-500 md:w-[60%]">
                    Gak perlu khawatir soal ukuran file lagi! Dengan Converto, 
                    kamu bisa kompres gambar jadi lebih kecil tanpa mengorbankan kualitas.
                    Simpan space, stay sharp, dan siap untuk dipamerkan ke mana saja! Compress now and Tadaa🤩    
                </p>
            </div>

            <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
                <DropzoneCompressor />
            </div>
        </main>
    );
}
 
export default CompressPage;