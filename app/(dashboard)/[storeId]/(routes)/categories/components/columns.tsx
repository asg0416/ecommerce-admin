"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel",
    // accessorKey: "billboard",
    header: "Billboard",
    cell: ({row}) => row.original.billboardLabel
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",

    //react-table 기능이고 행의 original 데이터인 CategoryColumn를 가져옴
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
