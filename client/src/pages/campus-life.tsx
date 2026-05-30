import { Link } from "react-router";
import { 
  ArrowLeft, 
  GraduationCap, 
  Users, 
  Trophy, 
  Music, 
  Home, 
  Utensils, 
  MapPin, 
  Phone, 
  Mail,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function CampusLifePage() {
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
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-white">
            <Badge className="mb-6 bg-primary/20 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">
              Campus Life
            </Badge>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              More Than Just Studies
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Experience vibrant campus life with countless opportunities for personal growth, making friends, and creating memories that last a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Student Life */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">
              Student Life
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">Life at Aston</h2>
            <p className="text-slate-600 text-lg">
              Discover all the amazing activities and facilities that make campus life at Aston University unforgettable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: "Sports & Fitness", desc: "State-of-the-art gym, sports courts, and competitive teams" },
              { icon: Users, title: "Student Clubs", desc: "Join over 50 clubs and societies based on your interests" },
              { icon: Music, title: "Arts & Culture", desc: "Music, theater, art galleries, and cultural events year-round" },
              { icon: Home, title: "Accommodation", desc: "Comfortable on-campus housing options for all students" },
              { icon: Utensils, title: "Dining", desc: "Multiple cafes, restaurants, and food courts on campus" },
              { icon: Heart, title: "Wellness", desc: "Counseling, health services, and wellness programs" }
            ].map((item, index) => (
              <Card key={index} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">
              Events
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">Annual Events</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Freshers Week", month: "September", desc: "Orientation week for new students with fun activities" },
              { title: "Sports Day", month: "March", desc: "Annual inter-department sports competition" },
              { title: "Graduation Ball", month: "July", desc: "Celebrate your achievements in style" }
            ].map((event, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100">
                <Badge className="mb-4 bg-primary text-white">{event.month}</Badge>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{event.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl font-bold tracking-tight mb-6">World-Class Facilities</h2>
              <p className="text-primary-foreground/80 text-lg">
                Everything you need to succeed academically and personally.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "24/7", label: "Library Access" },
                { number: "50+", label: "Computer Labs" },
                { number: "10+", label: "Sports Courts" },
                { number: "3", label: "Cafeterias" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-5xl font-extrabold mb-2">{stat.number}</p>
                  <p className="text-primary-foreground/80 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-24 pb-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="p-1.5 bg-primary rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">ASTON</span>
                  <span className="text-[8px] font-medium text-primary tracking-widest uppercase">University</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Excellence in education and research. Preparing students for a global future since 1966.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="grid gap-4">
                <li><Link to="/about" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">About Us</Link></li>
                <li><Link to="/admissions" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Admissions</Link></li>
                <li><Link to="/campus-life" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Campus Life</Link></li>
                <li><Link to="/" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Home</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Contact Us</h4>
              <ul className="grid gap-4">
                <li className="flex gap-3 text-slate-500 text-sm font-medium">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  Aston Triangle, Birmingham, B4 7ET, UK
                </li>
                <li className="flex gap-3 text-slate-500 text-sm font-medium">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  +44 (0)121 204 3000
                </li>
                <li className="flex gap-3 text-slate-500 text-sm font-medium">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  hello@aston.ac.uk
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <p>&copy; 2026 Aston University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
