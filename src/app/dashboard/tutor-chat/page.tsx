
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';


interface Message {
    sender: 'user' | 'bot';
    text: string;
}

export default function TutorChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setMessages([...newMessages, { sender: 'bot', text: `This is a simulated AI response to "${input}". I am trained on your uploaded study materials.` }]);
        setLoading(false);
    };

    return (
        <Card className="h-[calc(100vh-100px)] flex flex-col">
            <CardHeader>
                <CardTitle>AI Tutor Chat</CardTitle>
                <CardDescription>Your personal AI tutor, ready to answer questions based on your notes.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <ScrollArea className="flex-grow h-0 pr-4">
                   <div className="space-y-4">
                        {messages.map((msg, index) => (
                           <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                               {msg.sender === 'bot' && (
                                   <Avatar className="h-8 w-8">
                                       <AvatarFallback><Bot/></AvatarFallback>
                                   </Avatar>
                               )}
                               <div className={`rounded-lg px-4 py-2 max-w-[75%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                   <p>{msg.text}</p>
                               </div>
                                {msg.sender === 'user' && (
                                   <Avatar className="h-8 w-8">
                                       <AvatarFallback>{user?.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                                   </Avatar>
                               )}
                           </div>
                        ))}
                        {loading && (
                             <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot/></AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin"/>
                                </div>
                            </div>
                        )}
                   </div>
                </ScrollArea>
                <div className="mt-4 flex gap-2">
                    <Input 
                        placeholder="Ask a question about your notes..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={loading}
                    />
                    <Button onClick={handleSendMessage} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Send'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
