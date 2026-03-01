import { ModeToggle } from "@/components/toggle-theme";
import { ToggleMute } from "@/components/toggle-mute";
import { HomeButton } from "@/components/home-button";
import { CircleDollarSign } from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { StartGameDialog } from "@/components/start-game-dialog";
import { useCoins } from "@/hooks/useCoins";

export const Layout = () => {
  const location = useLocation();
  const { count } = useCoins();

  return (
    <div className="w-screen h-dvh p-2 sm:p-3 flex flex-col relative overflow-hidden">
      <StartGameDialog />
      <div className="bg-pattern h-full w-full absolute top-0 left-0 -z-10 opacity-5 dark:opacity-5"></div>
      <div className="flex flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex flex-row items-center rounded-full bg-card gap-1 text-secondary shadow border border-border justify-between px-2 h-8 sm:h-9">
          <CircleDollarSign className="size-5 sm:size-6 bg-secondary text-white rounded-full p-0.5 sm:p-1" />
          <span className="text-xs sm:text-sm font-bold mx-1">{count}</span>
        </div>
        <div className="flex flex-row items-center gap-1 sm:gap-2">
          <HomeButton key={location.pathname} />
          <ToggleMute />
          <ModeToggle />
        </div>
      </div>
      <div className="flex-1 flex min-h-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
