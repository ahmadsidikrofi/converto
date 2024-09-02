import DropzoneCompressor from "@/components/DropzoneCompressor";
import Header from "@/components/Header";

const CompressPage = () => {
    return (
        <main className="flex flex-col items-center p-10">
            <Header 
                title="Minimize Image In Second"
                description="Gak perlu khawatir soal ukuran file lagi! Dengan Converto, 
                    kamu bisa kompres gambar jadi lebih kecil tanpa mengorbankan kualitas.
                    Simpan space, stay sharp, dan siap untuk dipamerkan ke mana saja! Compress now and Tadaa🤩"
            />

            <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
                <DropzoneCompressor />
            </div>
        </main>
    );
}
 
export default CompressPage;