import { Brain, FileSearch, Palette, ShieldCheck } from "lucide-react";

interface FeatureBadgeProps {
  icon: "nlp" | "metadata" | "design" | "plagiarism";
  label: string;
}

const iconMap = {
  nlp: Brain,
  metadata: FileSearch,
  design: Palette,
  plagiarism: ShieldCheck,
};

const FeatureBadge = ({ icon, label }: FeatureBadgeProps) => {
  const Icon = iconMap[icon];

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-default group">
      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
        {label}
      </span>
    </div>
  );
};

export default FeatureBadge;