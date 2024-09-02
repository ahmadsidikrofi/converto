'use client'

import { Balloon, HandHeart, Image, LockKeyOpen, MouseLeftClick, MusicNoteSimple, PersonSimpleCircle, StarAndCrescent, Upload, VinylRecord } from "@phosphor-icons/react"

const AboutPage = () => {
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        const rotateX = -y / 10
        const rotateY = x / 10

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.transform = 'rotateX(0) rotateY(0)'
    };
    return (
        <main className="lg:px-28 py-16">
            <div className="container mx-auto">
                <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-8">
                    <div className="flex gap-1">
                        <HandHeart weight="fill" className="h-10 w-10 text-red-600"/>
                        <div className="text-gray-700 dark:text-white text-2xl font-bold mb-6 flex items-center gap-2">
                            <h3>Yuk, kenalan dengan Converto</h3>
                            <span className="text-sm text-muted-foreground">yang telah ditenagai oleh Rofi</span>
                        </div>
                    </div>
                    <p className="text-muted-foreground max-sm:text-sm text-sm md:text-lg">
                        Alat konversi multimedia paling top yang bikin kamu bebas ngubah gambar, file audio, dan video 
                        dengan kebebasan tanpa batas, semua tanpa biaya sama sekali! Ucapkan selamat tinggal pada batasan, 
                        dan sambut kreativitas tanpa batas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    <div className="card-container">
                        <div className="card bg-blue-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Image weight="fill" className="w-10 h-10 text-blue-500" />
                                <h2 className="font-semibold text-xl">Image Conversion</h2>
                            </div>
                            <p className="text-gray-700">
                                Lepaskan kreativitasmu dengan alat konversi gambar kami. 
                                Ubah ukuran, potong, putar, atau konversi format seperti JPEG ke PNG dan lain-lain dengan mudah, 
                                bikin konten visualmu jadi lebih keren.
                            </p>
                        </div>
                    </div>

                    <div className="card-container">
                        <div className="card bg-green-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <MusicNoteSimple weight="fill" className="w-10 h-10 text-green-500" />
                                <h2 className="font-semibold text-xl">Audio Transformation</h2>
                            </div>
                            <p className="text-gray-700">
                                Tingkatkan kualitas audiomu! Konversi file audio ke berbagai format seperti MP3, WAV, atau AAC. 
                                Sesuaikan bitrates dan gabungkan file audio untuk menciptakan soundtrack yang sempurna.
                            </p>
                        </div>
                    </div>

                    <div className="card-container">
                        <div className="card bg-red-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <VinylRecord weight="fill" className="w-10 h-10 text-red-500" />
                                <h2 className="font-semibold text-xl">Video Metamorphosis</h2>
                            </div>
                            <p className="text-gray-700">
                                Lampu, kamera, and Action! Edit dan transkode video tanpa batas. 
                                Ubah format video, potong, dan gabungkan klip untuk menciptakan konten 
                                video yang menakjubkan untuk platform apa pun.
                            </p>
                        </div>
                    </div>

                    <div className="card-container">
                        <div
                            className="card bg-yellow-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Balloon weight="fill" className="w-10 h-10 text-yellow-500" />
                                <h2 className="font-semibold text-xl">Accessible Anywhere</h2>
                            </div>
                            <p className="text-gray-700">
                                Akses Converto dari manapun tapi tetap harus pakai internet ya🙏. Tapi terserah, mau pake komputer, tablet, atau smartphone sekalipun! Converto masih mudah terjangkau.
                            </p>
                        </div>
                    </div>

                    <div className="card-container">
                        <div className="card bg-purple-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <LockKeyOpen weight="fill" className="w-10 h-10 text-purple-500" />
                                <h2 className="font-semibold text-xl">Secure and Private</h2>
                            </div>
                            <p className="text-gray-700">
                                Tenang aja, file multimediamu akan diperlakukan dengan sangat hati-hati. 
                                Kami prioritaskan privasi dan keamanan datamu, 
                                tanpa database, kreasikan idemu.
                            </p>
                        </div>
                    </div>

                    <div className="card-container">
                        <div className="card bg-indigo-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <PersonSimpleCircle weight="fill" className="w-10 h-10 text-indigo-500" />
                                <h2 className="font-semibold text-xl">User-Friendly Interface</h2>
                            </div>
                            <p className="text-gray-700">
                                Antarmuka enak dipandang yang kami rancang memang khusus pemula dan ahli, bikin proses konversi jadi super gampang. Gak perlu pandai pandai banget!
                            </p>
                        </div>
                    </div>

                    <div className="card-container">
                        <div className="card bg-pink-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Upload weight="fill" className="w-10 h-10 text-pink-500" />
                                <h2 className="font-semibold text-xl">Constantly Evolving</h2>
                            </div>
                            <p className="text-gray-700">
                                Kami berkomitmen untuk selalu selangkah lebih maju. 
                                Tunggu saja update rutin dan fitur baru yang bakal bikin 
                                pengalaman multimediamu makin fresh dan seru.
                            </p>
                        </div>
                    </div>

                    <div className="card-container">
                        <div className="card bg-gray-100 text-slate-700 p-6 rounded-lg shadow-md h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <StarAndCrescent weight="fill" className="w-10 h-10 text-gray-500" />
                                <h2 className="font-semibold text-xl">Gratis, Kuat, & Converto</h2>
                            </div>
                            <p className="text-gray-700">
                                Rasakan kebebasan untuk mengonversi gambar, audio, dan video tanpa batas. 
                                Tingkatkan proyek multimediamu dengan potensi tanpa batas dari Converto.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default AboutPage