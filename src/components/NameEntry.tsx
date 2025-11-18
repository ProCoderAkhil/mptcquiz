import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Timer, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NameEntryProps {
  onStart: (student: { name: string; phone: string; className: string }) => void;
  quizSummary?: {
    title: string;
    questionCount: number;
    timeLimitMinutes: number;
  };
}

const NameEntry = ({ onStart, quizSummary }: NameEntryProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [className, setClassName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !className.trim()) {
      return;
    }
    onStart({
      name: name.trim(),
      phone: phone.trim(),
      className: className.trim(),
    });
  };

  const isQuizAvailable = Boolean(quizSummary);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-hover mb-6 shadow-[var(--shadow-medium)] animate-scale-in">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-3">
            Students Quiz Competition
          </h1>
          <p className="text-muted-foreground text-lg">
            Register to compete before the timer starts
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-8 border border-border/50 backdrop-blur-sm animate-slide-up space-y-6">
          {!isQuizAvailable && (
            <Alert variant="destructive">
              <AlertTitle>Quiz unavailable</AlertTitle>
              <AlertDescription>
                The administrator has not published a quiz yet. Please check back later.
              </AlertDescription>
            </Alert>
          )}

          {quizSummary && (
            <div className="rounded-xl border border-dashed p-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-base font-semibold text-card-foreground">
                <Users className="h-4 w-4" />
                {quizSummary.title}
              </div>
              <p>{quizSummary.questionCount} questions · {quizSummary.timeLimitMinutes} minutes</p>
              <p className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Timer starts as soon as you begin. Submissions close automatically when time runs out.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-card-foreground">
                Full name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-lg border-border/50 focus:border-primary transition-all duration-300"
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-card-foreground">
                Phone number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                className="h-12 text-lg border-border/50 focus:border-primary transition-all duration-300"
                autoComplete="tel"
                pattern="^[0-9]{10}$"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="className" className="text-sm font-medium text-card-foreground">
                Class / Section
              </label>
              <Input
                id="className"
                type="text"
                placeholder="Class or section"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="h-12 text-lg border-border/50 focus:border-primary transition-all duration-300"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!isQuizAvailable || !name.trim() || phone.length !== 10 || !className.trim()}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary-hover hover:shadow-[var(--shadow-medium)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Begin Quiz
            </Button>
          </form>

          <div className="pt-4 border-t border-border/30 text-sm text-muted-foreground text-center space-y-2">
            <p>Your progress is recorded securely for the admin to review.</p>
            <Link to="/admin/login" className="inline-flex items-center justify-center gap-2 text-primary font-semibold hover:underline">
              <Shield className="h-4 w-4" />
              Admin login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameEntry;
