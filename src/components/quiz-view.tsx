"use client";

import type { MultipleChoiceQuestion, ShortAnswerQuestion } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "./ui/progress";

interface QuizViewProps {
  multipleChoice: MultipleChoiceQuestion[];
  shortAnswer: ShortAnswerQuestion[];
}

type AnswerState = { [questionIndex: string]: string };
type SubmissionState = { [questionIndex: string]: boolean | null }; // true: correct, false: incorrect, null: not submitted

export function QuizView({ multipleChoice, shortAnswer }: QuizViewProps) {
  const allQuestions = [...multipleChoice, ...shortAnswer];
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState<SubmissionState>({});
  const [score, setScore] = useState<number | null>(null);

  const handleMcqChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({ ...prev, [`mcq-${questionIndex}`]: value }));
  };

  const handleSaqChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({ ...prev, [`saq-${questionIndex}`]: value }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    const newSubmitted: SubmissionState = {};

    multipleChoice.forEach((q, i) => {
      const isCorrect = answers[`mcq-${i}`] === q.answer;
      if (isCorrect) correctAnswers++;
      newSubmitted[`mcq-${i}`] = isCorrect;
    });

    shortAnswer.forEach((q, i) => {
       const isCorrect = answers[`saq-${i}`]?.trim().toLowerCase() === q.answer.trim().toLowerCase();
       if(isCorrect) correctAnswers++;
       newSubmitted[`saq-${i}`] = isCorrect;
    });

    setSubmitted(newSubmitted);
    setScore(Math.round((correctAnswers / allQuestions.length) * 100));
  };
  
  const resetQuiz = () => {
    setAnswers({});
    setSubmitted({});
    setScore(null);
  };

  const getBorderColor = (isCorrect: boolean | null) => {
    if (isCorrect === true) return "border-green-500";
    if (isCorrect === false) return "border-red-500";
    return "";
  };

  return (
    <div className="space-y-8">
      {score !== null && (
        <Card className="mb-8 bg-secondary">
          <CardHeader>
            <CardTitle className="font-headline text-center">Quiz Complete!</CardTitle>
            <CardDescription className="text-center">You scored</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
             <div className="text-5xl font-bold text-primary">{score}%</div>
             <Progress value={score} className="w-full max-w-sm" />
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={resetQuiz}>Try Again</Button>
          </CardFooter>
        </Card>
      )}

      <h3 className="text-xl font-bold font-headline">Multiple Choice</h3>
      {multipleChoice.map((q, i) => (
        <Card key={`mcq-${i}`} className={getBorderColor(submitted[`mcq-${i}`])}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{i + 1}. {q.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(value) => handleMcqChange(i, value)} value={answers[`mcq-${i}`]} disabled={score !== null}>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`mcq-${i}-opt-${optIndex}`} />
                  <Label htmlFor={`mcq-${i}-opt-${optIndex}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
           {submitted[`mcq-${i}`] !== undefined && (
              <CardFooter className="flex items-center gap-2 text-sm">
                {submitted[`mcq-${i}`] ? <CheckCircle className="text-green-500 h-4 w-4" /> : <XCircle className="text-red-500 h-4 w-4" />}
                Correct Answer: {q.answer}
              </CardFooter>
            )}
        </Card>
      ))}

      <h3 className="text-xl font-bold font-headline mt-12">Short Answer</h3>
      {shortAnswer.map((q, i) => (
        <Card key={`saq-${i}`} className={getBorderColor(submitted[`saq-${i}`])}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{multipleChoice.length + i + 1}. {q.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Your answer..." 
              onChange={(e) => handleSaqChange(i, e.target.value)}
              value={answers[`saq-${i}`] || ""}
              disabled={score !== null}
            />
          </CardContent>
          {submitted[`saq-${i}`] !== undefined && (
              <CardFooter className="flex items-center gap-2 text-sm">
                {submitted[`saq-${i}`] ? <CheckCircle className="text-green-500 h-4 w-4" /> : <XCircle className="text-red-500 h-4 w-4" />}
                Correct Answer: {q.answer}
              </CardFooter>
            )}
        </Card>
      ))}
      
      {score === null && (
        <div className="flex justify-end mt-8">
            <Button onClick={handleSubmit} size="lg">Submit Quiz</Button>
        </div>
      )}
    </div>
  );
}
