import { useMemo, useState } from "react";
import { useAdminStore } from "@/hooks/use-admin-store";
import { QuizAttempt } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";

const statusVariant: Record<QuizAttempt["status"], "default" | "secondary" | "destructive"> = {
  completed: "default",
  incomplete: "secondary",
  timeout: "destructive",
};

export const AttemptMonitor = () => {
  const attempts = useAdminStore((state) => state.attempts);
  const students = useAdminStore((state) => state.students);
  const quizzes = useAdminStore((state) => state.quizzes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuizAttempt["status"] | "all">("all");
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((attempt) => {
      const matchesStatus = statusFilter === "all" || attempt.status === statusFilter;
      const matchesSearch =
        !searchTerm ||
        attempt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attempt.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attempt.phone.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [attempts, searchTerm, statusFilter]);

  const getQuizName = (quizId: string) => quizzes.find((quiz) => quiz.id === quizId)?.title ?? "Unknown quiz";

  const exportCsv = () => {
    const header = [
      "Student",
      "Class",
      "Phone",
      "Quiz",
      "Score",
      "Total",
      "Status",
      "Time taken (s)",
      "Started",
      "Completed",
    ];
    const rows = filteredAttempts.map((attempt) => [
      attempt.studentName,
      attempt.className,
      attempt.phone,
      getQuizName(attempt.quizId),
      attempt.score,
      attempt.totalQuestions,
      attempt.status,
      attempt.timeTakenSeconds,
      attempt.startedAt,
      attempt.completedAt ?? "",
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiz-results-${new Date().toISOString()}.csv`;
    link.click();
  };

  const selectedStudent = students.find((student) => student.id === selectedAttempt?.studentId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Search by name, class, or phone"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select value={statusFilter} onValueChange={(value: QuizAttempt["status"] | "all") => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="timeout">Timed out</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCsv} disabled={!filteredAttempts.length}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time taken</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttempts.length ? (
              filteredAttempts.map((attempt) => (
                <TableRow key={attempt.id} className="cursor-pointer" onClick={() => setSelectedAttempt(attempt)}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{attempt.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {attempt.className} · {attempt.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getQuizName(attempt.quizId)}</TableCell>
                  <TableCell>
                    {attempt.score}/{attempt.totalQuestions}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[attempt.status]} className="capitalize">
                      {attempt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{Math.round(attempt.timeTakenSeconds)}s</TableCell>
                  <TableCell>{new Date(attempt.startedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                  No attempts recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAttempt} onOpenChange={() => setSelectedAttempt(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attempt details</DialogTitle>
          </DialogHeader>
          {selectedAttempt && (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <p className="font-semibold">{selectedAttempt.studentName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAttempt.className} · {selectedAttempt.phone}
                </p>
                {selectedStudent && (
                  <p className="text-sm text-muted-foreground">
                    Student profile last updated {new Date(selectedStudent.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-2xl font-semibold">
                    {selectedAttempt.score}/{selectedAttempt.totalQuestions}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusVariant[selectedAttempt.status]} className="mt-1 capitalize">
                    {selectedAttempt.status}
                  </Badge>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Time taken</p>
                  <p className="text-2xl font-semibold">{Math.round(selectedAttempt.timeTakenSeconds)}s</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">Started</p>
                  <p className="text-sm">{new Date(selectedAttempt.startedAt).toLocaleString()}</p>
                  {selectedAttempt.completedAt && (
                    <p className="text-sm text-muted-foreground">
                      Completed {new Date(selectedAttempt.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <ScrollArea className="h-64 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Answer</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAttempt.answers.map((answer) => (
                      <TableRow key={answer.questionId}>
                        <TableCell>#{answer.questionId}</TableCell>
                        <TableCell>{answer.selectedOption !== null ? `Option ${answer.selectedOption + 1}` : "N/A"}</TableCell>
                        <TableCell>{answer.isCorrect ? "Correct" : "Incorrect"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

