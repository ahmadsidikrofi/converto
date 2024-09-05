import Header from "@/components/Header";
import SignatureDrawer from "@/components/SignatureDrawer";

const SignatureDrawerPage = () => {
    return ( 
        <main className="flex flex-col items-center p-10">
            <Header 
                title="Draw Your Signature"
                description="Draw with your finger on our online signature pad to create your digital signature for free. Use your IPhone, IPad, Android or any of your things to make your own signature."
            />
            <div className="mt-6 text-center lg:max-w-5xl lg:w-full">
                <SignatureDrawer />
            </div>
        </main>
    )
}
 
export default SignatureDrawerPage;