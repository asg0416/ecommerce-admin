import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import useUserCheck from "@/hooks/useUserCheck";
import useStoreState from "@/hooks/useStoreState";

interface LayoutProps {
  children: React.ReactNode;
  params: { storeId: string };
}

const DashboardLayout = async ({ children, params }: LayoutProps) => {
  await useStoreState(params.storeId);

  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default DashboardLayout;
