import {
  SidebarProvider,
  FloatingSidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/app/api/auth/[...nextauth]/options";
import UserProfile from "@/components/auth/userProfile";
import AppSideBar from "./dashboard/app-sidebar";

type Props = {
  children: React.ReactNode;
};

const SideBarLayout = async ({ children }: Props) => {
  const session = await auth();

  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="w-full m-2">
        <div className="flex items-center gap-2 border-sidebar bg-sidebar border shadow rounded-md p-2 px-4">
          {/* <SearchBar/> */}
          <div className="ml-auto">
            <UserProfile userDetails={session?.user} />
          </div>
        </div>
        <div className="h-4"> </div>
        <div className="border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100dvh-5.5rem)] p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </main>
      <FloatingSidebarTrigger />
    </SidebarProvider>
  );
};

export default SideBarLayout;
