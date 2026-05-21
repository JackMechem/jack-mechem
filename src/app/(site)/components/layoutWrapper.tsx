const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full rounded-lg bg-primary text-foreground overflow-hidden flex flex-row">
      {children}
    </div>
  );
};

export default LayoutWrapper;
