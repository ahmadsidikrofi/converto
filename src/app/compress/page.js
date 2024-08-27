import DropzoneCompressor from "@/components/DropzoneCompressor";

const CompressPage = () => {
    return (
        <main className="flex flex-col items-center p-10">
            <div className="relative flex flex-col place-items-center gap-5">
                <h1 className="lg:text-5xl sm:text-4xl max-sm:text-lg font-semibold text-[#e5322d]">Minimize Image With Unlimited</h1>
                <p className="text-center md:break-words text-lg max-sm:text-sm text-slate-500 md:w-[60%]">Unleash your creativity with Converto – the ultimate online tool for unlimited and free multimedia conversion. Transform images, audio, and videos effortlessly, without restrictions. Start converting now and elevate your content like never before!</p>
            </div>

            <div className="mt-16 text-center lg:max-w-5xl lg:w-full">
                <DropzoneCompressor />
            </div>
        </main>
    );
}
 
export default CompressPage;