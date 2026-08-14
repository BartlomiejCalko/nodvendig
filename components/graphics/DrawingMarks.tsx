type DrawingMarksProps = {
  className?: string;
};

export const DrawingMarks = ({ className }: DrawingMarksProps) => (
  <div
    aria-hidden="true"
    className={className}
  >
    <div className="pointer-events-none absolute inset-3 hidden border border-line md:inset-4 md:block lg:inset-5" />
    <span className="absolute top-3 left-3 hidden h-3 w-3 border-t border-l border-carbon/40 md:block lg:top-5 lg:left-5" />
    <span className="absolute top-3 right-3 hidden h-3 w-3 border-t border-r border-carbon/40 md:block lg:top-5 lg:right-5" />
    <span className="absolute bottom-3 left-3 hidden h-3 w-3 border-b border-l border-carbon/40 md:block lg:bottom-5 lg:left-5" />
    <span className="absolute right-3 bottom-3 hidden h-3 w-3 border-r border-b border-carbon/40 md:block lg:right-5 lg:bottom-5" />
  </div>
);
