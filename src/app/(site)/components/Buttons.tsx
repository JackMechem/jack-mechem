export const LandButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-center text-center text-foreground cursor-pointer px-[35px] py-[10px] bg-primary border-[2px] border-green drop-shadow-bluemd rounded-[15px] w-fit"
    >
      <h3>{children}</h3>
    </div>
  );
};
