
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BotMessageSquare } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8">
            <Card className="animate-blast-in" style={{animationDelay: '100ms'}}>
                 <CardHeader>
                    <div className="flex items-center gap-4">
                        <BotMessageSquare className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>AI General Search</CardTitle>
                            <CardDescription>Have a question? Ask your AI tutor anything.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input placeholder="Ask about the Krebs cycle, the causes of World War 1, or how to solve a quadratic equation..." />
                        <Button>Get Answer</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="animate-blast-in" style={{animationDelay: '200ms'}}>
                <CardHeader>
                    <CardTitle>My Notes</CardTitle>
                    <CardDescription>All your study materials in one place. Add notes to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <p>Start by adding your study materials here.</p>
                        {/* Add upload components here */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
