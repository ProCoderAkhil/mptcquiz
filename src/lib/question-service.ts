import type { Question } from "@/data/questions";
import { questionBank } from "@/data/questions";

const STUDENT_USAGE_KEY = "mptcquiz-student-question-usage";

interface QuestionUsageMap {
  [studentKey: string]: number[];
}

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

const buildStudentKey = (name: string, phone: string) => {
  const normalizedName = name.trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone);
  return `${normalizedName}:${normalizedPhone}`;
};

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
};

const loadUsage = (): QuestionUsageMap => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(STUDENT_USAGE_KEY);
    return stored ? (JSON.parse(stored) as QuestionUsageMap) : {};
  } catch {
    return {};
  }
};

const persistUsage = (usage: QuestionUsageMap) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STUDENT_USAGE_KEY, JSON.stringify(usage));
};

const seededShuffle = (questions: Question[], seed: number) => {
  const shuffled = [...questions];
  let currentSeed = seed;

  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

interface PersonalizedQuestionSetOptions {
  studentName: string;
  phone: string;
  count: number;
}

export const getPersonalizedQuestionSet = ({ studentName, phone, count }: PersonalizedQuestionSetOptions) => {
  const usage = loadUsage();
  const key = buildStudentKey(studentName, phone);
  const used = new Set(usage[key] ?? []);

  const available = questionBank.filter((question) => !used.has(question.id));
  const needsReset = available.length < count;
  const pool = needsReset ? questionBank : available;

  const seed = hashString(`${studentName}-${phone}-${used.size}`);
  const shuffled = seededShuffle(pool, seed);
  const selected = shuffled.slice(0, count);

  const updatedUsed = needsReset ? selected.map((q) => q.id) : [...used, ...selected.map((q) => q.id)];
  usage[key] = updatedUsed.slice(-questionBank.length); // keep within available range
  persistUsage(usage);

  return selected;
};

