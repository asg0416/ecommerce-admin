"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { BillboardColumn } from "./columns";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import axios from "axios";
import AlertModal from "@/components/modals/AlertModal";

interface CellActionProps {
  data: BillboardColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopyHandler = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard Id copied to the clipboard.");
  };

  const onDeleteHandler = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${data.id}`
      );
      router.refresh();
      toast.success("Billboard deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const actionBtn = [
    {
      id: "copy",
      component: Copy,
      onClick: () => onCopyHandler(data.id),
      label: "Copy Id",
    },
    {
      id: "edit",
      component: Edit,
      onClick: () => router.push(`/${params.storeId}/billboards/${data.id}`),
      label: "Update",
    },
    {
      id: "delete",
      component: Trash,
      onClick: () => setOpen(true),
      label: "Delete",
      class: "text-red-700 focus:text-red-700"
    },
  ];

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteHandler}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className=" h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className=" h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {actionBtn.map((info) => {
            return (
              <DropdownMenuItem key={info.id} onClick={info.onClick} className={info.class}>
                <info.component className="mr-2 h-4 w-4" />
                {info.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};

export default CellAction;
