import Header from "@/components/Header";
import ImageGenerator from "@/components/ImageGenerator";

const ImageGeneratorPage = () => {
    return ( 
        <main className="flex flex-col items-center p-8">
            <Header 
                title="Image AI Generator"
                description="Create AI Art and turn your imaginations into reality with Imagine's 
                AI Art Generator and produce stunning visuals to cover up your artistic thoughts."
            />

            <ImageGenerator />
        </main>
    )
}
 
export default ImageGeneratorPage;