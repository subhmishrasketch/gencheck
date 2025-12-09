import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-6">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Terms of Service</span>
            </h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using GenCheck, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  GenCheck provides AI content detection services for PDF and PowerPoint documents. 
                  Our service analyzes documents to determine the likelihood that content was generated 
                  by artificial intelligence tools.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>You are responsible for the content you upload</li>
                  <li>You must have the right to upload and analyze the documents</li>
                  <li>You agree not to upload malicious files or attempt to exploit the service</li>
                  <li>You will not use the service for any illegal purposes</li>
                  <li>You are responsible for maintaining the security of your account</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Accuracy Disclaimer</h2>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Important:</strong> While we strive for high accuracy, 
                  no AI detection system is 100% accurate. Our results should be used as one factor in 
                  your assessment and not as definitive proof of AI-generated content. GenCheck is not 
                  liable for decisions made based on our analysis results.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  You retain all rights to the documents you upload. GenCheck does not claim ownership 
                  of your content. Our service, including its design, features, and technology, is 
                  protected by intellectual property laws.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  GenCheck is provided "as is" without warranties of any kind. We are not liable for 
                  any damages arising from your use of the service, including but not limited to 
                  direct, indirect, incidental, or consequential damages.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Account Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account if you violate these terms 
                  or engage in any activity that may harm our service or other users. You may delete 
                  your account at any time through your account settings.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these terms from time to time. We will notify users of significant 
                  changes via email or through the service. Continued use of GenCheck after changes 
                  constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, contact us at{" "}
                  <a href="mailto:legal@gencheck.app" className="text-primary hover:underline">
                    legal@gencheck.app
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
