import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, FileText, Shield, Zap, Mail } from "lucide-react";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How does GenCheck detect AI-generated content?",
      answer: "GenCheck uses advanced machine learning algorithms to analyze writing patterns, sentence structures, vocabulary usage, and other linguistic markers. Our system compares these patterns against known AI-generated content signatures to provide accurate detection results."
    },
    {
      question: "What file formats are supported?",
      answer: "GenCheck currently supports PDF and PowerPoint (PPT/PPTX) files. We extract text content from these documents and analyze them for AI-generated patterns. Maximum file size is 10MB per document."
    },
    {
      question: "How accurate is the detection?",
      answer: "Our detection system achieves high accuracy rates by analyzing multiple factors including writing style, content patterns, and metadata. However, no detection system is 100% accurate, and results should be used as one factor in your assessment."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, your privacy is our priority. Documents are processed in real-time and are not stored on our servers after analysis. All data transmission is encrypted using industry-standard protocols."
    },
    {
      question: "Can I compare two documents?",
      answer: "Yes! Use our Compare feature to analyze two documents side-by-side. This is useful for comparing different versions of a document or checking multiple submissions."
    },
    {
      question: "Do I need an account to use GenCheck?",
      answer: "You can analyze documents without an account. However, creating a free account allows you to save your analysis history and access additional features."
    }
  ];

  const guides = [
    {
      icon: FileText,
      title: "Uploading Documents",
      description: "Simply drag and drop your PDF or PowerPoint file into the upload zone, or click to browse your files."
    },
    {
      icon: Zap,
      title: "Understanding Results",
      description: "Our analysis provides AI probability scores, pattern analysis, detected phrases, and key findings to help you make informed decisions."
    },
    {
      icon: Shield,
      title: "Best Practices",
      description: "For best results, upload complete documents. Partial content or heavily formatted documents may affect accuracy."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-6">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Help Center</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions and learn how to get the most out of GenCheck.
            </p>
          </div>

          {/* Quick Guides */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {guides.map((guide, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <guide.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{guide.title}</h3>
                <p className="text-muted-foreground text-sm">{guide.description}</p>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-foreground font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact */}
          <div className="mt-16 text-center p-8 rounded-2xl border border-border bg-card/50">
            <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to assist you with any questions.
            </p>
            <a 
              href="mailto:support@gencheck.app" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              support@gencheck.app
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;
