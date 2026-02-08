import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      orbitron: ["Orbitron", "sans-serif"],
      "space-mono": ["Space Mono", "monospace"],
      sans: ["Space Mono", "monospace"],
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
        neon: {
          cyan: "hsl(var(--neon-cyan))",
          pink: "hsl(var(--neon-pink))",
          purple: "hsl(var(--neon-purple))",
          green: "hsl(var(--neon-green))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        neon: "0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3)",
        "neon-lg": "0 0 20px rgba(0, 255, 0, 0.6), 0 0 40px rgba(0, 255, 0, 0.4), 0 0 60px rgba(0, 255, 0, 0.2)",
        "neon-pink": "0 0 10px rgba(255, 0, 127, 0.5), 0 0 20px rgba(255, 0, 127, 0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "neon-glow": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.5)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "spin-slow": {
          "from": {
            transform: "rotate(0deg)",
          },
          "to": {
            transform: "rotate(360deg)",
          },
        },
        "flicker": {
          "0%, 18%, 22%, 25%, 54%, 56%, 100%": {
            opacity: "1",
          },
          "19%, 24%, 55%": {
            opacity: "0.4",
          },
        },
        "shuffle": {
          "0%, 100%": {
            transform: "translateX(0px) translateY(0px)",
          },
          "25%": {
            transform: "translateX(20px) translateY(-10px)",
          },
          "50%": {
            transform: "translateX(-20px) translateY(10px)",
          },
          "75%": {
            transform: "translateX(15px) translateY(-5px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-glow": "neon-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "flicker": "flicker 4s ease-in-out infinite",
        "shuffle": "shuffle 0.3s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
