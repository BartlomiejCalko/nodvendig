import type { Metadata } from "next";
import { Gateway } from "@/components/gateway/Gateway";

export const metadata: Metadata = {
  title: {
    absolute: "Nødvendig | Data Center Construction & Telecom — Norway",
  },
  description:
    "Nødvendig builds the physical layer of the digital world: data center construction and telecom infrastructure — fiber, structured cabling and cable routes — across Norway.",
};

export default function GatewayPage() {
  return <Gateway />;
}
