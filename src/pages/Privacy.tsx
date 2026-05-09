import AnimatedSection from "@/components/AnimatedSection";

const Privacy = () => {
  return (
    <div className="relative" style={{ zIndex: 1 }}>
      <div className="min-h-screen pt-32 pb-28 px-6">
        <div className="container mx-auto max-w-3xl">

          <AnimatedSection>
            <p className="section-label mb-4">Legal</p>
            <h1 className="display-font text-white mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              PRIVACY <span className="gradient-text">POLICY</span>
            </h1>
            <p className="text-white/30 text-xs mb-16 tracking-wide">Effective Date: January 2026</p>
          </AnimatedSection>

          <div className="space-y-12 text-sm text-white/55 leading-relaxed">

            <AnimatedSection>
              <p>
                Ziiro AI (&quot;Ziiro AI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy explains what information we collect when you visit our website, submit a form, book a call, or otherwise interact with us, and how we use, share, and protect that information.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={60}>
              <h2 className="text-white font-bold text-base mb-4">Information We Collect</h2>
              <p className="mb-4">We collect the following categories of information:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                  <span><strong className="text-white/80">Information you provide:</strong> name, email address, phone number, business name, industry, company size, use case details, and any free-text responses you submit through forms on our website or services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                  <span><strong className="text-white/80">Communications:</strong> the content of messages, emails, SMS, phone calls, voicemails, and AI-assisted qualification or support conversations, including transcripts where applicable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                  <span><strong className="text-white/80">Usage data:</strong> pages visited, referring URLs, device and browser information, IP address, and similar analytics data collected through cookies and standard web technologies.</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <h2 className="text-white font-bold text-base mb-4">How We Use Your Information</h2>
              <ul className="space-y-2">
                {[
                  "To provide, operate, and maintain our services",
                  "To respond to inquiries and schedule or conduct calls and demos",
                  "To deliver AI-generated insights, reports, or services you request",
                  "To send transactional, service-related, or marketing communications where permitted by law",
                  "To improve our website, systems, and user experience",
                  "To analyze usage trends and performance",
                  "To comply with legal obligations and enforce our terms",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h2 className="text-white font-bold text-base mb-4">SMS &amp; Phone Communications</h2>
              <p>
                If you provide your phone number, you consent to receive SMS messages and calls from Ziiro AI related to your inquiries, bookings, or services, including transactional and informational messages. Message and data rates may apply. Message frequency may vary. Reply STOP to opt out of messages and HELP for assistance. Phone numbers and SMS consent data are never sold or shared with third parties for their own marketing purposes.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={120}>
              <h2 className="text-white font-bold text-base mb-4">How We Share Information</h2>
              <p className="mb-4">We share information only as needed to operate our business:</p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                  <span><strong className="text-white/80">Service providers:</strong> email services, CRM platforms, analytics tools, hosting providers, scheduling tools, SMS and voice providers, and AI or automation tools, all of which process data on our behalf.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                  <span><strong className="text-white/80">Legal compliance:</strong> when required by law, regulation, subpoena, or legal process.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#A8B4C8] shrink-0 mt-0.5">&#10003;</span>
                  <span><strong className="text-white/80">Business transfers:</strong> in connection with mergers, acquisitions, or sale of assets.</span>
                </li>
              </ul>
              <p className="text-white/70 font-semibold">We do not sell your personal information.</p>
            </AnimatedSection>

            <AnimatedSection delay={140}>
              <h2 className="text-white font-bold text-base mb-4">Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your data at any time by contacting{" "}
                <a href="mailto:govind@ziiro.work" className="text-[#A8B4C8] hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>govind@ziiro.work</a>.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={160}>
              <h2 className="text-white font-bold text-base mb-4">Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal information, and to object to or restrict certain processing. To exercise these rights, contact us at the email below.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={180}>
              <h2 className="text-white font-bold text-base mb-4">Children</h2>
              <p>
                Our services are not directed to children under 13, and we do not knowingly collect personal information from them.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <h2 className="text-white font-bold text-base mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The &quot;Effective Date&quot; above indicates when it was last revised. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={220}>
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

export default Privacy;
