import { useEffect, useMemo, useRef, useState } from "react";
import { Question } from "@/data/questions";
import { Student, QuizDefinition, AttemptStatus, QuizAttemptAnswer } from "@/types/admin";
import { adminStore } from "@/lib/admin-store";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import Results from "./Results";

interface QuizProps {
  questions: Question[];
  student: Student;
  quizDetails: QuizDefinition;
  onRestart: () => void;
}

const Quiz = ({ questions, student, quizDetails, onRestart }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(quizDetails.timeLimitSeconds);
  const [attemptStatus, setAttemptStatus] = useState<AttemptStatus>("incomplete");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startedAt] = useState(() => new Date().toISOString());

  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [finalTimeTaken, setFinalTimeTaken] = useState<number | null>(null);
  const [answerReview, setAnswerReview] = useState<QuizAttemptAnswer[]>([]);
  const hasFinalizedRef = useRef(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (showResults || hasFinalizedRef.current) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (hasFinalizedRef.current) {
          window.clearInterval(timer);
          return prev;
        }
        if (prev <= 1) {
          window.clearInterval(timer);
          finalizeAttempt("timeout", 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults]);

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [remainingSeconds]);

  const buildAnswerRecord = (answerMap: Record<number, number | null>) =>
    questions.map((question) => {
      const selected = answerMap[question.id] ?? null;
      return {
        questionId: question.id,
        selectedOption: selected,
        isCorrect: selected === question.correctAnswer,
      };
    });

  const currentScore = useMemo(() => {
    const record = buildAnswerRecord(answers);
    return record.filter((answer) => answer.isCorrect).length;
  }, [answers, questions]);

  const finalizeAttempt = (status: AttemptStatus, answerMap?: Record<number, number | null>, delay = 1500) => {
    if (hasFinalizedRef.current) return;
    hasFinalizedRef.current = true;
    setAttemptStatus(status);
    const source = answerMap ?? answers;
    const answersRecord = buildAnswerRecord(source);
    setAnswerReview(answersRecord);

    const finalScore = answersRecord.filter((answer) => answer.isCorrect).length;
    const timeTaken = quizDetails.timeLimitSeconds - remainingSeconds;
    setFinalTimeTaken(Math.max(timeTaken, 0));

    const loggedAttempt = adminStore.recordAttempt({
      quizId: quizDetails.id,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      phone: student.phone,
      answers: answersRecord,
      score: finalScore,
      totalQuestions,
      startedAt,
      completedAt: status === "timeout" ? undefined : new Date().toISOString(),
      status,
      timeTakenSeconds: Math.max(timeTaken, 0),
    });
    setAttemptId(loggedAttempt.id);

    setTimeout(() => {
      setShowResults(true);
    }, delay);
  };

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered || showResults) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    const questionId = currentQuestion.id;
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answerIndex };

      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
          finalizeAttempt("completed", updated);
        }
      }, 1500);

      return updated;
    });
  };

  useEffect(() => {
    if (remainingSeconds === 0 && !showResults) {
      finalizeAttempt("timeout", undefined, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds]);

  if (showResults) {
    return (
      <Results
        userName={student.name}
        score={currentScore}
        totalQuestions={totalQuestions}
        onRestart={onRestart}
        status={attemptStatus}
        timeTakenSeconds={finalTimeTaken ?? quizDetails.timeLimitSeconds - remainingSeconds}
        attemptId={attemptId}
        allowRetake={quizDetails.allowRetake}
        questions={questions}
        answers={answerReview}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="rounded-2xl border bg-card p-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Candidate</p>
            <p className="text-lg font-semibold">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.className} · {student.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Time remaining</p>
            <p className={`text-2xl font-bold ${remainingSeconds < 30 ? "text-destructive" : "text-card-foreground"}`}>
              {timerLabel}
            </p>
          </div>
        </div>

      <div className="mb-4 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="font-semibold text-card-foreground">
              Stay focused—results appear at the end
            </span>
          </div>
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          onAnswerSelect={handleAnswerSelect}
        />
      </div>
    </div>
  );
};

export default Quiz;
