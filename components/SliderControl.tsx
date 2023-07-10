"use client";
import * as Slider from "@radix-ui/react-slider";
import React from "react";

const SliderControl = ({
  value = 1,
  onChange,
}: {
  value?: number;
  onChange?: (value: number) => void;
}) => {
  const handleChange = (val: number[]) => onChange?.(val[0]);
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.1}
      aria-label="Volume">
      <Slider.Track className="relative grow rounded-full h-1 bg-neutral-600">
        <Slider.Range className="absolute bg-white rounded-full h-full" />
      </Slider.Track>
    </Slider.Root>
  );
};

export default SliderControl;
