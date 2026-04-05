import { Info, Heart, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { HomeButton } from "./home-button";
import { ToggleMute } from "./toggle-mute";
import { AboutDialog } from "./about-dialog";
import { AcknowledgmentDialog } from "./acknowledgement-dialog";

export function MobileNav() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-row items-center gap-2">
      {/* 1. Essential Actions (Always Visible) */}
      <HomeButton />
      <ToggleMute />

      {/* 2. Navigation Drawer (New Items) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="h-max">
          <SheetHeader className="text-left">
            <SheetTitle className="text-primary uppercase tracking-wider">
              Menu
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-2 py-4 px-2">
            <AboutDialog>
              <Button variant="ghost" className="justify-start gap-3 h-12">
                <Info />
                About TERMALAB
              </Button>
            </AboutDialog>

            <AcknowledgmentDialog>
              <Button variant="ghost" className="justify-start gap-3 h-12">
                <Heart />
                Acknowledgements
              </Button>
            </AcknowledgmentDialog>

            <Separator className="my-4" />

            {/* Quick Theme Toggle inside Menu (Optional secondary access) */}
            <Button
              className="rounded-sm justify-between"
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              Dark Mode
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
