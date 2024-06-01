
const Separator = ({ horizontal, className }: { horizontal?: boolean, className?: string }) => {
    return (
        <div className={"lg:my-0 lg:mx-auto mx-0 flex lg:flex-col flex-row self-stretch " + className}><div className="lg:h-1/2 lg:w-auto w-1/2 border-[2px] border-blue" /><div className="lg:h-1/2 lg:w-auto w-1/2 border-[2px] border-foreground" /></div>
    )
}

export default Separator;
