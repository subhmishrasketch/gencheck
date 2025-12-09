import { Target, Zap, Shield, Brain, Bot, FileText } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Accurate Detection",
    description: "Advanced AI analyzes multiple aspects including text patterns, design elements, and metadata for highly accurate detection."
  },
  {
    icon: Zap,
    title: "Fast Analysis",
    description: "Get results in seconds. Optimized processing pipeline analyzes your presentations quickly without compromising accuracy."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your files are processed securely and never stored permanently. We prioritize your privacy and data protection."
  },
  {
    icon: Brain,
    title: "Deep NLP Analysis",
    description: "Advanced natural language processing examines vocabulary, grammar patterns, and writing style to identify AI-generated content."
  },
  {
    icon: Bot,
    title: "AI Tool Detection",
    description: "Identifies specific AI tools used to create presentations, including Gamma, Beautiful.ai, ChatGPT, and other popular generators."
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Comprehensive analysis reports with visual breakdowns, confidence scores, and downloadable PDF documentation."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Features
          </div>
          <h2 className="section-heading mb-4">
            Powerful AI Detection Technology
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Our cutting-edge analysis engine combines multiple detection methods to provide 
            the most accurate AI detection for presentations.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group cursor-default"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;