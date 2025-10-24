/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "@/validators/profile";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/globals/date-picker";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/kibo-ui/tags";
import { Input } from "@/components/ui/input";
import {
  Choicebox,
  ChoiceboxIndicator,
  ChoiceboxItem,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "@/components/kibo-ui/choicebox";
import { CheckIcon, PlusIcon } from "lucide-react";

const defaultVegetables = [
  { id: "tomatoes", label: "Tomatoes" },
  { id: "lettuce", label: "Lettuce" },
  { id: "onions", label: "Onions" },
  { id: "chili", label: "Chili" },
  { id: "potatoes", label: "Potatoes" },
  { id: "garlic", label: "Garlic" },
  { id: "ginger", label: "Ginger" },
  { id: "carrots", label: "Carrots" },
  { id: "ampalaya", label: "Ampalaya" },
  { id: "beans", label: "Beans" },
  { id: "spinach", label: "Spinach" },
  { id: "pechay", label: "Pechay" },
  { id: "squash", label: "Squash" },
  { id: "eggplant", label: "Eggplant" },
];

const defaultAnimals = [
  { id: "dogs", label: "Dogs" },
  { id: "cats", label: "Cats" },
  { id: "chicken", label: "Chicken" },
  { id: "pig", label: "Pig" },
  { id: "fish", label: "Fish" },
  { id: "bird", label: "Bird" },
  { id: "cow", label: "Cow" },
  { id: "goat", label: "Goat" },
  { id: "duck", label: "Duck" },
  { id: "bee", label: "Bee" },
  { id: "carabao", label: "Carabao" },
  { id: "chicks", label: "Chicks" },
  { id: "squirrel", label: "Squirrel" },
  { id: "rabbit", label: "Rabbit" },
];

const sanitizedToilet = [
  {
    id: "solo",
    label: "Solo",
  },
  {
    id: "shared",
    label: "Shared",
  },
  {
    id: "none",
    label: "None",
  },
];

const HealthDetails = ({ form }: { form: UseFormReturn<ProfileFormData> }) => {
  const { isSubmitting } = form.formState;

  // ✅ Separate tag states
  const [vegetableTags, setVegetableTags] = useState(defaultVegetables);
  const [newVegetable, setNewVegetable] = useState("");

  const [animalTags, setAnimalTags] = useState(defaultAnimals);
  const [newAnimal, setNewAnimal] = useState("");

  const handleCreateTag = (
    newTag: string,
    setTags: React.Dispatch<
      React.SetStateAction<{ id: string; label: string }[]>
    >,
    field: any,
    clearInput: () => void
  ) => {
    if (!newTag.trim()) return;
    setTags((prev) => [...prev, { id: newTag, label: newTag }]);
    field.onChange([...(field.value || []), newTag]);
    clearInput();
  };

  const handleSelect = (value: string, field: any) => {
    const currentValues = field.value || [];
    if (currentValues.includes(value)) {
      field.onChange(currentValues.filter((v: string) => v !== value));
    } else {
      field.onChange([...currentValues, value]);
    }
  };

  return (
    <div>
      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="marriedCouple"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Married Couple of Reproductive Age{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Enter married couple of reproductive age using family method"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sanitizedToilet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sanitized Toilet <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Choicebox
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    style={{
                      gridTemplateColumns: `repeat(${sanitizedToilet.length}, 1fr)`,
                    }}
                  >
                    {sanitizedToilet.map((option) => (
                      <ChoiceboxItem
                        className="border-input"
                        key={option.id}
                        value={option.id}
                      >
                        <ChoiceboxItemHeader>
                          <ChoiceboxItemTitle>
                            {option.label}
                          </ChoiceboxItemTitle>
                        </ChoiceboxItemHeader>
                        <ChoiceboxIndicator />
                      </ChoiceboxItem>
                    ))}
                  </Choicebox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(form.watch("sanitizedToilet") === "shared" ||
            form.watch("sanitizedToilet") === "solo") && (
            <FormField
              control={form.control}
              name="constructedDateToilet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Constructed Date <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={(val) => {
                        const date = val ? new Date(val) : undefined;
                        field.onChange(date);
                      }}
                      placeholder="Select constructed date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="presumptiveTubercolosis"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex border border-input p-3 rounded-md items-center justify-between">
                      <div>
                        <div className="font-medium">
                          Presumptive Tubercolosis
                        </div>
                        <div className="text-sm text-gray-500">
                          Do you have presumptive tubercolosis?
                        </div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="broughtToFacility"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex border p-3 border-input rounded-md items-center justify-between">
                      <div>
                        <div className="font-medium">Brought to Facility</div>
                        <div className="text-sm text-gray-500">
                          Brought to facility for sputum exam?
                        </div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="dwellingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type of Dwelling Units{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="What type of dwelling units you have?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waterSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Source of Water{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="What source of water you have?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="vegetables"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Food Production Activities (Vegetables){" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Tags className="w-full">
                      <TagsTrigger>
                        {(field.value || []).map((tag: string) => (
                          <TagsValue
                            key={tag}
                            onRemove={() =>
                              field.onChange(
                                (field.value || []).filter(
                                  (v: string) => v !== tag
                                )
                              )
                            }
                          >
                            {vegetableTags.find((t) => t.id === tag)?.label ||
                              tag}
                          </TagsValue>
                        ))}
                      </TagsTrigger>
                      <TagsContent>
                        <TagsInput
                          value={newVegetable}
                          onValueChange={setNewVegetable}
                          placeholder="Search or create vegetable tag..."
                        />
                        <TagsList>
                          <TagsEmpty>
                            <button
                              type="button"
                              onClick={() =>
                                handleCreateTag(
                                  newVegetable,
                                  setVegetableTags,
                                  field,
                                  () => setNewVegetable("")
                                )
                              }
                              className="mx-auto flex cursor-pointer items-center gap-2"
                            >
                              <PlusIcon
                                className="text-muted-foreground"
                                size={14}
                              />
                              Create new tag: {newVegetable}
                            </button>
                          </TagsEmpty>
                          <TagsGroup>
                            {vegetableTags.map((tag) => (
                              <TagsItem
                                key={tag.id}
                                value={tag.id}
                                onSelect={() => handleSelect(tag.id, field)}
                              >
                                {tag.label}
                                {(field.value || []).includes(tag.id) && (
                                  <CheckIcon
                                    className="text-muted-foreground"
                                    size={14}
                                  />
                                )}
                              </TagsItem>
                            ))}
                          </TagsGroup>
                        </TagsList>
                      </TagsContent>
                    </Tags>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Animals Tags Field */}
            <FormField
              control={form.control}
              name="animals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Food Production Activities (Animals){" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Tags className="w-full">
                      <TagsTrigger>
                        {(field.value || []).map((tag: string) => (
                          <TagsValue
                            key={tag}
                            onRemove={() =>
                              field.onChange(
                                (field.value || []).filter(
                                  (v: string) => v !== tag
                                )
                              )
                            }
                          >
                            {animalTags.find((t) => t.id === tag)?.label || tag}
                          </TagsValue>
                        ))}
                      </TagsTrigger>
                      <TagsContent>
                        <TagsInput
                          value={newAnimal}
                          onValueChange={setNewAnimal}
                          placeholder="Search or create animal tag..."
                        />
                        <TagsList>
                          <TagsEmpty>
                            <button
                              type="button"
                              onClick={() =>
                                handleCreateTag(
                                  newAnimal,
                                  setAnimalTags,
                                  field,
                                  () => setNewAnimal("")
                                )
                              }
                              className="mx-auto flex cursor-pointer items-center gap-2"
                            >
                              <PlusIcon
                                className="text-muted-foreground"
                                size={14}
                              />
                              Create new tag: {newAnimal}
                            </button>
                          </TagsEmpty>
                          <TagsGroup>
                            {animalTags.map((tag) => (
                              <TagsItem
                                key={tag.id}
                                value={tag.id}
                                onSelect={() => handleSelect(tag.id, field)}
                              >
                                {tag.label}
                                {(field.value || []).includes(tag.id) && (
                                  <CheckIcon
                                    className="text-muted-foreground"
                                    size={14}
                                  />
                                )}
                              </TagsItem>
                            ))}
                          </TagsGroup>
                        </TagsList>
                      </TagsContent>
                    </Tags>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="bingeDrinker"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex border border-input p-3 rounded-md items-center justify-between">
                      <div>
                        <div className="font-medium">Binge Drinker</div>
                        <div className="text-sm text-gray-500">
                          Are you a binge drinker?
                        </div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smoker"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex border p-3 border-input rounded-md items-center justify-between">
                      <div>
                        <div className="font-medium">Smoker</div>
                        <div className="text-sm text-gray-500">
                          Do you smoke?
                        </div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="garbageDisposal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Garbage Disposal{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder="How do you dispose your garbage?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="hypertension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Hypertension{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Please specify..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diabetes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Diabetes Mellitus{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Please specify..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bothSickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Both{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="If both, please explain..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="oscaNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    OSCA Number{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter OSCA number if any"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pwdInformation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PWD Information{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter PWD information if any"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default HealthDetails;
