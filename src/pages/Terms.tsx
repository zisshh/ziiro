import AnimatedSection from "@/components/AnimatedSection";

const Terms = () => {
  return (
    <div className="relative" style={{ zIndex: 1 }}>
      <div className="min-h-screen pt-32 pb-28 px-6">
        <div className="container mx-auto max-w-3xl">

          <AnimatedSection>
            <p className="section-label mb-4">Legal</p>
            <h1 className="display-font text-white mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              TERMS &amp; <span className="gradient-text">CONDITIONS</span>
            </h1>
            <p className="text-white/30 text-xs mb-16 tracking-wide">Effective Date: January 30, 2026</p>
          </AnimatedSection>

          <div className="space-y-12 text-sm text-white/55 leading-relaxed">

            <AnimatedSection>
              <p>
                These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of Ziiro AI and any related services, content, AI systems, communications, and websites (collectively, the &quot;Services&quot;) provided by Ziiro AI (&quot;Ziiro AI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By using the Services, you agree to these Terms. If you do not agree, you must not use the Services.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={60}>
              <h2 className="text-white font-bold text-base mb-4">Use of the Services</h2>
              <p>
                You may use the Services only for lawful purposes and in accordance with these Terms, and you agree not to misuse the Services, attempt to gain unauthorized access, interfere with system performance or security, or use the Services to transmit unlawful, harmful, or infringing content.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <h2 className="text-white font-bold text-base mb-4">AI Services &amp; Outputs</h2>
              <p>
                Any AI-generated outputs, insights, recommendations, reports, or responses provided through Ziiro AI are for informational purposes only, and are based on the data and inputs provided by you or collected through system interactions. These outputs do not constitute professional, legal, financial, or medical advice, and should not be solely relied upon for critical decision-making.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h2 className="text-white font-bold text-base mb-4">Calls, Communication &amp; AI Assistance</h2>
              <p>
                When you interact with Ziiro AI through forms, bookings, or consultations, you may receive automated, AI-assisted, or human-supported communications via email, phone, or SMS, including scheduling, qualification, and follow-ups. Calls and messages may be recorded, transcribed, and analyzed for service improvement and quality assurance, and by engaging with our Services you consent to such processing.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={120}>
              <h2 className="text-white font-bold text-base mb-4">SMS Program Terms</h2>
              <ul className="space-y-3">
                {[
                  "Our SMS program may include transactional and, where permitted, informational or service-related messages from Ziiro AI.",
                  "Message and data rates may apply. Message frequency may vary.",
                  "You may opt out at any time by replying STOP.",
                  "You may request assistance by replying HELP.",
                  "We do not sell or share SMS opt-in data or phone numbers with third parties for marketing purposes.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={140}>
              <h2 className="text-white font-bold text-base mb-4">Intellectual Property</h2>
              <p>
                All content, branding, software, AI systems, models, text, designs, and materials provided through the Services are owned by or licensed to Ziiro AI and are protected by applicable intellectual property laws, and you may not copy, reproduce, modify, distribute, or create derivative works without prior written permission.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={160}>
              <h2 className="text-white font-bold text-base mb-4">Third-Party Services</h2>
              <p>
                The Services may rely on third-party tools and platforms such as hosting, analytics, CRM, communication APIs, and AI infrastructure providers, and we are not responsible for the availability, performance, or practices of such third-party services, which are governed by their own terms and policies.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={180}>
              <h2 className="text-white font-bold text-base mb-4">Disclaimer</h2>
              <p className="uppercase text-white/40 text-xs leading-relaxed tracking-wide">
                The Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied, including but not limited to warranties of accuracy, reliability, merchantability, fitness for a particular purpose, or non-infringement, and we do not guarantee that the Services will be uninterrupted, error-free, or completely secure.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <h2 className="text-white font-bold text-base mb-4">Limitation of Liability</h2>
              <p className="uppercase text-white/40 text-xs leading-relaxed tracking-wide">
                To the maximum extent permitted by law, Ziiro AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from or related to your use of the Services, and our total liability shall not exceed one hundred U.S. dollars (USD $100).
              </p>
            </AnimatedSection>

            <AnimatedSection delay={210}>
              <h2 className="text-white font-bold text-base mb-4">Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Ziiro AI, its affiliates, employees, contractors, and partners from any claims, liabilities, damages, losses, or expenses arising from your use of the Services or violation of these Terms.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={220}>
              <h2 className="text-white font-bold text-base mb-4">Governing Law</h2>
              <p>
                These Terms are governed by the laws of India, without regard to conflict of law principles, and any disputes arising from these Terms shall be subject to the exclusive jurisdiction of courts located in Uttar Pradesh, India.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={230}>
              <h2 className="text-white font-bold text-base mb-4">Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time, and the &quot;Effective Date&quot; above reflects the latest version, and continued use of the Services after updates constitutes acceptance of the revised Terms.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={240}>
              <div className="pt-8 border-t border-white/[0.06]">
                <h2 className="text-white font-bold text-base mb-4">Contact</h2>
                <div className="space-y-1 text-white/45">
                  <p className="text-white/70 font-semibold">Ziiro AI</p>
                  <a href="mailto:govind@ziiro.work" className="text-[#A8B4C8] hover:text-white transition-colors block" style={{ fontFamily: "Inter, sans-serif" }}>
                    govind@ziiro.work
                  </a>
                  <a href="mailto:aniket@ziiro.work" className="text-[#A8B4C8] hover:text-white transition-colors block" style={{ fontFamily: "Inter, sans-serif" }}>
                    aniket@ziiro.work
                  </a>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
