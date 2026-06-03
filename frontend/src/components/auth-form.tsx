"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { api, isApiError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/register.schema";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
}

interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-error">{message}</p>;
}

function getSubmitError(error: unknown, fallback: string) {
  if (isApiError(error)) {
    return error.message;
  }

  return fallback;
}

export function AuthForm({ mode }: AuthFormProps) {
  if (mode === "register") {
    return <RegisterForm />;
  }

  return <LoginForm />;
}

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setFeedback("");

    try {
      const result = await api.login(values);
      await login(result.accessToken);
      router.push("/me");
    } catch (error) {
      setFeedback(getSubmitError(error, "Đăng nhập thất bại."));
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-primary ml-1" htmlFor="email">
          Email
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-text-secondary/70" aria-hidden="true">
            mail
          </span>
          <input
            id="email"
            autoComplete="email"
            className="input-glass w-full h-12 pl-12 pr-4 rounded-xl text-sm text-text-primary placeholder:text-text-secondary/50"
            placeholder="example@gmail.com"
            type="email"
            {...form.register("email")}
          />
        </div>
        <FieldError message={form.formState.errors.email?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-primary ml-1" htmlFor="password">
          Mật khẩu
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-text-secondary/70" aria-hidden="true">
            lock
          </span>
          <input
            id="password"
            autoComplete="current-password"
            className="input-glass w-full h-12 pl-12 pr-12 rounded-xl text-sm text-text-primary placeholder:text-text-secondary/50"
            placeholder="Tối thiểu 6 ký tự"
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
          />
          <button
            type="button"
            className="absolute right-4 text-text-secondary/70 hover:text-primary transition-colors focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        <FieldError message={form.formState.errors.password?.message} />
      </div>

      <button
        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      {feedback ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-error/25 bg-error/10 p-3 text-sm leading-6 text-error"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}

function RegisterForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setFeedback("");

    try {
      await api.register(values);
      router.push("/login");
      router.refresh();
    } catch (error) {
      setFeedback(getSubmitError(error, "Tạo tài khoản thất bại."));
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-primary ml-1" htmlFor="name">
          Họ tên
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-text-secondary/70" aria-hidden="true">
            person
          </span>
          <input
            id="name"
            autoComplete="name"
            className="input-glass w-full h-12 pl-12 pr-4 rounded-xl text-sm text-text-primary placeholder:text-text-secondary/50"
            placeholder="Nguyễn Văn A"
            type="text"
            {...form.register("name")}
          />
        </div>
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-primary ml-1" htmlFor="email">
          Email
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-text-secondary/70" aria-hidden="true">
            mail
          </span>
          <input
            id="email"
            autoComplete="email"
            className="input-glass w-full h-12 pl-12 pr-4 rounded-xl text-sm text-text-primary placeholder:text-text-secondary/50"
            placeholder="example@gmail.com"
            type="email"
            {...form.register("email")}
          />
        </div>
        <FieldError message={form.formState.errors.email?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-primary ml-1" htmlFor="password">
          Mật khẩu
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-text-secondary/70" aria-hidden="true">
            lock
          </span>
          <input
            id="password"
            autoComplete="new-password"
            className="input-glass w-full h-12 pl-12 pr-12 rounded-xl text-sm text-text-primary placeholder:text-text-secondary/50"
            placeholder="Tối thiểu 6 ký tự"
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
          />
          <button
            type="button"
            className="absolute right-4 text-text-secondary/70 hover:text-primary transition-colors focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        <FieldError message={form.formState.errors.password?.message} />
      </div>

      <button
        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>

      {feedback ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-error/25 bg-error/10 p-3 text-sm leading-6 text-error"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
