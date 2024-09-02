const Header = ({ title, description }) => {
    return ( 
        <div className="relative flex flex-col place-items-center gap-5">
            <h1 className="md:text-5xl sm:text-4xl max-sm:text-2xl text-nowrap font-semibold text-[#e5322d]">{title}</h1>
            <p className="text-center md:break-words text-lg max-sm:text-sm text-slate-500 md:w-[60%]">
                {description}
            </p>
        </div>
    )
}
 
export default Header;