import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface CustomMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: MultiSelectOption[];
  loading?: boolean;
  disabled?: boolean;
}

export function CustomMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select options...",
  options = [],
  loading = false,
  disabled = false,
}: CustomMultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues = (field.value as string[]) || [];

        const handleUnselect = (itemValue: string) => {
          field.onChange(selectedValues.filter((v) => v !== itemValue));
        };

        const handleSelect = (itemValue: string) => {
          const isSelected = selectedValues.includes(itemValue);
          const nextValues = isSelected
            ? selectedValues.filter((v) => v !== itemValue)
            : [...selectedValues, itemValue];
          field.onChange(nextValues);
        };

        return (
          <Field data-invalid={fieldState.invalid} className="w-full">
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors",
                    disabled || loading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                  )}
                >
                  <div className="flex flex-wrap gap-1">
                    {selectedValues.length > 0 ? (
                      selectedValues.map((val) => {
                        const option = options.find((o) => o.value === val);
                        return (
                          <Badge
                            key={val}
                            variant="secondary"
                            className="flex items-center gap-1 pr-1.5"
                          >
                            {option?.label || val}
                            <button
                              type="button"
                              className="rounded-full outline-none hover:bg-muted p-0.5"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={() => handleUnselect(val)}
                              disabled={disabled || loading}
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">
                        {loading ? "Loading options..." : placeholder}
                      </span>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>

              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
              >
                <Command className="w-full">
                  <CommandInput placeholder="Search options..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto px-1">
                      {options.map((option) => {
                        const isSelected = selectedValues.includes(
                          option.value,
                        );
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => handleSelect(option.value)}
                            className="cursor-pointer"
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible",
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="flex-1">{option.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
