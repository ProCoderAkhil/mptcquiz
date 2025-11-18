import { Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  isAnswered: boolean;
  onAnswerSelect: (answerIndex: number) => void;
}

const QuestionCard = ({ question, selectedAnswer, isAnswered, onAnswerSelect }: QuestionCardProps) => {
  const getButtonVariant = (optionIndex: number) => {
    if (!isAnswered) return "outline";
    if (optionIndex === question.correctAnswer) return "default";
    if (optionIndex === selectedAnswer && optionIndex !== question.correctAnswer) return "destructive";
    return "outline";
  };

  const getButtonClasses = (optionIndex: number) => {
    const baseClasses = "h-auto py-4 px-6 text-left justify-start transition-all duration-300 transform";
    
    if (!isAnswered) {
      return `${baseClasses} hover:scale-[1.02] hover:shadow-[var(--shadow-soft)] active:scale-[0.98]`;
    }
    
    if (optionIndex === question.correctAnswer) {
      return `${baseClasses} bg-success hover:bg-success border-success text-success-foreground shadow-[var(--shadow-soft)] scale-[1.02]`;
    }
    
    if (optionIndex === selectedAnswer && optionIndex !== question.correctAnswer) {
      return `${baseClasses} bg-destructive hover:bg-destructive border-destructive text-destructive-foreground shadow-[var(--shadow-soft)]`;
    }
    
    return `${baseClasses} opacity-50`;
  };

  const getIcon = (optionIndex: number) => {
    if (!isAnswered) return null;
    if (optionIndex === question.correctAnswer) {
      return <CheckCircle2 className="w-5 h-5 flex-shrink-0" />;
    }
    if (optionIndex === selectedAnswer && optionIndex !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 flex-shrink-0" />;
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl shadow-[var(--shadow-medium)] p-8 border border-border/50 backdrop-blur-sm animate-fade-in">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
          {question.category}
        </span>
        <h2 className="text-2xl font-bold text-card-foreground leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={getButtonVariant(index)}
            onClick={() => onAnswerSelect(index)}
            disabled={isAnswered}
            className={getButtonClasses(index)}
          >
            <span className="flex items-center gap-3 w-full">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center font-semibold text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-base font-medium">{option}</span>
              {getIcon(index)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
