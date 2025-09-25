import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const switchVariants = cva(
  cn(
    "border relative w-full flex h-9 cursor-pointer items-center justify-center",
    "rounded-full px-3 text-xs font-medium transition-colors",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "transition-all duration-500 ease-in-out"
  ),
  {
    variants: {
      variant: {
        default:
          "text-primary data-[checked]:text-primary-foreground data-[checked]:bg-primary",
        secondary:
          "text-primary data-[checked]:text-primary-foreground data-[checked]:bg-muted-foreground",
        destructive:
          "text-primary data-[checked]:text-primary-foreground data-[checked]:bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
export { switchVariants };
