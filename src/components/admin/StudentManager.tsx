import { useMemo, useState } from "react";
import { adminStore } from "@/lib/admin-store";
import { useAdminStore } from "@/hooks/use-admin-store";
import { Student } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentFormState {
  name: string;
  phone: string;
  className: string;
  quizMark?: number;
}

const emptyForm: StudentFormState = {
  name: "",
  phone: "",
  className: "",
};

export const StudentManager = () => {
  const students = useAdminStore((state) => state.students);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formState, setFormState] = useState<StudentFormState>(emptyForm);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(term) ||
        student.phone.includes(term) ||
        student.className.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  const handleOpenForm = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormState({
        name: student.name,
        phone: student.phone,
        className: student.className,
        quizMark: student.quizMark,
      });
    } else {
      setEditingStudent(null);
      setFormState(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.name.trim() || !formState.phone.trim() || !formState.className.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required student fields.",
      });
      return;
    }

    if (editingStudent) {
      adminStore.updateStudent(editingStudent.id, {
        name: formState.name.trim(),
        phone: formState.phone.trim(),
        className: formState.className.trim(),
        quizMark: formState.quizMark,
      });
      toast({ title: "Student updated", description: `${formState.name} has been updated.` });
    } else {
      adminStore.addStudent({
        name: formState.name.trim(),
        phone: formState.phone.trim(),
        className: formState.className.trim(),
        quizMark: formState.quizMark,
      });
      toast({ title: "Student added", description: `${formState.name} has been added.` });
    }

    setDialogOpen(false);
  };

  const handleDelete = (student: Student) => {
    if (!window.confirm(`Delete ${student.name}? This will also remove their attempts.`)) return;
    adminStore.deleteStudent(student.id);
    toast({ title: "Student removed", description: `${student.name} was deleted.` });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, class, or phone"
            className="pl-9"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit student" : "Register student"}</DialogTitle>
            </DialogHeader>
            <form id="student-form" className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="student-name">Full name</Label>
                <Input
                  id="student-name"
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Priya Singh"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-phone">Phone number</Label>
                <Input
                  id="student-phone"
                  value={formState.phone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="9876543210"
                  pattern="^[0-9]{10}$"
                  maxLength={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-class">Class</Label>
                <Input
                  id="student-class"
                  value={formState.className}
                  onChange={(e) => setFormState((prev) => ({ ...prev, className: e.target.value }))}
                  placeholder="Grade 8A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-mark">Latest quiz mark (optional)</Label>
                <Input
                  id="student-mark"
                  type="number"
                  min={0}
                  max={5}
                  value={formState.quizMark ?? ""}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, quizMark: e.target.value ? Number(e.target.value) : undefined }))
                  }
                  placeholder="Auto-calculated after quiz"
                />
              </div>
            </form>
            <DialogFooter>
              <Button type="submit" form="student-form">
                {editingStudent ? "Save changes" : "Add student"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Latest mark</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Updated {new Date(student.updatedAt).toLocaleString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={student.quizMark && student.quizMark >= 3 ? "default" : "secondary"}
                      className={cn(student.quizMark === undefined && "bg-muted text-muted-foreground")}
                    >
                      {student.quizMark !== undefined ? `${student.quizMark}/5` : "Awaiting quiz"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenForm(student)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(student)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  No students found. Add a student to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

