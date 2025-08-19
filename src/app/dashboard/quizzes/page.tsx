import DashboardHeader from "@/components/dashboard-header";
import { QuizGenerator } from "@/components/quiz-generator";

export default function QuizzesPage() {
  return (
    <div>
      <DashboardHeader
        title="AI Quiz Generator"
        description="Test your knowledge with auto-generated quizzes."
      />
      <div className="mt-8">
        <QuizGenerator />
      </div>
    </div>
  );
}
