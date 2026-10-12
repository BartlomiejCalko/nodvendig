import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

type TextTextureOptions = {
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  mono?: boolean;
  letterSpacing?: number;
  padding?: number;
};

export type TextTexture = {
  texture: CanvasTexture;
  aspect: number;
};

const readFontFamily = (mono: boolean) => {
  const variable = mono ? "--font-geist-mono" : "--font-geist-sans";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || (mono ? "ui-monospace, monospace" : "system-ui, sans-serif");
};

/** Renders a single line of text to a canvas texture using the page fonts. */
export const createTextTexture = (
  text: string,
  {
    fontSize = 64,
    fontWeight = 500,
    color = "#ffffff",
    mono = false,
    letterSpacing = 0,
    padding = 8,
  }: TextTextureOptions = {},
): TextTexture => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("2D canvas is not available");
  }

  const font = `${fontWeight} ${fontSize}px ${readFontFamily(mono)}`;
  context.font = font;
  const spacing = letterSpacing * fontSize;
  const width =
    Math.ceil(context.measureText(text).width + spacing * text.length) +
    padding * 2;
  const height = Math.ceil(fontSize * 1.3) + padding * 2;

  canvas.width = width;
  canvas.height = height;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";

  if ("letterSpacing" in context) {
    (context as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      `${spacing}px`;
  }

  context.fillText(text, padding, height / 2);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;

  return { texture, aspect: width / height };
};
