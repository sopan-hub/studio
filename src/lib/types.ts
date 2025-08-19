export type Flashcard = {
  question: string;
  answer: string;
};

export type MultipleChoiceQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type ShortAnswerQuestion = {
  question: string;
  answer: string;
};

export type Quiz = {
  multipleChoice: MultipleChoiceQuestion[];
  shortAnswer: ShortAnswerQuestion[];
};
