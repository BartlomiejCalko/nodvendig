import { metrics, metricsFocus } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export const Metrics = () => (
  <Section id="metrics" tone="paper" className="!py-0">
    <Container>
      <div className="grid grid-cols-1 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Reveal
            inView
            delay={index * 0.08}
            key={metric.label}
            className={cn(
              "px-0 py-12 sm:px-8",
              index > 0 && "sm:border-l sm:border-line",
            )}
          >
            <p className="text-display-l font-medium">{metric.value}</p>
            <p className="mt-4 text-steel">{metric.label}</p>
            {metric.value === "1" ? (
              <p className="mt-2 text-heading-3 font-medium">{metricsFocus}</p>
            ) : null}
          </Reveal>
        ))}
      </div>
    </Container>
  </Section>
);
