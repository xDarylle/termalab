import { ModeToggle } from "@/components/toggle-theme";
import { ToggleMute } from "@/components/toggle-mute";
import { HomeButton } from "@/components/home-button";
import { CircleDollarSign } from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { StartGameDialog } from "@/components/start-game-dialog";

export const Layout = () => {
  const location = useLocation();

  return (
    <div className="w-screen h-dvh p-3 flex flex-col relative">
      <StartGameDialog />
      <div className="bg-pattern h-full w-full absolute top-0 left-0 -z-10 opacity-5 dark:opacity-5"></div>
      <div className="flex flex-row items-center  justify-between">
        <div className="flex flex-row items-center rounded-full bg-card gap-1 shadow border border-border justify-between px-2 h-9 text-white">
          <CircleDollarSign className="size-6 bg-secondary rounded-full p-1" />
          <span className="text-sm font-bold mx-1 text-secondary">100</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <HomeButton key={location.pathname}/>
          <ToggleMute />
          <ModeToggle />
        </div>
      </div>
      <Outlet /> 
    </div>
  );
};
