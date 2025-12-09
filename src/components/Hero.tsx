import { Sparkles, ArrowRight } from "lucide-react";
import FeatureBadge from "./FeatureBadge";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToUpload = () => {
    const uploadSection = document.querySelector('#upload-section');
    uploadSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-28 pb-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-60 right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="container mx-auto text-center relative z-10">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-elegant mb-8 animate-fade-up">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">AI-Powered Detection Engine</span>
        </div>

        {/* Logo & Title */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-up delay-100">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse-glow" />
            <img src={logo} alt="GenCheck Logo" className="w-16 h-16 relative z-10 animate-float" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold gradient-text tracking-tight">
            GenCheck
          </h1>
        </div>

        {/* Tagline */}
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 animate-fade-up delay-200">
          AI Detector for AI-Generated Content
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 animate-fade-up delay-300 text-balance">
          Upload any PowerPoint or PDF file and let our advanced AI analysis 
          determine if it was created by AI tools or crafted by humans.
        </p>

        {/* CTA Button */}
        <Button 
          onClick={scrollToUpload}
          size="lg"
          className="btn-primary px-8 py-6 text-base mb-10 animate-fade-up delay-400"
        >
          Analyze Your Document
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up delay-500">
          <FeatureBadge icon="nlp" label="NLP Analysis" />
          <FeatureBadge icon="metadata" label="Metadata Check" />
          <FeatureBadge icon="design" label="Design Patterns" />
          <FeatureBadge icon="plagiarism" label="Plagiarism Detection" />
        </div>
      </div>
    </section>
  );
};

export default Hero;