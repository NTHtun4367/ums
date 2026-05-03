import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
} from "@/store/slices/academicYearApi";
import type { AcademicYear } from "@/types/type";
import {
  academicYearFormSchema,
  type AcademicYearFormValues,
} from "@/schemas/academic-year";
import CustomInput from "../common/custom-input";
import CustomModal from "../common/custom-modal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: AcademicYear | null;
}

function AcademicYearForm({ open, onOpenChange, initialData }: Props) {
  const [createYear, { isLoading: isCreating }] =
    useCreateAcademicYearMutation();
  const [updateYear, { isLoading: isUpdating }] =
    useUpdateAcademicYearMutation();

  const form = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: {
      name: "",
      isCurrent: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          fromYear: new Date(initialData.fromYear),
          toYear: new Date(initialData.toYear),
          isCurrent: initialData.isCurrent,
        });
      } else {
        form.reset({
          name: "",
          fromYear: undefined,
          toYear: undefined,
          isCurrent: false,
        });
      }
    }
  }, [initialData, form, open]);

  const onSubmit = async (data: AcademicYearFormValues) => {
    try {
      if (initialData) {
        await updateYear({ id: initialData._id, data }).unwrap();
        toast.success("Academic year updated");
      } else {
        await createYear(data).unwrap();
        toast.success("Academic year created");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to save academic year");
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <CustomModal
      open={open}
      setOpen={onOpenChange}
      title={initialData ? "Edit Year" : "New Academic Year"}
      description="Set the duration for this session."
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-6">
          {/* Year Name Input */}
          <CustomInput
            control={form.control}
            name="name"
            label="Year Name"
            placeholder="e.g. 2026-2027"
            disabled={isPending}
          />

          {/* Date Pickers Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="fromYear"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Start Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={isPending}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError className="text-destructive text-xs">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="toYear"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>End Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={isPending}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          !!form.getValues("fromYear") &&
                          date < form.getValues("fromYear")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError className="text-destructive text-xs">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Checkbox Section */}
          <Controller
            name="isCurrent"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                <Checkbox
                  id="isCurrent"
                  checked={value}
                  onCheckedChange={onChange}
                  disabled={isPending}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="isCurrent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Set as Active
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Automatically deactivates others.
                  </p>
                </div>
              </div>
            )}
          />
        </FieldGroup>

        <Button type="submit" disabled={isPending} className="w-full mt-6">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </CustomModal>
  );
}

export default AcademicYearForm;
