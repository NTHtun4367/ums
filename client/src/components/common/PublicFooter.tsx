import { Link } from "react-router";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export function PublicFooter() {
  return (
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
            <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Campus</h4>
            <ul className="grid gap-4">
              <li><Link to="/campus-life" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Student Life</Link></li>
              <li><Link to="/campus-life" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Accommodation</Link></li>
              <li><Link to="/campus-life" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Sports & Wellness</Link></li>
              <li><Link to="/admissions" className="text-slate-500 hover:text-primary text-sm font-medium transition-colors">Careers</Link></li>
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
          <div className="flex gap-8">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
