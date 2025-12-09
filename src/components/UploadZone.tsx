import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, ArrowRight, Loader2, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { extractFileContent } from "@/lib/fileParser";
import AnalysisReport from "./AnalysisReport";

type AnalysisStep = 'extracting' | 'analyzing' | 'generating';

const UploadZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<AnalysisStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<AnalysisStep[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
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

    setSelectedFile(file);
    setAnalysisResult(null);
    setCompletedSteps([]);
    setCurrentStep(null);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setCurrentStep('extracting');

    try {
      let extractedContent;
      try {
        extractedContent = await extractFileContent(selectedFile);
      } catch (extractError) {
        console.error("Extraction error:", extractError);
        toast.error("Failed to extract content from file. Please try another file.");
        setIsAnalyzing(false);
        setCurrentStep(null);
        return;
      }

      const fileType = selectedFile.type.includes('pdf') ? 'PDF' : 'PowerPoint';
      const contentInfo = fileType === 'PDF' 
        ? `${extractedContent.pageCount} pages` 
        : `${extractedContent.slideCount} slides`;

      console.log(`Extracted ${extractedContent.text.length} characters from ${contentInfo}`);
      
      setCompletedSteps(['extracting']);
      setCurrentStep('analyzing');

      const metadataInfo = extractedContent.metadata;
      const analysisContent = `
[${fileType} Document: ${selectedFile.name}]
[${contentInfo}]
[File Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB]

--- Document Metadata ---
Title: ${metadataInfo.title || 'Not specified'}
Author: ${metadataInfo.author || 'Not specified'}
Creator Software: ${metadataInfo.creator || 'Not specified'}
Producer: ${metadataInfo.producer || 'Not specified'}
Creation Date: ${metadataInfo.creationDate || 'Not specified'}
Last Modified: ${metadataInfo.modificationDate || 'Not specified'}

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
            fileName: selectedFile.name,
            fileType: fileType,
            metadata: metadataInfo,
            contentStats: {
              characterCount: extractedContent.text.length,
              pageCount: extractedContent.pageCount,
              slideCount: extractedContent.slideCount,
            },
            useProModel: false,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const rawResult = await response.json();
      setCompletedSteps(['extracting', 'analyzing']);
      setCurrentStep('generating');

      await new Promise(resolve => setTimeout(resolve, 500));

      setCompletedSteps(['extracting', 'analyzing', 'generating']);
      setAnalysisResult(rawResult);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze file");
    } finally {
      setIsAnalyzing(false);
      setCurrentStep(null);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setCompletedSteps([]);
    setCurrentStep(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Results View
  if (analysisResult && selectedFile) {
    return (
      <AnalysisReport 
        result={analysisResult}
        fileName={selectedFile.name}
        fileSize={selectedFile.size}
        onReset={resetAnalysis}
      />
    );
  }

  // Analysis Progress View
  if (isAnalyzing && selectedFile) {
    const steps = [
      { key: 'extracting' as const, title: 'Extracting Content', desc: 'Reading slides and text' },
      { key: 'analyzing' as const, title: 'AI Analysis', desc: 'Detecting patterns & phrases' },
      { key: 'generating' as const, title: 'Generating Report', desc: 'Preparing detailed results' },
    ];

    return (
      <section id="upload-section" className="py-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-card rounded-3xl border border-border p-8 shadow-elevated">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Your Document</h3>
              <p className="text-muted-foreground text-sm">{selectedFile.name}</p>
            </div>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={step.key}
                  className={`rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 ${
                    completedSteps.includes(step.key) 
                      ? 'border-success/50 bg-success/5' 
                      : currentStep === step.key 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-border bg-secondary/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    completedSteps.includes(step.key) 
                      ? 'bg-success text-success-foreground' 
                      : currentStep === step.key 
                        ? 'gradient-bg text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                  }`}>
                    {completedSteps.includes(step.key) ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : currentStep === step.key ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <span className="text-lg font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      completedSteps.includes(step.key) 
                        ? 'text-success' 
                        : currentStep === step.key 
                          ? 'text-primary'
                          : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                  {currentStep === step.key && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span 
                          key={i}
                          className="w-2 h-2 bg-primary rounded-full animate-bounce" 
                          style={{ animationDelay: `${i * 150}ms` }} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // File Ready State
  if (selectedFile && !isAnalyzing) {
    return (
      <section id="upload-section" className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card rounded-3xl border border-border p-10 shadow-elevated text-center">
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-2xl flex items-center justify-center shadow-glow">
              <FileText className="w-10 h-10 text-primary-foreground" />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
              Ready to Analyze
            </h3>
            <p className="text-muted-foreground mb-6">
              Your file is ready for AI detection analysis
            </p>

            <div className="bg-secondary/50 rounded-2xl border border-border p-5 flex items-center gap-4 mb-8 max-w-sm mx-auto">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{selectedFile.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="font-medium"
              >
                Choose Different File
              </Button>
              <Button 
                onClick={startAnalysis}
                className="btn-primary px-8"
                size="lg"
              >
                Start Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pptx,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </div>
      </section>
    );
  }

  // Default Upload State
  return (
    <section id="upload-section" className="py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative bg-card rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer group ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border hover:border-primary/50 hover:bg-secondary/30'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          {/* Upload Icon */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging 
              ? 'gradient-bg shadow-glow scale-110' 
              : 'bg-secondary group-hover:gradient-bg group-hover:shadow-glow'
          }`}>
            <CloudUpload className={`w-10 h-10 transition-colors ${
              isDragging ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary-foreground'
            }`} />
          </div>

          {/* Text */}
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {isDragging ? 'Drop your file here' : 'Upload your document'}
          </h3>
          <p className="text-muted-foreground mb-6">
            Drag and drop or{" "}
            <span className="text-primary font-medium">browse</span>
            {" "}to choose a file
          </p>

          {/* File Type Badges */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground/70">
              .pptx
            </span>
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground/70">
              .pdf
            </span>
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground/70">
              up to 50MB
            </span>
          </div>

          {/* Button */}
          <Button 
            className="btn-primary px-8 pointer-events-none"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Choose File
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
};

export default UploadZone;