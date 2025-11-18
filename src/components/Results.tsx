import { useMemo, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Award, Target, Sparkles } from "lucide-react";
import type { QuizAttemptAnswer } from "@/types/admin";
import type { Question } from "@/data/questions";
import { Card, CardContent } from "@/components/ui/card";

interface ResultsProps {
  userName: string;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  status: "completed" | "incomplete" | "timeout";
  timeTakenSeconds: number;
  attemptId: string | null;
  allowRetake: boolean;
  questions: Question[];
  answers: QuizAttemptAnswer[];
}

type ConfettiPieceStyle = CSSProperties & { "--confetti-x-offset"?: string };

const Results = ({
  userName,
  score,
  totalQuestions,
  onRestart,
  status,
  timeTakenSeconds,
  attemptId,
  allowRetake,
  questions,
  answers,
}: ResultsProps) => {
  const answerSummary = useMemo(() => answers ?? [], [answers]);
  const derivedScore = answerSummary.filter((answer) => answer.isCorrect).length;
  const displayScore = Math.max(score, derivedScore);
  const percentage = totalQuestions ? (displayScore / totalQuestions) * 100 : 0;
  const isPerfectScore = displayScore === totalQuestions;

  const confettiPieces = useMemo<ConfettiPieceStyle[]>(() => {
    if (!isPerfectScore) return [];
    const colors = ["#f97316", "#38bdf8", "#facc15", "#34d399", "#a855f7", "#ef4444"];
    return Array.from({ length: 30 }).map((_, index) => ({
      left: `${Math.random() * 100}%`,
      backgroundColor: colors[index % colors.length],
      animationDelay: `${Math.random() * 0.4}s`,
      animationDuration: `${1.5 + Math.random()}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
      "--confetti-x-offset": `${(Math.random() - 0.5) * 200}px`,
    }));
  }, [isPerfectScore]);

  const getPerformanceMessage = () => {
    if (percentage === 100) {
      return {
        title: "Perfect Score!",
        message: "Outstanding! You're a true quiz master!",
        icon: Trophy,
        color: "text-yellow-500"
      };
    } else if (percentage >= 80) {
      return {
        title: "Excellent!",
        message: "Great job! You really know your stuff!",
        icon: Award,
        color: "text-success"
      };
    } else if (percentage >= 60) {
      return {
        title: "Good Work!",
        message: "Nice effort! Keep learning and improving!",
        icon: Target,
        color: "text-primary"
      };
    } else {
      return {
        title: "Keep Trying!",
        message: "Don't give up! Practice makes perfect!",
        icon: Target,
        color: "text-muted-foreground"
      };
    }
  };

  const performance = getPerformanceMessage();
  const PerformanceIcon = performance.icon;

  return (
    <>
      {isPerfectScore && (
        <div className="confetti-container">
          {confettiPieces.map((style, index) => (
            <span key={index} className="confetti-piece" style={style} />
          ))}
        </div>
      )}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-medium)] p-8 border border-border/50 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-hover shadow-[var(--shadow-medium)] animate-scale-in ${performance.color}`}>
              <PerformanceIcon className="w-12 h-12 text-primary-foreground" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-card-foreground">
                {performance.title}
              </h2>
              <p className="text-muted-foreground text-lg">
                {performance.message}
              </p>
            </div>

            <div className="py-8 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Hi, {userName}!</p>
                <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  {displayScore}/{totalQuestions}
                </div>
                <p className="text-lg text-muted-foreground mt-2">
                  {percentage.toFixed(0)}% Correct
                </p>
              </div>

              <div className="w-full bg-secondary rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {isPerfectScore && (
                <div className="rounded-2xl border border-success/40 bg-success/10 p-4 text-left space-y-3">
                  <div className="flex items-center gap-2 text-success font-semibold">
                    <Sparkles className="h-5 w-5" />
                    Flawless Victory!
                  </div>
                  <p className="text-sm text-success">
                    You answered every single question correctly. Outstanding mastery of Indian GK!
                  </p>
                  <div className="text-4xl animate-bounce" role="img" aria-label="Party popper celebration">
                    🎉
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground space-y-1 text-left">
              <p>
                Attempt status: <span className="font-semibold capitalize">{status}</span>
              </p>
              <p>Time taken: {Math.round(timeTakenSeconds)} seconds</p>
              {attemptId && <p>Tracking ID: {attemptId}</p>}
            </div>

            <div className="space-y-3 text-left">
              <h3 className="text-lg font-semibold">Answer review</h3>
              <div className="space-y-3">
                {(questions ?? []).map((question) => {
                  const answer = answerSummary.find((entry) => entry.questionId === question.id);
                  const selectedIndex = answer?.selectedOption;
                  const isCorrect = answer?.isCorrect ?? false;
                  return (
                    <Card key={question.id} className="bg-muted/20 border-border/60">
                      <CardContent className="py-4 space-y-2">
                        <p className="text-sm uppercase tracking-wide text-muted-foreground">{question.category}</p>
                        <p className="font-medium text-card-foreground">{question.question}</p>
                        <div className="text-sm">
                          <p className="text-muted-foreground">
                            Your answer:{" "}
                            <span className={isCorrect ? "text-success font-semibold" : "text-destructive font-semibold"}>
                              {selectedIndex !== null && selectedIndex !== undefined
                                ? question.options[selectedIndex]
                                : "Not answered"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-muted-foreground">
                              Correct answer:{" "}
                              <span className="font-semibold text-card-foreground">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                onClick={onRestart}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary-hover hover:shadow-[var(--shadow-medium)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {allowRetake ? "Retake Quiz" : "Return Home"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {allowRetake ? "You can try again with admin approval." : "Retakes are disabled for this quiz."}
                {" "}Your results were sent to the administrator securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Results;
