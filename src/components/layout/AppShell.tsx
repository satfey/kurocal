import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useData } from "../../context/DataContext";

export function AppShell() {
  const { loading } = useData();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <TopNav />
      <MobileHeader />
      <main className="max-w-[1160px] mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
