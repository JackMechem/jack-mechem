export const LandButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center text-center text-foreground cursor-pointer px-[35px] py-[10px] bg-primary border-[2px] border-green drop-shadow-bluemd hover:drop-shadow-none rounded-[15px] w-fit">
      <h3>{children}</h3>
    </div>
  );
};
