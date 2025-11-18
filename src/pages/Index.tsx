import { useState } from "react";
import NameEntry from "@/components/NameEntry";
import Quiz from "@/components/Quiz";
import { Question } from "@/data/questions";
import { useAdminStore } from "@/hooks/use-admin-store";
import { adminStore } from "@/lib/admin-store";
import { Student } from "@/types/admin";
import { useToast } from "@/components/ui/use-toast";
import { getPersonalizedQuestionSet } from "@/lib/question-service";

const Index = () => {
  const activeQuiz = useAdminStore((state) => state.quizzes.find((quiz) => quiz.id === state.activeQuizId));
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleStart = (payload: { name: string; phone: string; className: string }) => {
    if (!activeQuiz) {
      toast({
        variant: "destructive",
        title: "Quiz not available",
        description: "Please contact your administrator.",
      });
      return;
    }

    const existingStudent = adminStore
      .getState()
      .students.find((studentRecord) => studentRecord.phone === payload.phone);

    let studentRecord: Student;
    if (existingStudent) {
      adminStore.updateStudent(existingStudent.id, {
        name: payload.name,
        className: payload.className,
      });
      studentRecord = {
        ...existingStudent,
        name: payload.name,
        className: payload.className,
      };
    } else {
      studentRecord = adminStore.addStudent({
        name: payload.name,
        phone: payload.phone,
        className: payload.className,
      });
    }

    const personalized = getPersonalizedQuestionSet({
      studentName: payload.name,
      phone: payload.phone,
      count: activeQuiz.questionsPerAttempt,
    });
    setStudent(studentRecord);
    setQuestions(personalized);
  };

  const handleRestart = () => {
    setStudent(null);
    setQuestions([]);
  };

  if (!student || !questions.length || !activeQuiz) {
    return (
      <NameEntry
        onStart={handleStart}
        quizSummary={
          activeQuiz
            ? {
                title: activeQuiz.title,
                questionCount: activeQuiz.questionsPerAttempt,
                timeLimitMinutes: Math.floor(activeQuiz.timeLimitSeconds / 60),
              }
            : undefined
        }
      />
    );
  }

  return (
    <Quiz 
      questions={questions}
      student={student}
      quizDetails={activeQuiz}
      onRestart={handleRestart}
    />
  );
};

export default Index;
