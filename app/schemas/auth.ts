import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username Tidak Boleh Kosong")
    .min(3, "Username Minimal Harus Terdiri Dari 3 Huruf Atau Angka"),
  password: z.string().min(1, "Password Tidak Boleh Kosong"),
});

export type LoginFormValue = z.infer<typeof loginSchema>;
