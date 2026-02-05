import Hero from "@/components/Hero";
import PropertyGrid from "@/components/PropertyGrid";
import { properties } from "@/data/properties";

export default function Home() {
  return (
    <>
      <Hero />
      <PropertyGrid properties={properties} />
    </>
  );
}
