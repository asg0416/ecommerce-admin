"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/dataTable";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data: orders }) => {
  return (
    <Fragment>
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={orders} />
    </Fragment>
  );
};

export default OrderClient;
