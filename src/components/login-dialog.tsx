
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Script from 'next/script';


export function LoginDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-none w-auto h-auto bg-transparent border-none shadow-none">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', width: '80vw' }}>
            <div 
              className="visme_d"
              style={{ width: '100%', height: '100%' }}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
