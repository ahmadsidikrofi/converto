'use client'
import { Warning } from "@phosphor-icons/react";

const PrivacyPolicy = () => {
    return ( 
        <main className="lg:px-28 py-16">
            <div className="container">
                <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-8">
                    <div className="flex gap-3">
                        <Warning weight="fill" className="w-7 h-7 md:h-9 md:w-9 text-red-600" />
                        <h3 className="text-gray-700 dark:text-white max-sm:text-xl sm:text-xl md:text-3xl font-bold mb-6">Effective Date: 30 Agustus 2024</h3>
                    </div>
                    <p className="text-muted-foreground max-sm:text-sm text-sm md:text-lg">
                        At Converto, we are committed to safeguarding your privacy. 
                        This Privacy Policy outlines our practices regarding the collection, use, 
                        and disclosure of personal information when you use our website and services. 
                        Please read this policy carefully to understand how we handle your data.
                    </p>
                </div>
            </div>
        </main>
    )
}
 
export default PrivacyPolicy;