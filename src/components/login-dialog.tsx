
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Script from 'next/script';


export function LoginDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            Register for Webinar
          </DialogTitle>
          <DialogDescription className="text-center">
            Please fill out the form below to register.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className="visme_d"
          data-title="Webinar Registration Form"
          data-url="g7ddqxx0-untitled-project?fullPage=true"
          data-domain="forms"
          data-full-page="true" 
          data-min-height="500px"
          data-form-id="133190">
        </div>
        
        <Script 
          src="https://static-bundles.visme.co/forms/vismeforms-embed.js" 
          strategy="lazyOnload"
        />
        
      </DialogContent>
    </Dialog>
  );
}
