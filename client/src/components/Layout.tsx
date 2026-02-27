import { Link } from "wouter";
import { Activity, ShieldCheck } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col medical-gradient">
      <header className="sticky top-0 z-50 w-full glass-card border-b-0 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold leading-none text-primary">LabAI</h1>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Intelligence Agent</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white/50 px-4 py-2 rounded-full border border-border">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>100% HIPAA Compliant & Secure</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg text-primary">LabAI</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Lab Report Intelligence Agent. For Indian Patients.
            <br className="md:hidden" />
            <span className="hidden md:inline"> • </span>
            This tool provides informational insights only, not medical diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
}
