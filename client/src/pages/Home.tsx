import { UploadBox } from "@/components/UploadBox";
import { Layout } from "@/components/Layout";
import { FileSearch, Sparkles, Apple, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileSearch,
    title: "Works with any lab",
    description: "Supports reports from Lal PathLabs, Thyrocare, SRL, Apollo, and local clinics.",
    color: "bg-blue-50 text-primary border-blue-100",
  },
  {
    icon: Sparkles,
    title: "Plain-language insights",
    description: "No medical jargon. We explain what your biomarkers mean in simple terms.",
    color: "bg-green-50 text-secondary border-green-100",
  },
  {
    icon: Apple,
    title: "Indian Diet & Yoga",
    description: "Get culturally relevant dietary suggestions and yoga asanas based on your results.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="w-full">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 border border-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Health Insights</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight"
            >
              Understand Your <span className="text-primary">Lab Report</span> <br/>in Seconds.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
            >
              Upload your medical test results and get instant, easy-to-understand analysis, personalized diet plans, and lifestyle recommendations.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <UploadBox />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold mb-4">Why use LabAI?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Designed specifically to bridge the gap between complex medical data and patient understanding.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-background rounded-3xl p-8 border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 ${feature.color}`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-primary/5 border-y border-primary/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold mb-4">Your Privacy is Our Priority</h2>
            <p className="text-muted-foreground">
              Your lab reports are processed securely and are never shared with third parties. We use enterprise-grade encryption to ensure your medical data remains completely confidential.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
