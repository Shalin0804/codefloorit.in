import { useSeo } from "../lib/seo";
import { Btn, PageHero } from "../components/ui";

export default function NotFound() {
  useSeo({
    title: "Page not found",
    description: "The page you are looking for does not exist or has moved.",
    path: "/404",
    noindex: true,
  });

  return (
    <PageHero eyebrow="404" title="This page could not be found" sub="The page you are looking for does not exist or has moved.">
      <div className="actions">
        <Btn to="/" arrow>Back to home</Btn>
        <Btn to="/contact" variant="outline">Contact us</Btn>
      </div>
    </PageHero>
  );
}
