import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LayoutGrid, User as UserIcon, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/store/slices/userApi";
import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";
import { useGetClassesQuery } from "@/store/slices/classApi";
import { useGetSubjectsQuery } from "@/store/slices/subjectApi";

import { CustomSelect } from "../common/custom-select";
import { CustomMultiSelect } from "../common/custom-multiselect";
import CustomInput from "../common/custom-input";
import type { User, UserRole } from "@/types/type";
import { userFormSchema, type UserFormValues } from "@/schemas/user";

interface Props {
  initialData?: User | null;
  onSuccess?: () => void;
  role: UserRole;
}

const UniversalUserForm = ({ initialData, onSuccess, role }: Props) => {
  const isUpdate = !!initialData;
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "male",
      role: role,
      departmentId: "",
      teacherStatus: "lecturer",
      isHod: false,
      classId: undefined,
      rollNo: "",
      subjectIds: [],
      password: "",
      confirmPassword: "",
    },
  });

  // Watch departmentId to trigger re-fetches for classes/subjects
  const selectedDept = form.watch("departmentId");

  const { data: deptData, isLoading: loadingDepts } = useGetDepartmentsQuery({
    page: 1,
    limit: 100,
  });

  // Fetch classes ONLY if student AND department is selected
  const { data: classData, isFetching: loadingClasses } = useGetClassesQuery(
    { page: 1, limit: 100, departmentId: selectedDept },
    { skip: role !== "student" || !selectedDept },
  );

  // Fetch subjects ONLY if teacher AND department is selected
  const { data: subjectData, isFetching: loadingSubjects } =
    useGetSubjectsQuery(
      { page: 1, limit: 100, departmentId: selectedDept },
      { skip: role !== "teacher" || !selectedDept },
    );

  // Reset dependent fields when department changes
  useEffect(() => {
    if (!isUpdate) {
      form.setValue("classId", undefined);
      form.setValue("subjectIds", []);
    }
  }, [selectedDept, form, isUpdate]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        departmentId:
          typeof initialData.departmentId === "object"
            ? initialData.departmentId._id
            : initialData.departmentId,
        isHod: initialData.role === "hod",
        subjectIds:
          initialData.teacherSubjects?.map((s: any) => s._id || s) || [],
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: UserFormValues) {
    try {
      const payload: any = {
        ...data,
        role,
      };

      // Auto assign professor for HOD
      if (role === "hod") {
        payload.teacherStatus = "professor";
      }

      // Remove empty optional fields
      if (!payload.classId) delete payload.classId;
      if (!payload.departmentId) delete payload.departmentId;
      if (!payload.rollNo) delete payload.rollNo;

      if (!data.password) delete payload.password;

      delete payload.confirmPassword;

      if (isUpdate) {
        await updateUser({ id: initialData._id, data: payload }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createUser(payload).unwrap();
        toast.success("User created successfully");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Operation failed");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
          <UserIcon size={16} />
          <span>Personal Information</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Jane Doe"
          />
          <CustomSelect
            control={form.control}
            name="gender"
            label="Gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
          <CustomInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="jane@university.edu"
          />
          <CustomInput
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="+1 234..."
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
          <LayoutGrid size={16} />
          <span>Academic Assignment</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            control={form.control}
            name="departmentId"
            label="Department"
            loading={loadingDepts}
            options={
              deptData?.departments?.map((d: any) => ({
                label: d.name,
                value: d._id,
              })) || []
            }
          />

          {role === "student" && (
            <>
              <CustomSelect
                control={form.control}
                name="classId"
                label={selectedDept ? "Class" : "Select Department First"}
                loading={loadingClasses}
                disabled={!selectedDept}
                options={
                  classData?.classes?.map((c: any) => ({
                    label: c.name,
                    value: c._id,
                  })) || []
                }
              />
              <CustomInput
                control={form.control}
                name="rollNo"
                label="Roll Number"
                placeholder="A-101"
              />
            </>
          )}

          {role === "teacher" && (
            <CustomSelect
              control={form.control}
              name="teacherStatus"
              label="Teacher Rank"
              options={[
                { label: "Professor", value: "professor" },
                { label: "Assistant Professor", value: "assistant_professor" },
                { label: "Lecturer", value: "lecturer" },
                { label: "Tutor", value: "tutor" },
              ]}
            />
          )}
        </div>

        {role === "teacher" && (
          <div className="space-y-4">
            <CustomMultiSelect
              control={form.control}
              name="subjectIds"
              label={
                selectedDept ? "Teaching Subjects" : "Select Department First"
              }
              loading={loadingSubjects}
              disabled={!selectedDept}
              options={
                subjectData?.subjects?.map((s: any) => ({
                  label: s.name,
                  value: s._id,
                })) || []
              }
            />
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
          <ShieldCheck size={16} />
          <span>Security & Access</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="********"
          />
          <CustomInput
            control={form.control}
            name="confirmPassword"
            label="Confirm"
            type="password"
            placeholder="********"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? "Processing..."
          : isUpdate
            ? "Save Changes"
            : "Create User"}
      </Button>
    </form>
  );
};

export default UniversalUserForm;
