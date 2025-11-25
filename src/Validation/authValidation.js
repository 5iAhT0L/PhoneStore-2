import e from "cors";
import { email, z } from "zod";

export const registerSchema = z
  .object({
    fullname: z.string().min(3, "fullname minimal 3 karakter"),
    username: z
      .string()
      .min(3, "username minimal 3 karakter")
      .refine((s) => !s.includes(""), "usernaem tidak boleh mengandung spasi"),
    email: z.email("email tidak valid"),
    password: z.string().min(6, "password minimal 6 karakter"),
    role: z.enum(["admin", "user"], {
      message: "role harus 'admin atau user'",
    }),
    address: z.string().min(5, "alamat minimal 5 karakter").optional(),
    phone_number: z
      .string()
      .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,11}$/, "nomor HP tidak valid")
      .optional(),
    age: z
      .number({ invalid_type_error: "umur harus angka" })
      .min(10, "umur minimal 10 tahun")
      .max(100, "maksimal 100 tahun")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password dan confirm password harus sama",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("email tidak valid"),
  password: z.string().min(6, "password minimal 6 karakter"),
});