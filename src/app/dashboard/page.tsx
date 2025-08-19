import DashboardHeader from "@/components/dashboard-header";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function MyNotesPage() {
  return (
    <div>
      <DashboardHeader
        title="My Notes"
        description="Upload and manage your study materials here."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </DashboardHeader>
      <div className="mt-8">
        <FileUpload />
      </div>
       {/* Placeholder for uploaded files list */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold font-headline mb-4">Recent Uploads</h3>
        <div className="p-8 text-center border border-dashed rounded-lg bg-card">
            <p className="text-muted-foreground">No files uploaded yet.</p>
        </div>
      </div>
    </div>
  );
}
