import DashboardHeader from "@/components/dashboard-header";
import { Summarizer } from "@/components/summarizer";

export default function SummariesPage() {
  return (
    <div>
      <DashboardHeader
        title="AI Summarizer"
        description="Generate concise summaries from your notes instantly."
      />
      <div className="mt-8">
        <Summarizer />
      </div>
    </div>
  );
}
