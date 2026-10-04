import { notFound } from "next/navigation";
import BlackHoleDive from "../../../../../components/BlackHoleDive";
import { issueFor } from "../../../../../lib/blackHole";

export function generateMetadata({ params }) {
  const issue = issueFor(params.issue);
  if (!issue) return {};
  return { title: `${issue.title} · The Black Hole No. ${issue.number}`, description: issue.subtitle };
}

export default function BlackHoleIssuePage({ params }) {
  const issue = issueFor(params.issue);
  if (!issue) notFound();
  return <BlackHoleDive issue={issue} />;
}
