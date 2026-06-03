import { 
  CheckCircle, 
  Calendar, 
  FileText, 
  Users,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-white">
            <Badge className="mb-6 bg-white/20 text-white border-none font-bold uppercase tracking-widest text-[10px] px-3">
              Admissions 2026-2027
            </Badge>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              Start Your Journey With Us
            </h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed mb-10">
              Join our diverse community of learners and scholars. Applications for the upcoming academic session are now open.
            </p>
            <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold bg-white text-primary hover:bg-slate-100 shadow-xl">
              Apply Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">
              How to Apply
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">Simple Application Process</h2>
            <p className="text-slate-600 text-lg">
              Our streamlined application process makes it easy to join Aston University.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", icon: FileText, title: "Online Application", desc: "Submit your application through our portal" },
              { step: "02", icon: Users, title: "Document Review", desc: "Our admissions team reviews your application" },
              { step: "03", icon: CheckCircle, title: "Decision", desc: "Receive your admission decision within 2 weeks" },
              { step: "04", icon: Calendar, title: "Enroll", desc: "Accept your offer and complete enrollment" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-8xl font-extrabold text-slate-100 absolute -top-8 left-0 select-none">
                  {item.step}
                </div>
                <div className="relative z-10 pt-12">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">
              Requirements
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">Application Requirements</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-12 pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">Undergraduate Programs</CardTitle>
              </CardHeader>
              <CardContent className="p-12 pt-0">
                <ul className="space-y-4">
                  {[
                    "High school diploma or equivalent",
                    "Minimum GPA: 3.0 (or equivalent)",
                    "English language proficiency (IELTS 6.0 / TOEFL 80)",
                    "Personal statement (500 words)",
                    "Two letters of recommendation"
                  ].map((req, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-12 pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">Graduate Programs</CardTitle>
              </CardHeader>
              <CardContent className="p-12 pt-0">
                <ul className="space-y-4">
                  {[
                    "Bachelor's degree in relevant field",
                    "Minimum GPA: 3.2 (or equivalent)",
                    "English language proficiency (IELTS 6.5 / TOEFL 90)",
                    "Statement of purpose (1000 words)",
                    "Three letters of recommendation",
                    "GRE/GMAT scores (optional)"
                  ].map((req, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">
              Timeline
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">Important Dates</h2>
          </div>

          <div className="bg-slate-50 rounded-[2.5rem] p-12">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { date: "Sep 1, 2026", title: "Applications Open", desc: "Submit your applications early" },
                { date: "Jan 15, 2027", title: "Early Decision Deadline", desc: "Early decision applications due" },
                { date: "May 1, 2027", title: "Regular Decision Deadline", desc: "Regular applications closing date" }
              ].map((date, index) => (
                <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold text-primary">{date.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{date.title}</h3>
                  <p className="text-slate-500 text-sm">{date.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
