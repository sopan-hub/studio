"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Chrome } from "lucide-react";

export function LoginDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onOpenChange(false);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary neon-glow">Sign In Required</DialogTitle>
          <DialogDescription className="text-center">
            Please sign in to access this feature.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={loading}
            className="w-full font-bold neon-glow-button"
            size="lg"
          >
            <Chrome className="mr-2" />
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
