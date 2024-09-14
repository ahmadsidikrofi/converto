'use client'
import SignatureCanvas from "react-signature-canvas"
import { Button } from "./ui/button"
import { useState } from "react"
import SignatureResult from "./SignatureResult"
const SignatureDrawer = () => {
    const [sign, setSign] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true)
    const [isBGTransparent, setIsBGTransparent] = useState(true)
    const colors = {
        bgColors: ["bg-black", "bg-red-500", "bg-sky-300", "bg-indigo-700", "bg-emerald-700"],
        penColor: ["black", "rgb(239 68 68)", "rgb(125 211 252)", "rgb(79 70 229)", "rgb(4 120 87)"]
    }
    const selectedPenColor = colors.penColor[colors.bgColors.indexOf(selectedColor)]
    const handleClearCanvas = () => {
        sign.clear()
        setSign(null)
        setIsCanvasEmpty(true)
    }
    const handleEndDrawing = () => {
        setIsCanvasEmpty(false)
    }
    return ( 
        <div>
            <div className="flex max-sm:flex-col gap-3 h-[250px] sm:w-[600px] sm:h-[230px] mx-auto">
                <div className="hidden max-sm:flex gap-3 justify-center">
                    {colors.bgColors.map((bgColor, i) => (
                        <div key={i}>
                            <Button className={`rounded-full h-8 w-8 shrink-0 ${bgColor} hover:scale-75 transition-all ease-linear duration-75
                                ${selectedColor === bgColor ? 'border-4 border-sky-400' : null}
                            `}
                                onClick={() => setSelectedColor(bgColor)}
                            ></Button>
                        </div>
                    ))}
                </div>
                <SignatureCanvas penColor={selectedPenColor} clearOnResize={false} ref={(ref) => setSign(ref)} onEnd={handleEndDrawing}
                    canvasProps={{ className: 'sigCanvas mx-auto w-[350px] h-[250px] sm:w-[600px] sm:h-[230px] rounded-xl border shadow-lg hover:border-red-500 transition-all ease-linear'}}
                />
                <div className="hidden sm:flex flex-col gap-3">
                    {colors.bgColors.map((bgColor, i) => (
                        <div key={i}>
                            <Button onClick={() => setSelectedColor(bgColor)} className={`rounded-full h-8 w-8 shrink-0 ${bgColor} hover:scale-75 transition-all ease-linear duration-75 ${selectedColor === bgColor ? 'border-4 border-sky-200' : ''}`}></Button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="sm:mt-3 max-sm:mt-14 mx-auto">
                <Button onClick={handleClearCanvas} variant="outline" className="rounded-full mx-6 max-sm:text-sm text-lg ">Clear</Button>
                <SignatureResult setSign={setSign} sign={sign} isCanvasEmpty={isCanvasEmpty} isBGTransparent={isBGTransparent} setIsBGTransparent={setIsBGTransparent}/>
            </div>
        </div>
    )
}
 
export default SignatureDrawer