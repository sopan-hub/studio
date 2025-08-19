
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function GeneralSearchPage() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setResponse('');
        // This is a placeholder for the actual AI call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponse(`This is a sample response to your question: "${query}". Integrating a real AI model like Gemini would provide a meaningful answer here.`);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
             <Card className="w-full">
                <CardHeader>
                    <CardTitle>AI General Search</CardTitle>
                    <CardDescription>Ask your AI tutor anything...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="What is the powerhouse of the cell?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Get Answer'}
                        </Button>
                    </div>
                    {response && (
                        <Card className="bg-muted">
                            <CardContent className="p-4">
                               <p>{response}</p>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
