"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { noteSchema } from "@/validators/note";
import { Notes, TemplateType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TagsInput } from "@/components/ui/tags-input";
import RadioColor from "@/components/ui/radio-color";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNote, updateNote } from "@/actions";
import { colorOptions } from '@/constants';

const NotesForm = ({
  initialData,
  onClose,
  userId,
}: {
  initialData: Notes | null;
  onClose: () => void;
  userId: string;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      template: initialData?.template || "BLANK_NOTE",
      content: initialData?.content || "",
      tags: initialData?.tags || [],
      color: initialData?.color || "yellow",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof noteSchema>) {
    try {
      let response;
      if (initialData) {
        response = await updateNote(initialData.id, values, userId);
      } else {
        response = await createNote(values, userId);
      }

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);
      router.refresh();
      onClose();
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
            name="template"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Template <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(TemplateType).map((template) => (
                      <SelectItem key={template} value={template}>
                        {template
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    disabled={isSubmitting}
                    onChangeAction={field.onChange}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagsInput
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value || []}
                    placeholder="Enter any keywords (e.g. work, personal, check-up, family planning, free medicine)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <RadioColor
                    options={colorOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
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

export default NotesForm;
