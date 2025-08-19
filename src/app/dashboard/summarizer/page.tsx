
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function SummarizerPage() {
    const [selectedNote, setSelectedNote] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    // Placeholder for notes, in a real app this would come from a data source.
    const notes = [
        { id: 'note_1', title: 'Biology Chapter 5: Photosynthesis' },
        { id: 'note_2', title: 'History Lecture: The Roman Empire' },
        { id: 'note_3', title: 'CS 101: Introduction to Algorithms' },
    ];
    
    const handleGenerateSummary = async () => {
        if (!selectedNote) return;
        setLoading(true);
        setSummary('');
        // This is a placeholder for the actual AI call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSummary(`This is a sample summary for the selected note "${notes.find(n => n.id === selectedNote)?.title}". A real AI would provide a detailed summary here based on the note's content.`);
        setLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Summarizer</CardTitle>
                <CardDescription>Generate concise summaries from your notes instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label>Select a Note to Summarize</label>
                    <Select onValueChange={setSelectedNote} value={selectedNote}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select from your notes..." />
                        </SelectTrigger>
                        <SelectContent>
                            {notes.map(note => (
                                <SelectItem key={note.id} value={note.id}>{note.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Button onClick={handleGenerateSummary} disabled={loading || !selectedNote}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Generate Summary'}
                </Button>
                
                {summary && (
                    <Card className="bg-muted">
                        <CardHeader>
                            <CardTitle>Generated Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Textarea readOnly value={summary} className="min-h-[200px] bg-background"/>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
