
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


interface Flashcard {
    id: string;
    question: string;
    answer: string;
}

const sampleFlashcards: Flashcard[] = [
    { id: 'q1', question: 'What is the capital of France?', answer: 'Paris' },
    { id: 'q2', question: 'What is 2 + 2?', answer: '4' },
    { id: 'q3', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
];

export default function FlashcardsPage() {
    const [selectedNote, setSelectedNote] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Placeholder for notes
    const notes = [
        { id: 'note_1', title: 'Geography: World Capitals' },
        { id: 'note_2', title: 'Basic Mathematics' },
        { id: 'note_3', title: 'Cellular Biology' },
    ];
    
    const handleGenerate = async () => {
        if (!selectedNote) return;
        setLoading(true);
        setFlashcards([]);
        setCurrentCard(0);
        setIsFlipped(false);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFlashcards(sampleFlashcards);
        setLoading(false);
    };

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCard(prev => (prev + 1) % flashcards.length);
        }, 150);
    }
    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCard(prev => (prev - 1 + flashcards.length) % flashcards.length);
        }, 150);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Flashcards</CardTitle>
                    <CardDescription>Turn your notes into interactive flashcards for effective learning.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-end gap-2">
                        <div className="flex-grow space-y-2">
                            <label>Select a Note to Generate Flashcards</label>
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
                        <Button onClick={handleGenerate} disabled={loading || !selectedNote}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {flashcards.length > 0 && (
                <div className="space-y-4 flex flex-col items-center">
                    <div className="w-full max-w-xl h-64 perspective-1000">
                       <div 
                         className={cn("relative w-full h-full transform-style-preserve-3d transition-transform duration-500", isFlipped && "rotate-y-180")}
                         onClick={() => setIsFlipped(!isFlipped)}
                       >
                           <div className="absolute w-full h-full backface-hidden rounded-lg border bg-card text-card-foreground shadow-lg flex items-center justify-center p-6 text-center">
                               <p className="text-xl font-semibold">{flashcards[currentCard].question}</p>
                           </div>
                           <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg border bg-primary text-primary-foreground shadow-lg flex items-center justify-center p-6 text-center">
                               <p className="text-xl font-semibold">{flashcards[currentCard].answer}</p>
                           </div>
                       </div>
                    </div>

                    <p className="text-muted-foreground">Click card to flip</p>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={prevCard}>
                            <ArrowLeft />
                        </Button>
                        <p className="font-semibold">{currentCard + 1} / {flashcards.length}</p>
                        <Button variant="outline" size="icon" onClick={nextCard}>
                            <ArrowRight />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
