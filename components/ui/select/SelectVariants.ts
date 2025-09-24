import { cva } from "class-variance-authority";

const selectVariants = cva("transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: " border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export { selectVariants };
