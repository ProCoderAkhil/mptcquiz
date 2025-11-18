import { AdminState, QuizAttempt, QuizDefinition, Student } from "@/types/admin";
import { questionBank } from "@/data/questions";

const STORAGE_KEY = "mptcquiz-admin-state";

type Listener = () => void;

const listeners = new Set<Listener>();

const now = () => new Date().toISOString();

const defaultQuiz: QuizDefinition = {
  id: "quiz-default",
  title: "Students Quiz Competition",
  description: "Answer 5 curated questions in under three minutes.",
  questionIds: questionBank.map((q) => q.id),
  perQuestionSeconds: 36,
  questionsPerAttempt: 5,
  timeLimitSeconds: 3 * 60,
  allowRetake: true,
  isActive: true,
  createdAt: now(),
  updatedAt: now(),
};

const defaultState: AdminState = {
  students: [],
  quizzes: [defaultQuiz],
  attempts: [],
  activeQuizId: defaultQuiz.id,
};

function loadState(): AdminState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored) as AdminState;
    return {
      ...defaultState,
      ...parsed,
      quizzes: (parsed.quizzes ?? []).map((quiz) => ({
        ...quiz,
        questionsPerAttempt: quiz.questionsPerAttempt ?? quiz.questionIds.length,
        timeLimitSeconds:
          quiz.timeLimitSeconds ??
          (quiz.questionsPerAttempt ?? quiz.questionIds.length) * quiz.perQuestionSeconds,
      })),
      activeQuizId: parsed.activeQuizId ?? defaultState.activeQuizId,
    };
  } catch (error) {
    console.error("Failed to load admin state", error);
    return defaultState;
  }
}

let state: AdminState = loadState();

function persist(nextState: AdminState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function setState(updater: (current: AdminState) => AdminState) {
  state = updater(state);
  persist(state);
  listeners.forEach((listener) => listener());
}

export const adminStore = {
  getState: () => state,
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  addStudent(student: Omit<Student, "id" | "createdAt" | "updatedAt">) {
    const timestamp = now();
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setState((current) => ({
      ...current,
      students: [...current.students, newStudent],
    }));

    return newStudent;
  },
  updateStudent(id: string, updates: Partial<Student>) {
    setState((current) => ({
      ...current,
      students: current.students.map((student) =>
        student.id === id ? { ...student, ...updates, updatedAt: now() } : student
      ),
    }));
  },
  deleteStudent(id: string) {
    setState((current) => ({
      ...current,
      students: current.students.filter((student) => student.id !== id),
      attempts: current.attempts.filter((attempt) => attempt.studentId !== id),
    }));
  },
  saveQuiz(quiz: Omit<QuizDefinition, "id" | "createdAt" | "updatedAt" | "timeLimitSeconds"> & { id?: string }) {
    const timestamp = now();
    const questionsPerAttempt = Math.max(1, Math.min(quiz.questionsPerAttempt, quiz.questionIds.length));
    const timeLimitSeconds = questionsPerAttempt * quiz.perQuestionSeconds;

    if (quiz.id) {
      setState((current) => ({
        ...current,
        quizzes: current.quizzes.map((existing) =>
          existing.id === quiz.id
            ? {
                ...existing,
                ...quiz,
                questionsPerAttempt,
                timeLimitSeconds,
                updatedAt: timestamp,
              }
            : existing
        ),
        activeQuizId:
          quiz.isActive && current.activeQuizId !== quiz.id
            ? quiz.id
            : current.activeQuizId && quiz.isActive === false && current.activeQuizId === quiz.id
              ? undefined
              : current.activeQuizId,
      }));
      return quiz.id;
    }

    const newQuiz: QuizDefinition = {
      ...quiz,
      id: crypto.randomUUID(),
      questionsPerAttempt,
      timeLimitSeconds,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setState((current) => ({
      ...current,
      quizzes: [...current.quizzes, newQuiz],
      activeQuizId: quiz.isActive ? newQuiz.id : current.activeQuizId,
    }));

    return newQuiz.id;
  },
  setActiveQuiz(id: string) {
    setState((current) => ({
      ...current,
      activeQuizId: id,
      quizzes: current.quizzes.map((quiz) => ({
        ...quiz,
        isActive: quiz.id === id,
        updatedAt: quiz.id === id ? now() : quiz.updatedAt,
      })),
    }));
  },
  deleteQuiz(id: string) {
    setState((current) => {
      const remainingQuizzes = current.quizzes.filter((quiz) => quiz.id !== id);
      const activeQuizId = current.activeQuizId === id ? remainingQuizzes[0]?.id : current.activeQuizId;
      return {
        ...current,
        quizzes: remainingQuizzes,
        attempts: current.attempts.filter((attempt) => attempt.quizId !== id),
        activeQuizId,
      };
    });
  },
  recordAttempt(attempt: Omit<QuizAttempt, "id">) {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: crypto.randomUUID(),
    };

    setState((current) => ({
      ...current,
      attempts: [newAttempt, ...current.attempts],
      students: current.students.map((student) =>
        student.id === attempt.studentId ? { ...student, quizMark: attempt.score, updatedAt: now() } : student
      ),
    }));

    return newAttempt;
  },
  allocateQuestions(quizId: string) {
    const quiz = state.quizzes.find((q) => q.id === quizId);
    if (!quiz) return null;
    const count = Math.min(quiz.questionsPerAttempt ?? quiz.questionIds.length, quiz.questionIds.length);
    if (quiz.questionIds.length < count) {
      return null;
    }
    const shuffled = [...quiz.questionIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  },
};

