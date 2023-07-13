"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",

    //react-table 기능이고 행의 original 데이터인 BillboardColumn를 가져옴
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
