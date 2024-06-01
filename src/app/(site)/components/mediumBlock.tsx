const MediumBlock = ({
  children,
  className,
  parentClassName,
}: {
  children: React.ReactNode;
  className: string;
  parentClassName?: string;
}) => {
  return (
    <div
      className={
        "lg:py-[100px] py-[50px] lg:px-[50px] px-[25px] flex justify-center" +
        " " +
        parentClassName
      }
    >
      <div className={"lg:w-full lg:max-w-[1000px] w-full" + " " + className}>
        {children}
      </div>
    </div>
  );
};

export default MediumBlock;
