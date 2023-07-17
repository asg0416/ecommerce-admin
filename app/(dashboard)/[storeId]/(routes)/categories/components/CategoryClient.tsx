"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Fragment } from "react";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/dataTable";
import ApiList from "@/components/ui/apiList";

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient: React.FC<CategoryClientProps> = ({
  data: categories,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={categories} />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId"/>
    </Fragment>
  );
};

export default CategoryClient;
