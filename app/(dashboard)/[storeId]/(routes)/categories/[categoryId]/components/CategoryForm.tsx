"use client";

import * as zod from "zod";
import { Fragment, useState } from "react";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/AlertModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

// db store 컬럼 속성 name으로 지정해서 name 맞춰야함.
const formSchema = zod.object({
  name: zod.string().min(1),
  billboardId: zod.string().min(1),
});

type CategoryFormValues = zod.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const toastMsg = initialData ? "Category Updated." : "Category Created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", billboardId: "" },
  });

  // category 생성, 수정 함수
  const onSubmitHandler = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success(toastMsg);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteHandler = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all product using this category first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteHandler}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className=" h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className=" space-y-8 w-full"
        >
          <div className=" grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value || undefined}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className=" ml-auto " type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </Fragment>
  );
};

export default CategoryForm;
