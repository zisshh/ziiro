import { useEffect, useRef, useState } from "react";

interface StatBoxProps {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

const StatBox = ({ value, label, suffix = "", prefix = "" }: StatBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
          const duration = 2000;
          const steps = 60;
          const increment = numericValue / steps;
          let current = 0;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            current += increment;
            if (step >= steps) {
              setDisplayed(value);
              clearInterval(timer);
            } else {
              setDisplayed(
                value.includes(".")
                  ? current.toFixed(1)
                  : Math.floor(current).toLocaleString()
              );
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="glass-hover p-6 text-center">
      <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
        {prefix}{displayed}{suffix}
      </div>
      <div className="text-muted-alpha text-sm font-medium">{label}</div>
    </div>
  );
};

export default StatBox;
