
const Command = ({ children, className, parentClassName }: { children: React.ReactNode, className?: string, parentClassName?: string }) => {
    return (
        <p className={"mb-[20px] " + parentClassName}><span className={"text-green font-bold md:text-[24px] text-[18px] " + className}>jackmechem@web</span> <span className={"text-blue font-bold md:text-[24px] text-[18px] " + className}>{" ~ -> "}</span><span className={"text-foreground-sec font-bold md:text-[24px] text-[18px] " + className}>{children}</span></p>
    )
}

export default Command;
