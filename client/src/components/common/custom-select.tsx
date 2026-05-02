import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  loading?: boolean;
}

export function CustomSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select...",
  options,
  disabled,
  loading = false,
}: CustomSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || undefined}
            disabled={disabled || loading}
          >
            <SelectTrigger id={name} className="w-full">
              <SelectValue placeholder={loading ? "Loading..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 && !loading ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
