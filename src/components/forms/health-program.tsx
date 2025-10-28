"use client";

import React, { useState } from "react";
import { HealthProgramWithSections } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { healthProgramSchema } from "@/validators/health-program";
import { extractYouTubeID, fetchYouTubeDuration } from "@/lib/extract-yt-links";
import { toast } from "sonner";
import { createProgram, updateProgram } from "@/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TagsInput } from "@/components/ui/tags-input";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import FileUpload from "@/components/ui/file-upload";

const HealthProgramForm = ({
  initialData,
}: {
  initialData: HealthProgramWithSections | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof healthProgramSchema>>({
    resolver: zodResolver(healthProgramSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      thumbnailUrl: initialData?.thumbnailUrl || "",
      instructor: initialData?.instructor || "",
      instructorDescription: initialData?.instructorDescription || "",
      tags: initialData?.tags || [],
      sections:
        initialData?.sections?.map((section) => ({
          title: section.title ?? "",
          description: section.description ?? "",
          videoUrl: section.videoUrl ?? "",
          totalDuration: section.totalDuration ?? 0,
          order: section.order ?? 1,
        })) ?? [],
    },
  });

  const { control, handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const [videoSources, setVideoSources] = useState<Record<number, boolean>>({});

  const toggleVideoSource = (index: number, checked: boolean) => {
    setVideoSources((prev) => ({ ...prev, [index]: checked }));
  };

  async function onSubmit(values: z.infer<typeof healthProgramSchema>) {
    try {
      let response;
      if (initialData) {
        response = await updateProgram(initialData.id, values);
      } else {
        response = await createProgram(values);
      }

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);
      router.push("/health-programs");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* --- Basic Info --- */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    {...field}
                    placeholder="Enter title (e.g. Understanding Maternal Life)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-destructive">*</span>
                </FormLabel>
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
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tags <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <TagsInput
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value || []}
                    placeholder="Enter keywords (e.g. educational, health, family)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <FormField
              control={control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Instructor <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      {...field}
                      placeholder="Enter instructor name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="instructorDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Instructor Profile{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      {...field}
                      placeholder="Enter instructor profile"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Thumbnail <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    onImageUpload={(url: string) => field.onChange(url)}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Sections --- */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Program Sections</CardTitle>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    videoUrl: "",
                    totalDuration: 0,
                    order: fields.length + 1,
                  })
                }
              >
                + Add Section
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {fields.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No sections added yet.
                </p>
              )}

              <Accordion type="multiple" className="space-y-4">
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`section-${index}`}>
                    <AccordionTrigger className="flex justify-between items-center">
                      <span>
                        {form.watch(`sections.${index}.title`) ||
                          `Untitled Section ${index + 1}`}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 border rounded-md space-y-4">
                        <div className="flex justify-between items-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </div>

                        <FormField
                          control={control}
                          name={`sections.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Section title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`sections.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Section description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Switch: Video URL or Upload */}
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={videoSources[index] || false}
                            onCheckedChange={(checked) =>
                              toggleVideoSource(index, checked)
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            {videoSources[index]
                              ? "Upload from local file"
                              : "Use video URL (Internet source)"}
                          </span>
                        </div>

                        {videoSources[index] ? (
                          <FormField
                            control={control}
                            name={`sections.${index}.videoUrl`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Upload Video</FormLabel>
                                <FormControl>
                                  <FileUpload
                                    uploadType="video"
                                    defaultValue={field.value}
                                    disabled={isSubmitting}
                                    onImageUpload={(url: string) => {
                                      field.onChange(url);
                                      // Create a hidden video element to read metadata
                                      const video =
                                        document.createElement("video");
                                      video.src = url;
                                      video.onloadedmetadata = () => {
                                        const durationMins = Math.ceil(
                                          video.duration / 60
                                        );
                                        form.setValue(
                                          `sections.${index}.totalDuration`,
                                          durationMins
                                        );
                                      };
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <FormField
                            control={control}
                            name={`sections.${index}.videoUrl`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Video URL</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter video URL (e.g. https://example.com/video.mp4)"
                                    onBlur={async (e) => {
                                      const url = e.target.value;
                                      field.onChange(url);

                                      const youtubeId = extractYouTubeID(url);
                                      if (youtubeId) {
                                        // YouTube video detected
                                        const durationMins =
                                          await fetchYouTubeDuration(youtubeId);
                                        if (durationMins) {
                                          form.setValue(
                                            `sections.${index}.totalDuration`,
                                            durationMins
                                          );
                                        }
                                      } else {
                                        // Regular video link — use <video> element to read metadata
                                        const video =
                                          document.createElement("video");
                                        video.crossOrigin = "anonymous";
                                        video.src = url;
                                        video.onloadedmetadata = () => {
                                          const durationMins = Math.ceil(
                                            video.duration / 60
                                          );
                                          form.setValue(
                                            `sections.${index}.totalDuration`,
                                            durationMins
                                          );
                                        };
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name={`sections.${index}.totalDuration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Total Duration (mins)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="Duration"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`sections.${index}.order`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Order</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="Section order"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* --- Submit --- */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Program"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HealthProgramForm;
