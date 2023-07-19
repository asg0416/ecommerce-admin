"use client";

import * as zod from "zod";
import { Fragment, useState } from "react";
import { Color } from "@prisma/client";
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
import ImageUpload from "@/components/ui/imageUpload";

interface ColorFormProps {
  initialData: Color | null;
}

// db store 컬럼 속성 name으로 지정해서 name 맞춰야함.
const formSchema = zod.object({
  name: zod.string().min(1),
  value: zod
    .string()
    .min(4)
    .regex(/^#/, { message: "String must be a valid hex code" }),
});

type ColorFormValues = zod.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const toastMsg = initialData ? "Color Updated." : "Color Created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", value: "" },
  });

  // color 생성, 수정 함수
  const onSubmitHandler = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Color deleted");
    } catch (error) {
      toast.error("Make sure you removed all product using this color first.");
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
            color="icon"
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
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="p-4 rounded-full border relative"
                        style={{
                          backgroundColor: field.value,
                        }}
                      >
                        <Input
                          type="color"
                          disabled={loading}
                          className=" w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>
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

export default ColorForm;
