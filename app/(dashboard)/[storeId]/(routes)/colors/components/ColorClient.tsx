"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Fragment } from "react";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/dataTable";
import ApiList from "@/components/ui/apiList";

interface ColorClientProps {
  data: ColorColumn[];
}

const ColorClient: React.FC<ColorClientProps> = ({
  data: colors,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage colors for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={colors} />
      <Heading title="API" description="API calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId"/>
    </Fragment>
  );
};

export default ColorClient;
