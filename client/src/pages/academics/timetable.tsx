import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  GraduationCap,
  CalendarDays,
  SlidersHorizontal,
  Eye,
  Edit3,
} from "lucide-react";

import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";
import { useGetClassesQuery } from "@/store/slices/classApi";
import { useGetClassTimetableQuery } from "@/store/slices/timetableApi";

import { CustomSelect } from "@/components/common/custom-select";
import { PageHeader } from "@/components/common/page-header";

import type { RootState } from "@/store";
import type { Department, Class } from "@/types/type";

import TimetableManager from "@/components/timetables/timetable-manager";
import TimetableView from "@/components/timetables/timetableview";

const TimetablePage = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [viewMode, setViewMode] = useState<"view" | "edit">("view");

  // HOD auto department lock
  useEffect(() => {
    if (userInfo?.role === "hod" && userInfo.departmentId) {
      const deptId =
        typeof userInfo.departmentId === "string"
          ? userInfo.departmentId
          : (userInfo.departmentId as Department)._id;

      setSelectedDept(deptId);
    }
  }, [userInfo]);

  // Departments
  const { data: deptData, isLoading: deptsLoading } = useGetDepartmentsQuery({
    page: 1,
    limit: 100,
  });

  // Classes
  const { data: classData, isLoading: classesLoading } = useGetClassesQuery(
    {
      page: 1,
      limit: 100,
      departmentId: selectedDept,
    },
    {
      skip: !selectedDept,
    },
  );

  // Timetable
  const {
    data: timetableData,
    isLoading: timetableLoading,
    refetch,
  } = useGetClassTimetableQuery(selectedClass, {
    skip: !selectedClass,
  });

  const departments = deptData?.departments || [];
  const classes = classData?.classes || [];

  const timetable = timetableData || [];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Timetable Matrix Hub"
        description="Manage weekly class schedules and academic time allocations."
        icon={<CalendarDays className="h-6 w-6" />}
      >
        {selectedClass &&
          (userInfo?.role === "admin" || userInfo?.role === "hod") && (
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setViewMode("view")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "view"
                    ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                <Eye className="w-4 h-4" /> View
              </button>

              <button
                onClick={() => setViewMode("edit")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "edit"
                    ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                <Edit3 className="w-4 h-4" /> Manage
              </button>
            </div>
          )}
      </PageHeader>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        {/* Department */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            Department
          </label>

          <CustomSelect
            label="Department"
            value={selectedDept}
            onChange={(value) => {
              setSelectedDept(value);
              setSelectedClass("");
            }}
            disabled={userInfo?.role === "hod" || deptsLoading}
            options={departments.map((dept: Department) => ({
              value: dept._id,
              label: `${dept.name} (${dept.code})`,
            }))}
            placeholder={
              deptsLoading ? "Loading Departments..." : "Select Department"
            }
          />
        </div>

        {/* Class */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-zinc-400" />
            Class
          </label>

          <CustomSelect
            label="Class"
            value={selectedClass}
            onChange={(value) => setSelectedClass(value)}
            disabled={!selectedDept || classesLoading}
            options={classes.map((cls: Class) => ({
              value: cls._id,
              label: `${cls.name} (Semester ${cls.semester})`,
            }))}
            placeholder={
              !selectedDept
                ? "Select Department First"
                : classesLoading
                  ? "Loading Classes..."
                  : "Select Class"
            }
          />
        </div>
      </div>

      {/* CONTENT */}
      {!selectedClass ? (
        <div className="border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-900/30">
          <CalendarDays className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />

          <h3 className="text-lg font-semibold">No Class Selected</h3>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md">
            Please select a department and class to load timetable data.
          </p>
        </div>
      ) : timetableLoading ? (
        <div className="space-y-4 py-10">
          <div className="h-8 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>

          <div className="h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
        </div>
      ) : viewMode === "edit" &&
        (userInfo?.role === "admin" || userInfo?.role === "hod") ? (
        <TimetableManager
          classId={selectedClass}
          departmentId={selectedDept}
          initialTimetable={timetable}
          onSaved={() => {
            refetch();
            setViewMode("view");
          }}
        />
      ) : (
        <TimetableView timetable={timetable} />
      )}
    </div>
  );
};

export default TimetablePage;
