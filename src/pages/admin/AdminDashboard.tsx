import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StudentManager } from "@/components/admin/StudentManager";
import { AttemptMonitor } from "@/components/admin/AttemptMonitor";
import { useAdminStore } from "@/hooks/use-admin-store";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users2, ClipboardList, TimerReset, DatabaseZap } from "lucide-react";
import { QUESTION_SOURCE_URL, questionBank } from "@/data/questions";

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${Math.round(seconds % 60)}s`;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const students = useAdminStore((state) => state.students);
  const attempts = useAdminStore((state) => state.attempts);
  const quizzes = useAdminStore((state) => state.quizzes);
  const activeQuizId = useAdminStore((state) => state.activeQuizId);

  const stats = useMemo(() => {
    const completedAttempts = attempts.filter((attempt) => attempt.status === "completed");
    const avgScore =
      completedAttempts.reduce((total, attempt) => total + attempt.score, 0) /
      Math.max(completedAttempts.length, 1);
    const avgTime =
      attempts.reduce((total, attempt) => total + attempt.timeTakenSeconds, 0) / Math.max(attempts.length, 1);

    return {
      totalStudents: students.length,
      totalAttempts: attempts.length,
      avgScore: Number.isNaN(avgScore) ? 0 : avgScore,
      avgTime: Number.isNaN(avgTime) ? 0 : avgTime,
    };
  }, [students, attempts]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Quiz Management System</p>
            <h1 className="text-2xl font-bold">Admin Console</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              Protected
            </Badge>
            <Button variant="ghost" onClick={() => navigate("/")}>
              View quiz
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered students</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Synced across attempts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz attempts</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">Across all quizzes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average score</CardTitle>
              <TimerReset className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Completed attempts only</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. time taken</CardTitle>
              <TimerReset className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.avgTime)}</div>
              <p className="text-xs text-muted-foreground">All attempt statuses</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Question pipeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                Auto-synced Indian GK questions from our trusted source.
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <DatabaseZap className="h-4 w-4" />
              {questionBank.length} questions
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Source:{" "}
              <a href={QUESTION_SOURCE_URL} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                GkGigs – General Knowledge About India
              </a>
            </p>
            <p>
              Quiz creation and question authoring are disabled in this console to ensure all students receive official,
              automatically curated content.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attempts">Attempts & results</TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <StudentManager />
          </TabsContent>
          <TabsContent value="attempts">
            <AttemptMonitor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

