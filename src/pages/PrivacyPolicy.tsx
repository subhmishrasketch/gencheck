import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-6">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Privacy Policy</span>
            </h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
            <div className="space-y-8">
              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  upload documents for analysis, or contact us for support.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Account information (email, display name)</li>
                  <li>Documents uploaded for analysis (processed in real-time, not stored)</li>
                  <li>Analysis history (if you have an account)</li>
                  <li>Usage data and analytics</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and analyze documents you upload</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Detect and prevent fraudulent or unauthorized access</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Document Processing</h2>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Your documents are not stored.</strong> When you upload a document for analysis, 
                  it is processed in real-time and immediately discarded after the analysis is complete. 
                  We do not retain copies of your documents on our servers.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. 
                  All data transmission is encrypted using TLS/SSL protocols.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Cookies</h2>
                <p className="text-muted-foreground">
                  We use essential cookies to maintain your session and preferences. 
                  We may also use analytics cookies to understand how you use our service. 
                  You can control cookie settings through your browser.
                </p>
              </section>

              <section className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@gencheck.app" className="text-primary hover:underline">
                    privacy@gencheck.app
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

export default PrivacyPolicy;
