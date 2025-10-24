"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import clsx from "clsx";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioColorProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  itemClassName?: string;
}

const RadioColor: React.FC<RadioColorProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  className,
  itemClassName,
}) => {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      defaultValue={defaultValue ?? options[0]?.value}
      onValueChange={onChange}
      className={clsx("flex items-center flex-wrap gap-3", className)}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className={clsx(
            "ring-[1px] ring-border size-10 rounded-full cursor-pointer",
            "data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500",
            itemClassName,
            `bg-${option.value}-200`
          )}
        ></RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
};

export default RadioColor;
