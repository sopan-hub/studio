
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotMessageSquare, Loader2, User } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function TutorChatPage() {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        setTimeout(() => {
            const assistantMessage: Message = { role: 'assistant', content: "This is a response from your AI tutor based on your study materials. It's designed to help clarify concepts and answer your specific questions." };
            setMessages(prev => [...prev, userMessage, assistantMessage]);
            setLoading(false);
        }, 1500);
    };

  return (
    <Card className="w-full h-[calc(100vh-10rem)] flex flex-col animate-blast-in">
        <CardHeader>
            <div className="flex items-center gap-4">
                <BotMessageSquare className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>AI Tutor Chat</CardTitle>
                    <CardDescription>Your personal AI tutor, trained on your notes.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                 <div className="flex flex-col gap-4">
                    {messages.map((message, index) => (
                        <div key={index} className={cn(
                            "flex items-start gap-3",
                            message.role === 'user' ? "justify-end" : "justify-start"
                        )}>
                            {message.role === 'assistant' && (
                                <Avatar className="bg-primary text-primary-foreground">
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                            )}
                             <div className={cn(
                                "max-w-md p-3 rounded-lg",
                                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                             )}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                                <Avatar>
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {loading && (
                         <div className="flex items-start gap-3 justify-start">
                             <Avatar className="bg-primary text-primary-foreground">
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                             <div className="max-w-md p-3 rounded-lg bg-muted">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        </div>
                    )}
                 </div>
            </ScrollArea>
        </CardContent>
        <CardFooter>
            <div className="flex w-full gap-2">
                <Input 
                    placeholder="Ask a follow-up question..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                />
                <Button onClick={handleSend} disabled={loading}>Send</Button>
            </div>
        </CardFooter>
    </Card>
  );
}
