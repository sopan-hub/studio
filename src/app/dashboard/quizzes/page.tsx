
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    answer: string;
}

const sampleQuiz: QuizQuestion[] = [
    { id: 'q1', question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 'Carbon Dioxide' },
    { id: 'q2', question: 'Who wrote "Hamlet"?', options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Mark Twain'], answer: 'William Shakespeare' },
    { id: 'q3', question: 'What is the largest planet in our solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], answer: 'Jupiter' },
];

export default function QuizzesPage() {
    const [selectedNote, setSelectedNote] = useState('');
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [score, setScore] = useState<number | null>(null);

    const notes = [
        { id: 'note_1', title: 'General Science Knowledge' },
        { id: 'note_2', title: 'Classic Literature' },
        { id: 'note_3', title: 'Solar System Facts' },
    ];
    
    const handleGenerate = async () => {
        if (!selectedNote) return;
        setLoading(true);
        setQuiz([]);
        setUserAnswers({});
        setScore(null);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setQuiz(sampleQuiz);
        setLoading(false);
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setUserAnswers(prev => ({...prev, [questionId]: value}));
    };

    const handleSubmitQuiz = () => {
        let correctAnswers = 0;
        quiz.forEach(q => {
            if (userAnswers[q.id] === q.answer) {
                correctAnswers++;
            }
        });
        setScore((correctAnswers / quiz.length) * 100);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Quiz Generator</CardTitle>
                    <CardDescription>Test your knowledge with auto-generated quizzes from your notes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-end gap-2">
                        <div className="flex-grow space-y-2">
                            <label>Select a Note to Generate a Quiz</label>
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
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate Quiz'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {quiz.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Time!</CardTitle>
                        {score !== null && (
                             <CardDescription>
                                Your Score: <span className="font-bold text-primary">{score.toFixed(0)}%</span>
                             </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {quiz.map((q, index) => (
                            <div key={q.id}>
                                <p className="font-semibold">{index + 1}. {q.question}</p>
                                <RadioGroup 
                                    className="mt-2 space-y-2"
                                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                                    disabled={score !== null}
                                >
                                    {q.options.map(option => (
                                        <div key={option} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                                            <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                 {score !== null && (
                                    <p className={`text-sm mt-2 ${userAnswers[q.id] === q.answer ? 'text-green-500' : 'text-red-500'}`}>
                                        Correct answer: {q.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                        <Button onClick={handleSubmitQuiz} disabled={score !== null}>
                            Submit Quiz
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
