import DashboardHeader from "@/components/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function TutorPage() {
  return (
    <div>
      <DashboardHeader
        title="AI Tutor Chat"
        description="Your personal AI tutor, trained on your notes."
      />
      <div className="mt-8">
        <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed">
            <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-secondary p-4 rounded-full">
                    <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-headline mt-4">Coming Soon!</h2>
                <p className="text-muted-foreground max-w-md">
                    We're hard at work building an interactive chat experience to help you study more effectively. Stay tuned!
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
