import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

type GraphicFrameProps = {
  label: string;
  ratio?: string;
  tone?: "light" | "dark";
  className?: string;
  image?: StaticImageData | string;
  alt?: string;
  sizes?: string;
};

export const GraphicFrame = ({
  label,
  ratio = "4 / 3",
  tone = "light",
  className,
  image,
  alt = "",
  sizes = "(min-width: 1024px) 42vw, 100vw",
}: GraphicFrameProps) => (
  <div
    className={cn(
      "relative w-full overflow-hidden border",
      tone === "dark" ? "border-line-dark" : "border-line",
      className,
    )}
    style={{ aspectRatio: ratio }}
    aria-hidden={image ? undefined : true}
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          tone === "dark"
            ? `linear-gradient(to right, rgb(242 239 231 / 0.08) 1px, transparent 1px),
               linear-gradient(to bottom, rgb(242 239 231 / 0.08) 1px, transparent 1px)`
            : `linear-gradient(to right, rgb(28 28 26 / 0.1) 1px, transparent 1px),
               linear-gradient(to bottom, rgb(28 28 26 / 0.1) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
    {image ? (
      <div className="absolute inset-10 bottom-16 overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover saturate-[0.92]"
        />
      </div>
    ) : null}
    <span
      className={cn(
        "technical-label absolute bottom-4 left-4",
        tone === "dark" ? "text-ivory/55" : "text-steel",
      )}
    >
      {label}
    </span>
  </div>
);
