import React from "react";
import { Control } from "react-hook-form";
import { Category, Color, Size } from "@prisma/client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormValues } from "./ProductForm";

type Options = Category | Size | Color ;

interface SelectFormProps {
  control: Control<ProductFormValues>;
  loading: boolean;
  options: Options[];
  optionKey: string;
  name: "categoryId" | "colorId" | "sizeId";
  label: string;
  placeholder: string;
}

const SelectForm: React.FC<SelectFormProps> = ({
  control,
  loading,
  options,
  optionKey,
  name,
  label,
  placeholder,
}) => {
  const renderOption = (option: Options) => {
    if ("name" in option && optionKey === "name") return option.name;
    if ("value" in option && optionKey === "value") return option.value;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            disabled={loading}
            onValueChange={field.onChange}
            value={String(field.value) || undefined}
            defaultValue={String(field.value) || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  defaultValue={String(field.value) || undefined}
                  placeholder={placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {renderOption(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectForm;
