import { AppShell } from "@/components/layout/AppShell";

export default function ConstructionLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
