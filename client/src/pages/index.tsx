import { useGetDashboardStatsQuery } from "@/store/slices/dashboardApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { 
  Users, 
  UserRound, 
  Building2, 
  BookOpen, 
  GraduationCap, 
  ClipboardCheck,
  Activity,
  ArrowUpRight,
  School,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Megaphone,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAnnouncementsQuery } from "@/store/slices/announcementApi";
import { useNavigate } from "react-router";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const ICON_MAP: Record<string, any> = {
  students: Users,
  teachers: UserRound,
  hods: GraduationCap,
  departments: Building2,
  classes: BookOpen,
  subjects: BookOpen,
  attendance: ClipboardCheck,
  sessions: Activity,
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery();
  const { data: announcementData } = useGetAnnouncementsQuery();

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="p-4 rounded-full bg-red-50 text-red-500">
          <ArrowUpRight className="w-10 h-10 rotate-45" />
        </div>
        <h2 className="text-xl font-bold">Failed to load dashboard</h2>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
        <Button 
          onClick={() => refetch()}
          className="rounded-full"
        >
          Retry Load
        </Button>
      </div>
    );
  }

  const stats = data?.data?.summary || [];
  const attendanceTrend = data?.data?.chartData?.attendanceTrend || [];
  const userDistribution = data?.data?.chartData?.userDistribution || [];
  const todaySchedule = data?.data?.todaySchedule || [];
  const recentAnnouncements = announcementData?.data?.slice(0, 3) || [];

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-primary">{userInfo?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1 capitalize">
            {userInfo?.role} Portal &bull; {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/5 text-primary border-primary/20 flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </Badge>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = ICON_MAP[stat.icon] || Activity;
          return (
            <Card key={idx} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Real-time data</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Attendance Overview
            </CardTitle>
            <CardDescription>Daily attendance trends for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution or Today's Schedule */}
        {userInfo?.role === 'admin' ? (
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Roles
              </CardTitle>
              <CardDescription>Distribution of users across roles</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="_id"
                  >
                    {userDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map((period, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {period.subjectName || period.subjectId?.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatMinutes(period.startMinutes)} - {formatMinutes(period.endMinutes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {period.room}
                          </span>
                        </div>
                        {period.className && (
                          <Badge variant="secondary" className="mt-2 text-[10px]">
                            {period.className}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>No classes scheduled for today.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Announcements */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Latest Announcements
              </CardTitle>
              <CardDescription>Important updates and notices</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/announcements")} className="text-primary gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map((announcement) => (
                  <div key={announcement._id} className="p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-base">{announcement.title}</h4>
                      <span className="text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {format(new Date(announcement.createdAt), "MMM d")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{announcement.content}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5">{announcement.authorId?.name}</Badge>
                      <span className="text-[10px] text-slate-400">&bull;</span>
                      <span className="text-[10px] text-slate-400 capitalize">{announcement.target}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>No recent announcements.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / System Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <School className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription className="text-primary-foreground/70">Aston University Portal v1.0.4</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-sm leading-relaxed">
                Welcome to your unified management dashboard. Access academic resources, manage personnel, and track system performance from one central hub.
              </p>
              <Button variant="secondary" className="w-full rounded-xl group">
                Portal Guide
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg">Need Assistance?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">IT Support</p>
                  <p className="text-xs text-muted-foreground">support@aston.edu.uk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Index;

