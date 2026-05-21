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
        "lg:py-[100px] py-[50px] lg:px-[80px] px-[30px] flex justify-center" +
        " " +
        parentClassName
      }
    >
      <div className={"w-full" + " " + className}>
        {children}
      </div>
    </div>
  );
};

export default MediumBlock;
