import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Tên tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
