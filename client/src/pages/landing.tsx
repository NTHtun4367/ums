import { Link } from "react-router";
import { 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  Megaphone,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  useGetAnnouncementsQuery 
} from "@/store/slices/announcementApi";
import { 
  useGetDepartmentsQuery 
} from "@/store/slices/departmentApi";
import { format } from "date-fns";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";

export default function LandingPage() {
  const { data: announcementData } = useGetAnnouncementsQuery();
  const { data: deptData } = useGetDepartmentsQuery({ page: 1, limit: 100 });

  const announcements = announcementData?.data?.slice(0, 3) || [];
  const departments = deptData?.departments || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10" />
          <img 
            src="/src/assets/hero.png" 
            alt="Campus" 
            className="w-full h-full object-cover object-right opacity-40 scale-105"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 text-primary border-primary/20 text-xs font-bold uppercase tracking-wider">
              Enrolling for Session 2026-2027
            </Badge>
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              Empowering Minds, <span className="text-primary">Shaping Futures.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Join a community of innovators and thinkers at Aston University. We provide world-class education designed to prepare you for the challenges of tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30">
                Explore Programs <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold bg-white/50 backdrop-blur-sm">
                Virtual Tour
              </Button>
            </div>

            <div className="mt-16 flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Student" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  +2k
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Joined by 2,000+ Students</p>
                <p className="text-xs text-slate-500 font-medium">Across 40+ countries worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary mb-1">98%</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Graduate Hire</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary mb-1">150+</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Research Papers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary mb-1">12:1</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Student Ratio</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary mb-1">Top 10</p>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">UK Ranking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">Updates</Badge>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Latest Announcements</h2>
            </div>
            <Button variant="ghost" className="font-bold text-primary group">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {announcements.length > 0 ? (
              announcements.map((item) => (
                <Card key={item._id} className="border-none shadow-sm bg-slate-50 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {format(new Date(item.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{item.content}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-lg">{item.target}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              [1,2,3].map(i => (
                <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -ml-48 -mb-48" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge className="mb-4 bg-primary/20 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">Faculty</Badge>
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Academic Departments</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Explore our diverse range of departments led by industry experts and world-renowned researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.slice(0, 6).map((dept) => (
              <div 
                key={dept._id} 
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{dept.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                  Providing cutting-edge education in {dept.name} with advanced research facilities.
                </p>
                <Link to={`/departments/${dept._id}`} className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                  Explore Department <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" variant="outline" className="rounded-2xl border-white/20 text-white hover:bg-white/10 h-14 px-8 font-bold text-lg">
              View All 15+ Departments
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-xl shadow-primary/40">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <Globe className="w-full h-full scale-150 rotate-12" />
            </div>
            
            <div className="max-w-3xl relative z-10 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to begin your journey?</h2>
              <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                Applications for the next academic session are now open. Secure your place at Aston University today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="h-16 px-10 rounded-2xl text-lg font-bold">
                  Start Application
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-white/20 hover:bg-white/10">
                  Request Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
