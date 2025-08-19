import DashboardHeader from "@/components/dashboard-header";
import { TutorChat } from "@/components/tutor-chat";

export default function TutorPage() {
  return (
    <div>
      <DashboardHeader
        title="AI Tutor Chat"
        description="Your personal AI tutor, ready to answer your questions."
      />
      <div className="mt-8">
        <TutorChat />
      </div>
    </div>
  );
}
