import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import GlassCard from "@/components/GlassCard";

const plans = [
  {
    name: "Starter",
    price: "$1,500",
    setup: "$1,000",
    badge: "Best for Small Business",
    featured: false,
    features: [
      "1 AI chatbot OR 2 workflow automations",
      "Integration with up to 3 tools",
      "Basic analytics dashboard",
      "Email support (48h response)",
      "Monthly optimization call",
      "3-month minimum commitment",
    ],
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "$2,500",
    setup: "$1,000",
    badge: "Most Popular",
    featured: true,
    features: [
      "1 AI chatbot + 4 workflow automations",
      "Integration with up to 10 tools",
      "Advanced analytics (3 dashboards)",
      "Priority support (24h response)",
      "2 monthly optimization calls",
      "Quarterly strategy session",
      "Content generation (20 pieces/month)",
      "Training for up to 5 team members",
      "6-month minimum commitment",
      "10% discount for annual payment",
    ],
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "$3,000",
    setup: "Custom",
    badge: "For Large Organizations",
    featured: false,
    features: [
      "Unlimited chatbots and workflows",
      "Unlimited tool integrations",
      "Custom AI model development",
      "Unlimited dashboards & analytics",
      "24/7 priority support",
      "Dedicated account manager",
      "Weekly optimization",
      "Monthly strategy sessions",
      "Custom reporting",
      "Unlimited team training",
      "SLA guarantees",
      "15% discount for annual payment",
    ],
    cta: "Contact Sales",
  },
];

const addons = [
  { name: "Extra workflow", price: "+$500/mo" },
  { name: "Additional dashboard", price: "+$400/mo" },
  { name: "Training session", price: "$200" },
  { name: "Emergency support", price: "$100/hr" },
];

const faqs = [
  { q: "Can I upgrade later?", a: "Absolutely! You can upgrade your plan at any time. We'll prorate the difference." },
  { q: "What's included in setup?", a: "Setup includes integration configuration, custom workflow design, testing, and initial training for your team." },
  { q: "Do you offer refunds?", a: "We offer a satisfaction guarantee within the first 30 days. If you're not happy, we'll work with you to make it right." },
  { q: "How long are contracts?", a: "Minimum commitments vary by plan: Starter (3 months), Growth (6 months), Enterprise (12 months)." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, ACH transfers, and wire transfers for enterprise accounts." },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <div className="container mx-auto">
        <AnimatedSection>
          <h1 className="text-4xl md:text-6xl font-black text-center mb-4 gradient-text">
            Transparent Pricing
          </h1>
          <p className="text-center text-muted-alpha max-w-2xl mx-auto mb-16">
            Choose the plan that fits your business needs.
          </p>
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-20">
          {plans.map((p, i) => (
            <AnimatedSection key={p.name} delay={i * 150}>
              <div
                className={`glass p-8 relative ${
                  p.featured
                    ? "ring-2 ring-accent lg:scale-105 lg:-my-4"
                    : ""
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-xs font-semibold px-4 py-1 rounded-full ${
                        p.featured
                          ? "btn-primary-gradient !py-1 !px-4"
                          : "glass text-muted-alpha"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>
                )}
                <div className="text-center mt-4 mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{p.name}</h3>
                  <div className="text-4xl font-black gradient-text">{p.price}</div>
                  <span className="text-xs text-muted-alpha">/month · Setup: {p.setup}</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm text-secondary-alpha flex items-start gap-2">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block text-center w-full ${
                    p.featured ? "btn-primary-gradient" : "btn-glass"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Add-ons */}
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-black text-center mb-8 gradient-text">Add-ons</h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {addons.map((a, i) => (
            <AnimatedSection key={a.name} delay={i * 80}>
              <GlassCard className="text-center">
                <h4 className="text-sm font-semibold text-foreground mb-1">{a.name}</h4>
                <span className="text-xs gradient-text font-bold">{a.price}</span>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>

        {/* FAQ */}
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-black text-center mb-8 gradient-text">
            Frequently Asked Questions
          </h2>
        </AnimatedSection>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <AnimatedSection key={i} delay={i * 60}>
              <button
                className="glass w-full text-left p-5 transition-all duration-200 hover:bg-[hsl(var(--glass-bg-hover))]"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">{f.q}</span>
                  <span className="text-accent ml-4">{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && (
                  <p className="text-sm text-muted-alpha mt-3">{f.a}</p>
                )}
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
