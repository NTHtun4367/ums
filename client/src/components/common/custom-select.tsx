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

// 1. Define separate props for the "Stand-alone" version (used in Filters)
interface StandardSelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

// 2. Define props for the "Hook Form" version
interface FormSelectProps<T extends FieldValues> extends StandardSelectProps {
  control: Control<T>;
  name: Path<T>;
}

export function CustomSelect<T extends FieldValues>(
  props: StandardSelectProps | FormSelectProps<T>,
) {
  const {
    label,
    options,
    placeholder = "Select...",
    disabled,
    loading = false,
  } = props;

  // Render logic for when used with React Hook Form
  if ("control" in props && "name" in props) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="w-full">
            <FieldLabel htmlFor={props.name}>{label}</FieldLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              disabled={disabled || loading}
            >
              <SelectTrigger id={props.name} className="w-full">
                <SelectValue
                  placeholder={loading ? "Loading..." : placeholder}
                />
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

  // Render logic for standard use (Filters)
  return (
    <Field className="w-full">
      <FieldLabel>{label}</FieldLabel>
      <Select
        onValueChange={props.onChange}
        value={props.value || ""}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full">
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
    </Field>
  );
}
