import { useState, useRef } from "react";
import { Upload, FileText, ArrowRight, Loader2, CheckCircle, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { extractFileContent, ExtractedContent } from "@/lib/fileParser";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface FileAnalysis {
  file: File;
  result: {
    aiProbability: number;
    humanProbability: number;
    detectedAITool: string;
    aiToolConfidence: number;
    summary: string;
    indicators: {
      aiIndicators: string[];
      humanIndicators: string[];
    };
  } | null;
}

const Compare = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [analysis1, setAnalysis1] = useState<FileAnalysis["result"]>(null);
  const [analysis2, setAnalysis2] = useState<FileAnalysis["result"]>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleFileSelect = (fileNum: 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/pdf'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a .pptx or .pdf file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be under 50MB");
        return;
      }

      if (fileNum === 1) {
        setFile1(file);
        setAnalysis1(null);
      } else {
        setFile2(file);
        setAnalysis2(null);
      }
    }
  };

  const removeFile = (fileNum: 1 | 2) => {
    if (fileNum === 1) {
      setFile1(null);
      setAnalysis1(null);
      if (fileInput1Ref.current) fileInput1Ref.current.value = '';
    } else {
      setFile2(null);
      setAnalysis2(null);
      if (fileInput2Ref.current) fileInput2Ref.current.value = '';
    }
  };

  const analyzeFile = async (file: File): Promise<FileAnalysis["result"]> => {
    const extractedContent = await extractFileContent(file);
    const fileType = file.type.includes('pdf') ? 'PDF' : 'PowerPoint';
    
    const analysisContent = `
[${fileType} Document: ${file.name}]
[${fileType === 'PDF' ? extractedContent.pageCount + ' pages' : extractedContent.slideCount + ' slides'}]

--- Document Metadata ---
Title: ${extractedContent.metadata.title || 'Not specified'}
Author: ${extractedContent.metadata.author || 'Not specified'}
Creator Software: ${extractedContent.metadata.creator || 'Not specified'}

--- Extracted Content ---
${extractedContent.text}
`.trim();

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-document`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          textContent: analysisContent,
          fileName: file.name,
          fileType: fileType,
          metadata: extractedContent.metadata,
          useProModel: true, // Use Gemini 2.5 Pro for accurate comparison
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    return await response.json();
  };

  const startComparison = async () => {
    if (!file1 || !file2) {
      toast.error("Please upload both files to compare");
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep("Analyzing both files in parallel...");

    try {
      // Run both analyses in parallel for faster results
      const [result1, result2] = await Promise.all([
        analyzeFile(file1),
        analyzeFile(file2)
      ]);
      
      setAnalysis1(result1);
      setAnalysis2(result2);
      
      toast.success("Comparison complete!");
    } catch (error) {
      console.error("Comparison error:", error);
      toast.error("Failed to complete comparison");
    } finally {
      setIsAnalyzing(false);
      setCurrentStep(null);
    }
  };

  const resetComparison = () => {
    setFile1(null);
    setFile2(null);
    setAnalysis1(null);
    setAnalysis2(null);
    if (fileInput1Ref.current) fileInput1Ref.current.value = '';
    if (fileInput2Ref.current) fileInput2Ref.current.value = '';
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

  const renderPieChart = (analysis: FileAnalysis["result"]) => {
    if (!analysis) return null;
    
    const data = [
      { name: 'AI Generated', value: analysis.aiProbability },
      { name: 'Human Made', value: analysis.humanProbability },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-4">
              Compare Documents
            </h1>
            <p className="text-muted-foreground">
              Upload two presentations to compare their AI detection results side by side
            </p>
          </div>

          {/* Results View */}
          {analysis1 && analysis2 ? (
            <div className="space-y-8">
              {/* Comparison Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* File 1 Results */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-feature-icon rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{file1?.name}</h3>
                    </div>
                  </div>
                  
                  {renderPieChart(analysis1)}
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AI Probability</span>
                      <span className="font-bold text-primary">{analysis1.aiProbability}%</span>
                    </div>
                    <Progress value={analysis1.aiProbability} className="h-2" />
                    
                    {analysis1.detectedAITool && analysis1.detectedAITool !== "None" && analysis1.detectedAITool !== "Unknown" && (
                      <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Detected: {analysis1.detectedAITool}</p>
                          <p className="text-xs text-muted-foreground">{analysis1.aiToolConfidence}% confidence</p>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">{analysis1.summary}</p>
                  </div>
                </div>

                {/* File 2 Results */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-feature-icon rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{file2?.name}</h3>
                    </div>
                  </div>
                  
                  {renderPieChart(analysis2)}
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AI Probability</span>
                      <span className="font-bold text-primary">{analysis2.aiProbability}%</span>
                    </div>
                    <Progress value={analysis2.aiProbability} className="h-2" />
                    
                    {analysis2.detectedAITool && analysis2.detectedAITool !== "None" && analysis2.detectedAITool !== "Unknown" && (
                      <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Detected: {analysis2.detectedAITool}</p>
                          <p className="text-xs text-muted-foreground">{analysis2.aiToolConfidence}% confidence</p>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">{analysis2.summary}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={resetComparison} className="gradient-bg text-primary-foreground">
                  Compare New Files
                </Button>
              </div>
            </div>
          ) : isAnalyzing ? (
            /* Loading State */
            <div className="max-w-md mx-auto text-center">
              <div className="bg-card rounded-2xl border border-border p-12">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{currentStep}</h3>
                <p className="text-muted-foreground">Please wait while we analyze both documents...</p>
              </div>
            </div>
          ) : (
            /* Upload State */
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* File 1 Upload */}
              <div className="upload-zone p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-feature-icon rounded-2xl flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Document 1</h3>
                
                {file1 ? (
                  <div className="bg-background rounded-xl border border-border p-3 flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-foreground truncate">{file1.name}</p>
                      <p className="text-xs text-muted-foreground">{(file1.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(1)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-4">Upload first file to compare</p>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInput1Ref.current?.click()}
                  className="w-full"
                >
                  {file1 ? 'Change File' : 'Choose File'}
                </Button>
                <input
                  ref={fileInput1Ref}
                  type="file"
                  accept=".pptx,.pdf"
                  onChange={handleFileSelect(1)}
                  className="hidden"
                />
              </div>

              {/* File 2 Upload */}
              <div className="upload-zone p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-feature-icon rounded-2xl flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Document 2</h3>
                
                {file2 ? (
                  <div className="bg-background rounded-xl border border-border p-3 flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-foreground truncate">{file2.name}</p>
                      <p className="text-xs text-muted-foreground">{(file2.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(2)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-4">Upload second file to compare</p>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInput2Ref.current?.click()}
                  className="w-full"
                >
                  {file2 ? 'Change File' : 'Choose File'}
                </Button>
                <input
                  ref={fileInput2Ref}
                  type="file"
                  accept=".pptx,.pdf"
                  onChange={handleFileSelect(2)}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Compare Button */}
          {file1 && file2 && !analysis1 && !isAnalyzing && (
            <div className="text-center mt-8">
              <Button 
                onClick={startComparison}
                size="lg"
                className="gradient-bg text-primary-foreground hover:opacity-90 px-12"
              >
                Start Comparison
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Compare;
