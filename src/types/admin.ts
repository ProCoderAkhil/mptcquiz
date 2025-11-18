export interface Student {
  id: string;
  name: string;
  phone: string;
  className: string;
  quizMark?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizDefinition {
  id: string;
  title: string;
  description: string;
  questionIds: number[];
  perQuestionSeconds: number;
  questionsPerAttempt: number;
  timeLimitSeconds: number;
  allowRetake: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AttemptStatus = "completed" | "incomplete" | "timeout";

export interface QuizAttemptAnswer {
  questionId: number;
  selectedOption: number | null;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  className: string;
  phone: string;
  answers: QuizAttemptAnswer[];
  score: number;
  totalQuestions: number;
  startedAt: string;
  completedAt?: string;
  status: AttemptStatus;
  timeTakenSeconds: number;
}

export interface AdminState {
  students: Student[];
  quizzes: QuizDefinition[];
  attempts: QuizAttempt[];
  activeQuizId?: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

