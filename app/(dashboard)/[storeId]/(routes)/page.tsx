import { getSalesCount } from "@/action/getSalesCount";
import { getStockCount } from "@/action/getStockCount";
import { getTotalRevenue } from "@/action/getTotalRevenue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Overview from "@/components/Overview";

import { formatter } from "@/lib/utils";

import { CreditCard, DollarSign, Package } from "lucide-react";
import { getGraphRevenue } from "@/action/getGraphRevenue";

interface DashboardProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId); // 총 수익
  const sales = await getSalesCount(params.storeId); // 판매량
  const stock = await getStockCount(params.storeId); // 재고
  const graphRevenue = await getGraphRevenue(params.storeId); //월별 총 수익

  const cardInfo = [
    {
      title: "Total Revenue",
      icon: DollarSign,
      content: formatter.format(totalRevenue),
    },
    {
      title: "Sales",
      icon: CreditCard,
      content: `+${sales}`,
    },
    {
      title: "Products In Stock",
      icon: Package,
      content: stock,
    },
  ];
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          {cardInfo.map((info) => (
            <Card key={info.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {info.title}
                </CardTitle>
                <info.icon className=" h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{info.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className=" col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
