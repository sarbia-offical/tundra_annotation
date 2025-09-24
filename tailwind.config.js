module.exports = {
  darkMode: ["class"],
  content: ["./components/**/*.{ts,tsx}", "./entrypoints/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        flipIn: {
          "0%": { transform: "rotateY(-90deg)", opacity: "0" },
          "100%": { transform: "rotateY(0)", opacity: "1" },
        },
        shake: {
          "0%": { transform: "translateX(0)" },
          "10%": { transform: "translateX(-15px)" },
          "20%": { transform: "translateX(15px)" },
          "30%": { transform: "translateX(-12px)" },
          "40%": { transform: "translateX(12px)" },
          "50%": { transform: "translateX(-9px)" },
          "60%": { transform: "translateX(9px)" },
          "70%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(6px)" },
          "90%": { transform: "translateX(-3px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        scaleIn: "scaleIn 0.2s ease-out",
        slideInDown: "slideInDown 0.3s ease-out",
        fadeIn: "fadeIn 0.2s ease-in",
        shake: "shake 1s ease-out forwards",
        flipIn: "flipIn 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
