'use client';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
        key={theme}
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark")
      }}
      className="flex items-center gap-2"
      suppressHydrationWarning
    >
      {theme === "dark" ? (
        <>
          <SunIcon className="w-5 h-5" />
        </>
      ) : (
        <>
          <MoonIcon className="w-5 h-5" />
        </>
      )}
    </Button>
  );
};

export default ThemeToggleButton;
