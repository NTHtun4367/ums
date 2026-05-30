import { useParams, Link } from "react-router";
import { 
  useGetDepartmentByIdQuery 
} from "@/store/slices/departmentApi";
import { 
  useGetUsersQuery 
} from "@/store/slices/userApi";
import { 
  useGetSubjectsQuery 
} from "@/store/slices/subjectApi";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Building2, 
  ArrowLeft,
  Mail,
  Phone,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function DepartmentPortalPage() {
  const { id } = useParams();
  
  const { data: department, isLoading: deptLoading } = useGetDepartmentByIdQuery(id!);
  
  const { data: teachersData, isLoading: teachersLoading } = useGetUsersQuery({
    page: 1,
    limit: 10,
    role: "teacher",
    departmentId: id,
  });

  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsQuery({
    page: 1,
    limit: 100,
    departmentId: id!,
  });

  const getSemesterFromCode = (code: string): { year: number; semester: number } => {
    const match = code.match(/^\d{2}/);
    if (match) {
      const num = parseInt(match[0], 10);
      const year = Math.ceil(num / 2);
      const semester = num % 2 === 0 ? 2 : 1;
      return { year, semester };
    }
    return { year: 0, semester: 0 };
  };

  const categorizedSubjects = useMemo(() => {
    if (!subjectsData?.subjects) return {};
    
    const categories: Record<string, typeof subjectsData.subjects> = {};
    
    subjectsData.subjects.forEach((subject) => {
      const { year, semester } = getSemesterFromCode(subject.code);
      const key = year > 0 ? `Year ${year}, Semester ${semester}` : "Other";
      
      if (!categories[key]) {
        categories[key] = [];
      }
      categories[key].push(subject);
    });
    
    return categories;
  }, [subjectsData]);

  if (deptLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mb-4">Department not found</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">ASTON</span>
                <span className="text-[10px] font-medium text-primary tracking-widest uppercase">University</span>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="rounded-xl flex gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Portal
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-primary/20 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">Academic Department</Badge>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">{department.name}</h1>
              <p className="text-xl text-slate-300 leading-relaxed font-medium">
                {department.description || `The Department of ${department.name} at Aston University is dedicated to excellence in teaching, research, and innovation.`}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="p-4 bg-primary rounded-2xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dept Code</p>
                <p className="text-2xl font-bold">{department.code}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Faculty & Overview */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold">Expert Faculty</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {teachersLoading ? (
                  [1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)
                ) : teachersData?.users?.length ? (
                  teachersData.users.map((teacher) => (
                    <Card key={teacher._id} className="border-none shadow-sm bg-slate-50 rounded-3xl overflow-hidden hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                            <UserIcon className="w-8 h-8 text-slate-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg">{teacher.name}</h3>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none">
                              {teacher.teacherStatus?.replace("_", " ") || "Faculty"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <Mail className="w-4 h-4 text-primary" />
                            {teacher.email}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <Phone className="w-4 h-4 text-primary" />
                            {teacher.phone || "N/A"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No faculty members found for this department.</p>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold">Curriculum Overview</h2>
              </div>
              <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12">
                {subjectsLoading ? (
                  <div className="grid gap-4">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
                  </div>
                ) : Object.keys(categorizedSubjects).length ? (
                  <div className="space-y-8">
                    {Object.entries(categorizedSubjects).map(([category, subjects]) => (
                      <div key={category}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Badge className="bg-primary text-white">{category}</Badge>
                        </h3>
                        <div className="grid gap-4">
                          {subjects.map((subject) => (
                            <div key={subject._id} className="bg-white p-6 rounded-2xl flex items-center justify-between group hover:shadow-sm transition-all border border-transparent hover:border-primary/20">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                                  {subject.code}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{subject.name}</h4>
                                  <p className="text-xs text-slate-500 font-medium">Semester {subject.semester}</p>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No subjects listed yet.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary p-8">
                <CardTitle className="text-white text-xl">Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Office Location</p>
                  <p className="font-bold text-slate-900">Main Building, Wing B, 3rd Floor</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Inquiries</p>
                  <p className="font-bold text-slate-900">{department.name.toLowerCase().replace(/\s+/g, ".")}@aston.edu</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Office Hours</p>
                  <p className="font-bold text-slate-900">Mon - Fri, 9:00 AM - 5:00 PM</p>
                </div>
                <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20">
                  Request Information
                </Button>
              </CardContent>
            </Card>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Admissions</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                Interested in joining the {department.name} department? Applications are currently open for the next session.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white/10 font-bold">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 Aston University &bull; {department.name} Department
        </p>
      </footer>
    </div>
  );
}
