import AnimatedSection from "@/components/AnimatedSection";
import GlassCard from "@/components/GlassCard";

const steps = [
  { num: "01", title: "Discovery Call", time: "Free · 30–45 min", desc: "We learn your business, pain points, and goals. No pitch, just listening." },
  { num: "02", title: "Assessment & Strategy", time: "1–2 weeks", desc: "We audit your processes and design a laser-focused AI automation roadmap." },
  { num: "03", title: "Design & Planning", time: "1–2 weeks", desc: "Detailed technical architecture and solution planning — no surprises later." },
  { num: "04", title: "Development & Testing", time: "2–6 weeks", desc: "We build, test relentlessly, and refine until everything runs perfectly." },
  { num: "05", title: "Deployment", time: "1–2 weeks", desc: "Seamless rollout with zero downtime, full monitoring, and handoff support." },
  { num: "06", title: "Training & Support", time: "Ongoing", desc: "Comprehensive team training and continuous optimisation as you scale." },
];

const values = [
  { icon: "🔬", title: "Innovation First", desc: "We push the boundary of what AI can do for your business — every engagement." },
  { icon: "📈", title: "Client Success", desc: "Your ROI is our scoreboard. We don't win unless you win." },
  { icon: "🔍", title: "Transparency", desc: "Clear timelines, honest pricing, and no black-box solutions." },
];

const industries = ["E-commerce", "Real Estate", "Healthcare", "Finance", "SaaS", "Professional Services"];

const About = () => {
  return (
    <div className="relative" style={{ zIndex: 1 }}>
      <div className="min-h-screen pt-32 pb-28 px-6">
        <div className="container mx-auto">

          <AnimatedSection>
            <p className="section-label text-center">Who we are</p>
            <h1
              className="display-font text-center mb-4 text-white"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
            >
              ABOUT <span className="gradient-text">ZIIRO</span>
            </h1>
            <p className="text-center text-white/45 max-w-2xl mx-auto mb-20">
              We're a team of AI engineers and automation specialists on a mission to make intelligent automation accessible to every business — not just the Fortune 500.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-24">
            <AnimatedSection>
              <GlassCard hover={false} className="h-full">
                <p className="section-label mb-4">Our Mission</p>
                <p className="text-white/65 leading-relaxed mb-6">
                  To democratize AI automation and empower businesses of all sizes to operate at peak efficiency. We combine deep technical expertise with business acumen to deliver solutions that generate real, measurable ROI.
                </p>
                <div
                  className="glass rounded-xl p-5"
                  style={{ borderColor: "rgba(160,168,196,0.15)", background: "rgba(160,168,196,0.04)" }}
                >
                  <p className="text-[#A8B4C8] font-semibold text-sm">
                    "Automating Tomorrow, Today."
                  </p>
                </div>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="flex flex-col gap-4 h-full">
                {values.map((v) => (
                  <GlassCard key={v.title} hover={false} className="flex-1">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{v.icon}</span>
                      <div>
                        <h3 className="font-bold text-white mb-1">{v.title}</h3>
                        <p className="text-white/50 text-sm">{v.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <p className="section-label text-center">How we work</p>
            <h2
              className="display-font text-center mb-16 text-white"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
            >
              OUR <span className="gradient-text">PROCESS</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
            {steps.map((s, i) => (
              <AnimatedSection key={s.num} delay={i * 80}>
                <div className="glass rounded-xl p-7 h-full relative overflow-hidden">
                  <div
                    className="display-font text-8xl absolute -top-4 -right-2 select-none"
                    style={{ color: "rgba(255,255,255,0.03)", lineHeight: 1 }}
                  >
                    {s.num}
                  </div>
                  <div className="display-font text-5xl gradient-text mb-3 leading-none">{s.num}</div>
                  <h3 className="font-bold text-white mb-1">{s.title}</h3>
                  <span className="text-xs text-[#A8B4C8] font-semibold tracking-wide block mb-3">{s.time}</span>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <p className="section-label text-center mb-6">Industries we serve</p>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((ind) => (
                <span key={ind} className="glass px-6 py-2.5 rounded-full text-sm text-white/65 font-medium">
                  {ind}
                </span>
              ))}
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  );
};

export default About;
