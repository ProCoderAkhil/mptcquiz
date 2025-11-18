import { useMemo, useState } from "react";
import { questionBank } from "@/data/questions";
import { adminStore } from "@/lib/admin-store";
import { useAdminStore } from "@/hooks/use-admin-store";
import { QuizDefinition } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Clock, PlusCircle } from "lucide-react";

interface QuizFormState {
  id?: string;
  title: string;
  description: string;
  questionIds: number[];
  perQuestionSeconds: number;
  questionsPerAttempt: number;
  allowRetake: boolean;
  isActive: boolean;
}

const emptyForm: QuizFormState = {
  title: "",
  description: "",
  questionIds: [],
  perQuestionSeconds: 60,
  questionsPerAttempt: 5,
  allowRetake: true,
  isActive: false,
};

const getQuestionCountCopy = (count: number) =>
  `${count} question${count === 1 ? "" : "s"} (${Math.round((count / questionBank.length) * 100)}% of bank)`;

export const QuizManager = () => {
  const quizzes = useAdminStore((state) => state.quizzes);
  const activeQuizId = useAdminStore((state) => state.activeQuizId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState<QuizFormState>(emptyForm);

  const activeQuiz = useMemo(() => quizzes.find((quiz) => quiz.id === activeQuizId), [quizzes, activeQuizId]);

  const handleOpenForm = (quiz?: QuizDefinition) => {
    if (quiz) {
      setFormState({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        questionIds: quiz.questionIds,
        perQuestionSeconds: quiz.perQuestionSeconds,
        questionsPerAttempt: quiz.questionsPerAttempt ?? Math.min(5, quiz.questionIds.length),
        allowRetake: quiz.allowRetake,
        isActive: quiz.isActive,
      });
    } else {
      setFormState(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.description.trim() || formState.questionIds.length < 3) {
      toast({
        variant: "destructive",
        title: "Incomplete quiz configuration",
        description: "Provide a title, description, and select at least 3 questions.",
      });
      return;
    }

    if (formState.questionsPerAttempt > formState.questionIds.length) {
      toast({
        variant: "destructive",
        title: "Not enough questions in pool",
        description: "Increase the pool size or reduce questions per attempt.",
      });
      return;
    }

    const quizId = adminStore.saveQuiz({
      ...formState,
      title: formState.title.trim(),
      description: formState.description.trim(),
    });

    if (formState.isActive) {
      adminStore.setActiveQuiz(quizId);
    }

    toast({
      title: formState.id ? "Quiz updated" : "Quiz created",
      description: `${formState.title} serves ${formState.questionsPerAttempt} of ${formState.questionIds.length} questions per attempt.`,
    });

    setDialogOpen(false);
  };

  const timeLimitMinutes = activeQuiz ? Math.floor(activeQuiz.timeLimitSeconds / 60) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Active quiz</h3>
          <p className="text-sm text-muted-foreground">Control timing, questions, and availability.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New quiz
        </Button>
      </div>

      {activeQuiz ? (
        <Card>
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>{activeQuiz.title}</CardTitle>
              <CardDescription>{activeQuiz.description}</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{activeQuiz.questionIds.length} question pool</Badge>
              <Badge variant="default">{activeQuiz.questionsPerAttempt} per attempt</Badge>
              <Badge variant="secondary">{timeLimitMinutes} min limit</Badge>
              <Badge variant={activeQuiz.allowRetake ? "default" : "destructive"}>
                {activeQuiz.allowRetake ? "Retakes allowed" : "Single attempt"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <p className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Countdown rule
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Students receive {activeQuiz.perQuestionSeconds} seconds per question (
                {Math.floor((activeQuiz.questionsPerAttempt * activeQuiz.perQuestionSeconds) / 60)} minutes total per attempt).
                Attempts auto-submit when time expires.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeQuiz.questionIds.map((questionId) => {
                const question = questionBank.find((q) => q.id === questionId);
                return (
                  <Badge key={questionId} variant="outline">
                    {question?.category ?? "Question"} #{questionId}
                  </Badge>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleOpenForm(activeQuiz)} variant="secondary">
                Edit quiz
              </Button>
              {quizzes.length > 1 && (
                <Button variant="outline" onClick={() => adminStore.deleteQuiz(activeQuiz.id)}>
                  Remove quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No active quiz. Create a quiz to allow students to participate.
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Quiz library</TabsTrigger>
          <TabsTrigger value="questions">Question bank</TabsTrigger>
        </TabsList>
        <TabsContent value="library">
          <div className="grid gap-4 lg:grid-cols-2">
            {quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{quiz.title}</span>
                    {quiz.id === activeQuizId && <Badge>Active</Badge>}
                  </CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Pool {quiz.questionIds.length} • {quiz.questionsPerAttempt} per attempt •{" "}
                    {Math.floor(quiz.timeLimitSeconds / 60)} minute timer
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleOpenForm(quiz)}>
                      Configure
                    </Button>
                    {quiz.id !== activeQuizId && (
                      <Button size="sm" onClick={() => adminStore.setActiveQuiz(quiz.id)}>
                        Set active
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => adminStore.deleteQuiz(quiz.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Question bank</CardTitle>
              <CardDescription>Available questions grouped by category.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...new Set(questionBank.map((q) => q.category))].map((category) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold">{category}</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {questionBank
                        .filter((q) => q.category === category)
                        .map((question) => (
                          <div key={question.id} className="rounded-md border p-3 text-sm">
                            <p className="font-medium">#{question.id}</p>
                            <p className="text-muted-foreground">{question.question}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{formState.id ? "Edit quiz" : "Create quiz"}</DialogTitle>
          </DialogHeader>
          <form id="quiz-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz title</Label>
                <Input
                  id="quiz-title"
                  value={formState.title}
                  onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Term 1 Assessment"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-time">Seconds per question</Label>
                <Input
                  id="quiz-time"
                  type="number"
                  min={30}
                  max={240}
                  value={formState.perQuestionSeconds}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, perQuestionSeconds: Number(e.target.value) || 60 }))
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Total time is calculated automatically:{" "}
                  {getQuestionCountCopy(formState.questionIds.length)} →{" "}
                  {formState.questionsPerAttempt} served →{" "}
                  {Math.floor((formState.questionsPerAttempt * formState.perQuestionSeconds) / 60)} minutes per attempt.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-count">Questions per student attempt</Label>
              <Input
                id="quiz-count"
                type="number"
                min={1}
                max={formState.questionIds.length || questionBank.length}
                value={formState.questionsPerAttempt}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    questionsPerAttempt: Math.max(1, Number(e.target.value) || prev.questionsPerAttempt),
                  }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Students will receive this many unique questions, without repeats across students.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-description">Description</Label>
              <Input
                id="quiz-description"
                value={formState.description}
                onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Covers lessons 1-5"
                required
              />
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Retake policy</p>
                  <p className="text-sm text-muted-foreground">
                    Allow students to retry the quiz after submitting results.
                  </p>
                </div>
                <Switch
                  checked={formState.allowRetake}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, allowRetake: checked }))}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select questions</Label>
                <span className="text-sm text-muted-foreground">
                  {formState.questionIds.length} selected • minimum 3
                </span>
              </div>
              <ScrollArea className="h-64 rounded-md border p-4">
                <div className="space-y-4">
                  {[...new Set(questionBank.map((q) => q.category))].map((category) => (
                    <div key={category}>
                      <p className="text-sm font-semibold mb-2">{category}</p>
                      <div className="space-y-2">
                        {questionBank
                          .filter((q) => q.category === category)
                          .map((question) => (
                            <label
                              key={question.id}
                              className="flex items-start gap-3 rounded-md border p-3 text-sm hover:bg-muted/40"
                            >
                              <Checkbox
                                checked={formState.questionIds.includes(question.id)}
                                onCheckedChange={(checked) => {
                                  setFormState((prev) => ({
                                    ...prev,
                                    questionIds: checked
                                      ? [...prev.questionIds, question.id]
                                      : prev.questionIds.filter((id) => id !== question.id),
                                  }));
                                }}
                              />
                              <div>
                                <p className="font-medium">#{question.id}</p>
                                <p className="text-muted-foreground">{question.question}</p>
                              </div>
                            </label>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Set as active quiz</p>
                <p className="text-xs text-muted-foreground">The active quiz is the only one students can attempt.</p>
              </div>
              <Switch
                checked={formState.isActive || formState.id === activeQuizId}
                onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>
          </form>
          <DialogFooter>
            <Button type="submit" form="quiz-form">
              {formState.id ? "Save quiz" : "Create quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

