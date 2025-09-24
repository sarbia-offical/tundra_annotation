import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const AppHeader = ({ className, children }: HeaderProps) => {
  const version = process.env.APP_VERSION;
  console.log("version", version);

  return (
    <div className="text-foreground">
      <h1 className={cn("text-lg text-center", className)}>
        Tundra annotation
      </h1>
      <div className="text-sm text-center">v.{version}</div>
      {children ? children : <></>}
    </div>
  );
};

AppHeader.displayName = "AppHeader";

export default AppHeader;
