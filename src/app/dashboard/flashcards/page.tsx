import DashboardHeader from "@/components/dashboard-header";
import { FlashcardGenerator } from "@/components/flashcard-generator";

export default function FlashcardsPage() {
  return (
    <div>
      <DashboardHeader
        title="AI Flashcards"
        description="Turn your notes into interactive flashcards for effective learning."
      />
      <div className="mt-8">
        <FlashcardGenerator />
      </div>
    </div>
  );
}
