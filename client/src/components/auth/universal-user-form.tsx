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
import { CustomSelect } from "../common/custom-select";
import CustomInput from "../common/custom-input";
import type { Class, Department, User, UserRole } from "@/types/type";
import { userFormSchema, type UserFormValues } from "@/schemas/user";

interface Props {
  initialData?: User | null;
  onSuccess?: () => void;
  role: UserRole;
}

function UniversalUserForm({ initialData, onSuccess, role }: Props) {
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
      role,
      departmentId: "",
      teacherStatus: "lecturer",
      classId: "",
      rollNo: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch selected department to dynamically trigger class query
  const selectedDept = form.watch("departmentId");

  // Fetch all departments safely
  const { data: deptData, isLoading: loadingDepts } = useGetDepartmentsQuery({
    page: 1,
    limit: 100,
  });

  // Fetch classes conditionally based on selected department (only for students)
  const { data: classData, isFetching: loadingClasses } = useGetClassesQuery(
    {
      page: 1,
      limit: 100,
      departmentId: selectedDept,
    },
    {
      skip: role !== "student" || !selectedDept,
    },
  );

  // RESET CLASS ONLY WHEN A USER MANUALLY CHANGES THE DEPARTMENT (PREVENTS BROKEN EDIT INITIALIZATION)
  useEffect(() => {
    if (!isUpdate && selectedDept) {
      form.setValue("classId", "");
    }
  }, [selectedDept, isUpdate, form]);

  // SYSTEM DATA POPULATION MATRIX ON EDIT MODE
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        gender: (initialData.gender as any) || "male",
        role: initialData.role,
        departmentId:
          typeof initialData.departmentId === "object"
            ? (initialData.departmentId as Department)?._id || ""
            : (initialData.departmentId as string) || "",
        teacherStatus: initialData.teacherStatus || "lecturer",
        classId:
          typeof initialData.classId === "object"
            ? (initialData.classId as Class)?._id || ""
            : (initialData.classId as string) || "",
        rollNo: initialData.rollNo || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: UserFormValues) {
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        role,
      };

      // Password processing
      if (data.password) {
        payload.password = data.password;
      }

      // Department parsing rules
      if (role !== "admin") {
        payload.departmentId = data.departmentId || undefined;
      }

      // Teacher / HOD adjustments
      if (role === "teacher") {
        payload.teacherStatus = data.teacherStatus;
      }

      if (role === "hod") {
        payload.teacherStatus = "professor";
      }

      // Student assignment parameters
      if (role === "student") {
        payload.classId = data.classId || undefined;
        payload.rollNo = data.rollNo;
      }

      if (isUpdate) {
        await updateUser({
          id: initialData!._id,
          data: payload,
        }).unwrap();

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
      {/* PERSONAL INFO */}
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

      {/* ACADEMIC ASSIGNMENT */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
          <LayoutGrid size={16} />
          <span>Academic Assignment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {role !== "admin" && (
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
          )}

          {(role === "teacher" || role === "hod") && (
            <CustomSelect
              control={form.control}
              name="teacherStatus"
              label="Teacher Rank"
              disabled={role === "hod"}
              options={[
                { label: "Professor", value: "professor" },
                { label: "Assistant Professor", value: "assistant_professor" },
                { label: "Lecturer", value: "lecturer" },
                { label: "Tutor", value: "tutor" },
              ]}
            />
          )}

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
        </div>
      </div>

      <Separator />

      {/* SECURITY */}
      {!isUpdate && (
        <>
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
                label="Confirm Password"
                type="password"
                placeholder="********"
              />
            </div>
          </div>

          <Separator />
        </>
      )}

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
}

export default UniversalUserForm;
