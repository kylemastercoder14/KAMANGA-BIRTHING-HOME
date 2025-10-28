"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Role, User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/ui/file-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createEmployee, updateEmployee } from "@/actions";
import { employeeSchema } from "@/validators/employee";

const EmployeeForm = ({ initialData }: { initialData: User | null }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role: initialData?.role || "STAFF",
      name: initialData?.name || "",
      username: initialData?.username || "",
      password: initialData?.password || "",
      image: initialData?.image || "",
      biodata: initialData?.biodata || "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof employeeSchema>) {
    try {
      let response;
      if (initialData) {
        response = await updateEmployee(initialData.id, values);
      } else {
        response = await createEmployee(values);
      }

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);
      router.push("/manage-employees");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="mt-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your username"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Role <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Profile Image{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    onImageUpload={(url: string) => field.onChange(url)}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Upload a profile image in .png, .jpg, .jpeg, or .webp format
                  with a resolution of at least 1000*1000 px. The file must not
                  be bigger than 2 MB.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="biodata"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Biodata{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    onImageUpload={(url: string) => field.onChange(url)}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                    className="w-full"
                    uploadType="file"
                  />
                </FormControl>
                <FormDescription>
                  Upload the biodata in .pdf, .docx, .png, or .jpeg format. The
                  file must not be bigger than 2 MB.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isSubmitting} type="submit">
            {initialData ? "Save Changes" : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmployeeForm;
