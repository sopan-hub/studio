
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from 'lucide-react';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const quizData = {
    title: "History of Ancient Rome Quiz",
    questions: [
        {
            question: "Who was the first Emperor of Rome?",
            options: ["Julius Caesar", "Augustus", "Nero", "Constantine"],
            answer: "Augustus"
        },
        {
            question: "In what year did the Western Roman Empire fall?",
            options: ["410 AD", "476 AD", "330 AD", "1453 AD"],
            answer: "476 AD"
        },
        {
            question: "What was the primary language of the Roman Empire?",
            options: ["Greek", "Etruscan", "Latin", "Italian"],
            answer: "Latin"
        }
    ]
};

export default function QuizzesPage() {
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<any>(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});

    const handleGenerate = () => {
        setLoading(true);
        setSubmitted(false);
        setQuiz(null);
        setUserAnswers({});
        setScore(0);
        setTimeout(() => {
            setQuiz(quizData);
            setLoading(false);
        }, 2000);
    };

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setUserAnswers(prev => ({...prev, [questionIndex]: answer}));
    };
    
    const handleSubmit = () => {
        let correctAnswers = 0;
        quiz.questions.forEach((q: any, index: number) => {
            if (userAnswers[index] === q.answer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        setSubmitted(true);
    };

  return (
    <div className="flex flex-col gap-8 animate-blast-in">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>AI Quiz Generator</CardTitle>
                        <CardDescription>Test your knowledge with auto-generated quizzes from your notes.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a note to generate a quiz from..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="note1">Psychology 101 - Lecture 3</SelectItem>
                        <SelectItem value="note2">History of Ancient Rome - Chapter 1</SelectItem>
                        <SelectItem value="note3">Biology - Cell Structures</SelectItem>
                    </SelectContent>
                </Select>
                 <Button onClick={handleGenerate} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Generate Quiz"}
                </Button>
            </CardContent>
        </Card>

        {loading && (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {quiz && (
            <Card>
                <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    {submitted && <CardDescription>You scored {score} out of {quiz.questions.length}!</CardDescription>}
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {quiz.questions.map((q: any, index: number) => (
                        <div key={index}>
                            <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                            <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} disabled={submitted}>
                                {q.options.map((option: string, optionIndex: number) => {
                                    const isCorrect = submitted && option === q.answer;
                                    const isSelected = userAnswers[index] === option;
                                    const isIncorrect = submitted && isSelected && option !== q.answer;

                                    return (
                                        <div key={optionIndex} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                                            <Label htmlFor={`q${index}-o${optionIndex}`} className={cn(
                                                isCorrect && "text-green-500 font-bold",
                                                isIncorrect && "text-red-500 line-through"
                                            )}>{option}</Label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        </div>
                    ))}
                    {!submitted ? (
                         <Button onClick={handleSubmit}>Submit Quiz</Button>
                    ) : (
                        <Button onClick={handleGenerate}>Try a New Quiz</Button>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
