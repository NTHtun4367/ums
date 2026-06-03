import { Link } from "react-router";
import { GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDepartmentsQuery } from "@/store/slices/departmentApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export function PublicNavbar() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { data: deptData } = useGetDepartmentsQuery({ page: 1, limit: 100 });
  const departments = deptData?.departments || [];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">ASTON</span>
              <span className="text-[10px] font-medium text-primary tracking-widest uppercase">University</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-primary">Home</Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">About</Link>
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Departments <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full -left-4 w-64 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="bg-white rounded-2xl shadow-xl border p-2 grid gap-1">
                  {departments.slice(0, 6).map((dept) => (
                    <Link 
                      key={dept._id} 
                      to={`/departments/${dept._id}`} 
                      className="p-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                    >
                      {dept.name}
                    </Link>
                  ))}
                  <div className="border-t mt-1 pt-1">
                    <Link to="#" className="p-3 block text-center text-xs font-bold text-primary hover:underline">
                      View All Departments
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/admissions" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Admissions</Link>
            <Link to="/campus-life" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Campus Life</Link>
          </div>

          <div className="flex items-center gap-4">
            {userInfo ? (
              <Link to="/app">
                <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-xl font-bold">Sign In</Button>
                </Link>
                <Link to="/login">
                  <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">Apply Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
