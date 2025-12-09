import { FileText, Bot, AlertTriangle, CheckCircle, Quote, Lightbulb, FileSearch, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";

interface AnalysisReportProps {
  result: any;
  fileName: string;
  fileSize: number;
  onReset: () => void;
}

const AnalysisReport = ({ result, fileName, fileSize, onReset }: AnalysisReportProps) => {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];
  
  const pieData = [
    { name: 'AI Generated', value: result.aiProbability },
    { name: 'Human Made', value: result.humanProbability },
  ];

  const scoresData = [
    { name: 'Writing Style', score: result.detailedScores?.writingStyle || 50, fill: 'hsl(var(--primary))' },
    { name: 'Content Depth', score: result.detailedScores?.contentDepth || 50, fill: 'hsl(221, 83%, 63%)' },
    { name: 'Structure', score: result.detailedScores?.structuralPatterns || 50, fill: 'hsl(262, 83%, 58%)' },
    { name: 'Vocabulary', score: result.detailedScores?.vocabularyAnalysis || 50, fill: 'hsl(262, 83%, 68%)' },
    { name: 'Consistency', score: result.detailedScores?.consistencyScore || 50, fill: 'hsl(221, 83%, 73%)' },
  ];

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* File Info Header */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-feature-icon rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{fileName}</h3>
            <p className="text-sm text-muted-foreground">
              {(fileSize / 1024 / 1024).toFixed(2)} MB • Analysis Complete
            </p>
          </div>
          <Button variant="outline" onClick={onReset}>
            Analyze Another
          </Button>
        </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* AI vs Human Pie Chart */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              AI vs Human Analysis
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detected AI Tool */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Tool Detection
            </h3>
            {result.detectedAITool && result.detectedAITool !== "None" && result.detectedAITool !== "Unknown" ? (
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 text-center">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold gradient-text mb-2">{result.detectedAITool}</h4>
                <p className="text-muted-foreground">Confidence: {result.aiToolConfidence}%</p>
                <Progress value={result.aiToolConfidence} className="h-2 mt-3" />
              </div>
            ) : (
              <div className="bg-green-500/10 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-green-600 mb-2">
                  {result.aiProbability > 50 ? "Unknown AI Tool" : "Likely Human-Made"}
                </h4>
                <p className="text-muted-foreground">
                  {result.aiProbability > 50 ? "AI detected but specific tool unclear" : "Content appears to be human-authored"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Key Findings */}
        {result.keyFindings && result.keyFindings.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Key Findings
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {result.keyFindings.map((finding: string, index: number) => (
                <div key={index} className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground">{finding}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Scores Bar Chart */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Detailed Analysis Scores
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Higher scores indicate more AI-like characteristics</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoresData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detected Phrases */}
        {result.detectedPhrases && result.detectedPhrases.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Quote className="w-5 h-5 text-primary" />
              Detected Phrases
            </h3>
            <div className="space-y-3">
              {result.detectedPhrases.map((item: any, index: number) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-4 border ${
                    item.type === 'ai' 
                      ? 'bg-destructive/5 border-destructive/20' 
                      : 'bg-green-500/5 border-green-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.type === 'ai' ? (
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-foreground italic">"{item.phrase}"</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Analysis */}
        {result.patternAnalysis && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-primary" />
              Pattern Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Repetitive Structures</p>
                  <p className="text-foreground">{result.patternAnalysis.repetitiveStructures || "Not analyzed"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transition Usage</p>
                  <p className="text-foreground">{result.patternAnalysis.transitionUsage || "Not analyzed"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sentence Variety</p>
                  <p className="text-foreground capitalize">{result.patternAnalysis.sentenceVariety || "Not analyzed"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Formality Level</p>
                  <p className="text-foreground capitalize">{result.patternAnalysis.formality || "Not analyzed"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Personal Touches</p>
                  <p className="text-foreground capitalize">{result.patternAnalysis.personalTouches || "Not analyzed"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Notes */}
        {result.metadataNotes && result.metadataNotes.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Metadata Notes</h3>
            <ul className="space-y-2">
              {result.metadataNotes.map((note: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI & Human Indicators */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-destructive/5 rounded-2xl border border-destructive/20 p-6">
            <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              AI Indicators
            </h3>
            <ul className="space-y-2">
              {result.indicators?.aiIndicators?.map((indicator: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-destructive mt-1">•</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-500/5 rounded-2xl border border-green-500/20 p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Human Indicators
            </h3>
            <ul className="space-y-2">
              {result.indicators?.humanIndicators?.map((indicator: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-green-600 mt-1">•</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
          <p className="text-foreground">{result.summary}</p>
        </div>
      </div>
    </section>
  );
};

export default AnalysisReport;
