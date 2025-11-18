const fallbackEmail = "admin@mptcquiz.edu";
const fallbackPassword = "SecureQuiz#2025";

export const adminCredentials = {
  email: import.meta.env.VITE_ADMIN_EMAIL?.trim() || fallbackEmail,
  password: import.meta.env.VITE_ADMIN_PASSWORD?.trim() || fallbackPassword,
};

export const getMaskedAdminEmail = () => adminCredentials.email.replace(/(.{2}).+(@.+)/, "$1***$2");


