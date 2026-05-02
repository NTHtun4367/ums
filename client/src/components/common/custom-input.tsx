import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

interface CustomInputProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

function CustomInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled,
}: CustomInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              fieldState.invalid &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {fieldState.invalid && (
            <FieldError className="text-destructive text-xs mt-1">
              {fieldState.error?.message}
            </FieldError>
          )}
        </Field>
      )}
    />
  );
}

export default CustomInput;
