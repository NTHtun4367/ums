import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ClipboardCheck,
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomSelect } from "@/components/common/custom-select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common/page-header";

import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";
import { useGetClassesQuery } from "@/store/slices/classApi";
import { useGetSubjectsQuery } from "@/store/slices/subjectApi";
import { useGetUsersQuery } from "@/store/slices/userApi";
import {
  useMarkAttendanceMutation,
  useGetAttendanceByClassQuery,
} from "@/store/slices/attendanceApi";
import { useGetCurrentAcademicYearQuery } from "@/store/slices/academicYearApi";

import type { RootState } from "@/store";
import type {
  User,
  Department,
  AttendanceStatus,
  Attendance,
} from "@/types/type";

const ATTENDANCE_STATUSES: {
  label: string;
  value: AttendanceStatus;
  color: string;
  icon: any;
}[] = [
    {
      label: "Present",
      value: "present",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: CheckCircle2,
    },
    {
      label: "Absent",
      value: "absent",
      color: "text-red-600 bg-red-50 border-red-100",
      icon: XCircle,
    },
    {
      label: "Late",
      value: "late",
      color: "text-amber-600 bg-amber-50 border-amber-100",
      icon: Clock,
    },
    {
      label: "Excused",
      value: "excused",
      color: "text-blue-600 bg-blue-50 border-blue-100",
      icon: AlertCircle,
    },
  ];

export default function AttendancePage() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  // Filters
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [sessionNumber, setSessionNumber] = useState(1);

  // Attendance state
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});

  // API Queries
  const { data: deptData, isLoading: deptsLoading } = useGetDepartmentsQuery({
    page: 1,
    limit: 100,
  });
  const { data: currentAYData, isLoading: loadingCurrentAY } = useGetCurrentAcademicYearQuery();

  const { data: classData, isLoading: classesLoading } = useGetClassesQuery(
    { page: 1, limit: 100, departmentId: selectedDept },
    { skip: !selectedDept },
  );

  const { data: subjectData, isLoading: subjectsLoading } = useGetSubjectsQuery(
    { page: 1, limit: 100, departmentId: selectedDept, classId: selectedClass },
    { skip: !selectedDept || !selectedClass },
  );

  const { data: studentData, isLoading: studentsLoading } = useGetUsersQuery(
    { page: 1, limit: 100, role: "student", classId: selectedClass },
    { skip: !selectedClass },
  );

  const { data: existingAttendance, isFetching: loadingAttendance } =
    useGetAttendanceByClassQuery(
      {
        classId: selectedClass,
        attendanceDate: format(date, "yyyy-MM-dd"),
        subjectId: selectedSubject,
        sessionNumber,
      },
      { skip: !selectedClass || !selectedSubject },
    );

  const [markAttendance, { isLoading: isSaving }] = useMarkAttendanceMutation();

  // HOD auto-lock department
  useEffect(() => {
    if (userInfo?.role === "hod" && userInfo.departmentId) {
      const deptId =
        typeof userInfo.departmentId === "string"
          ? userInfo.departmentId
          : (userInfo.departmentId as Department)._id;
      setSelectedDept(deptId);
    }
  }, [userInfo]);

  // Sync with existing attendance records
  useEffect(() => {
    if (existingAttendance?.data) {
      const newMap: Record<
        string,
        { status: AttendanceStatus; remarks: string }
      > = {};
      existingAttendance.data.forEach((record: Attendance) => {
        const sId =
          typeof record.studentId === "string"
            ? record.studentId
            : (record.studentId as User)._id;
        newMap[sId] = {
          status: record.status,
          remarks: record.remarks || "",
        };
      });
      setAttendanceMap(newMap);
    } else {
      setAttendanceMap({});
    }
  }, [existingAttendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAllPresent = () => {
    if (!studentData?.users) return;
    const newMap = { ...attendanceMap };
    studentData.users.forEach((student) => {
      newMap[student._id] = {
        ...newMap[student._id],
        status: "present",
      };
    });
    setAttendanceMap(newMap);
  };

  const handleSave = async () => {
    const currentAYId = currentAYData?.data?._id;
    if (!selectedClass || !selectedSubject || !currentAYId) {
      toast.error("Please ensure all academic parameters are selected");
      return;
    }

    const students = studentData?.users || [];
    const payloadPromises = students
      .map((student) => {
        const record = attendanceMap[student._id];
        if (!record?.status) return null;

        return markAttendance({
          studentId: student._id,
          classId: selectedClass,
          subjectId: selectedSubject,
          teacherId: userInfo?._id,
          academicYearId: currentAYId,
          attendanceDate: format(date, "yyyy-MM-dd"),
          sessionNumber,
          status: record.status,
          remarks: record.remarks,
        }).unwrap();
      })
      .filter((p) => p !== null);

    if (payloadPromises.length === 0) {
      toast.error("No attendance data to save");
      return;
    }

    try {
      await Promise.all(payloadPromises);
      toast.success("Attendance saved successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save attendance");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Attendance Management"
        description="Track and manage student daily attendance records."
        icon={<ClipboardCheck className="h-6 w-6" />}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={markAllPresent}
            disabled={!studentData?.users?.length || isSaving}
            className="rounded-xl"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isSaving ||
              !selectedClass ||
              !selectedSubject ||
              !currentAYData?.data?._id ||
              (studentData?.users?.length || 0) === 0
            }
            className="rounded-xl flex gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Department
          </label>
          <CustomSelect
            value={selectedDept}
            onChange={(val) => {
              setSelectedDept(val);
              setSelectedClass("");
            }}
            options={
              deptData?.departments?.map((d) => ({
                label: d.name,
                value: d._id,
              })) || []
            }
            loading={deptsLoading}
            disabled={userInfo?.role === "hod"}
            placeholder="Select Dept"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Class
          </label>
          <CustomSelect
            value={selectedClass}
            onChange={(val) => {
              setSelectedClass(val);
              setSelectedSubject("");
            }}
            options={
              classData?.classes?.map((c) => ({
                label: `${c.name} (Sem ${c.semester})`,
                value: c._id,
              })) || []
            }
            loading={classesLoading}
            disabled={!selectedDept}
            placeholder="Select Class"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Subject
          </label>
          <CustomSelect
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={
              subjectData?.subjects?.map((s) => ({
                label: `${s.name} (${s.code})`,
                value: s._id,
              })) || []
            }
            loading={subjectsLoading}
            disabled={!selectedClass}
            placeholder="Select Subject"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Session
          </label>
          <Input
            type="number"
            min={1}
            value={sessionNumber}
            onChange={(e) => setSessionNumber(Number(e.target.value))}
            className="rounded-full h-9 mt-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-9 mt-3 justify-start text-left font-normal rounded-full border-input",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Current Academic Year Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Current Academic Year</h4>
            {loadingCurrentAY ? (
              <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Loading...
              </div>
            ) : currentAYData?.data?.name ? (
              <p className="text-sm font-medium text-blue-700 dark:text-blue-200">
                {currentAYData.data.name}
              </p>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                No active academic year found! Please set one in Settings.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* STUDENT LIST */}
      <Card className="rounded-2xl shadow-sm border overflow-hidden">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Student Enrollment List
              </CardTitle>
              <CardDescription>
                {studentData?.users?.length || 0} students enrolled in this
                class.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-zinc-50/50 dark:bg-zinc-900/50">
                <TableHead className="w-[80px] pl-6">Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-[450px]">Attendance Status</TableHead>
                <TableHead className="pr-6">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsLoading || loadingAttendance ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <Clock className="w-8 h-8 animate-spin" />
                      <span className="text-sm">
                        Synchronizing attendance data...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !selectedClass ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <Users className="w-12 h-12 text-zinc-200" />
                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                          No Class Selected
                        </p>
                        <p className="text-xs">
                          Please select a class to load student list.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : studentData?.users?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <Users className="w-12 h-12 text-zinc-200" />
                      <div className="space-y-1">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                          Empty Class
                        </p>
                        <p className="text-xs">
                          No students found enrolled in this class.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                studentData?.users?.map((student) => {
                  const current = attendanceMap[student._id];
                  return (
                    <TableRow
                      key={student._id}
                      className="group transition-colors hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30"
                    >
                      <TableCell className="font-mono text-xs font-bold pl-6 text-zinc-500">
                        {student.rollNo || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                            {student.name}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {student.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {ATTENDANCE_STATUSES.map((status) => {
                            const Icon = status.icon;
                            const isActive = current?.status === status.value;
                            return (
                              <button
                                key={status.value}
                                onClick={() =>
                                  handleStatusChange(student._id, status.value)
                                }
                                className={cn(
                                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200",
                                  isActive
                                    ? status.color + " shadow-sm scale-105"
                                    : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300",
                                )}
                              >
                                <Icon
                                  className={cn(
                                    "w-3.5 h-3.5",
                                    isActive ? "" : "text-zinc-300",
                                  )}
                                />
                                {status.label}
                              </button>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        <Input
                          placeholder="Note (e.g. Left early)"
                          value={current?.remarks || ""}
                          onChange={(e) =>
                            handleRemarksChange(student._id, e.target.value)
                          }
                          className="h-8 text-xs rounded-lg bg-transparent border-zinc-200 group-hover:bg-white dark:group-hover:bg-zinc-900 transition-colors"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}