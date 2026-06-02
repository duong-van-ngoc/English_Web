"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/primary-button";
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
      <label className="block">
        <span className="text-sm font-semibold text-text-primary">Email</span>
        <input
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        <FieldError message={form.formState.errors.email?.message} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-text-primary">Mật khẩu</span>
        <input
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Tối thiểu 6 ký tự"
          type="password"
          {...form.register("password")}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </label>

      <PrimaryButton
        className="w-full"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </PrimaryButton>

      {feedback ? (
        <p
          aria-live="polite"
          className="rounded-md border border-error/25 bg-error/10 p-3 text-sm leading-6 text-error"
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
      <label className="block">
        <span className="text-sm font-semibold text-text-primary">Họ tên</span>
        <input
          autoComplete="name"
          className="mt-2 h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Nguyễn Văn A"
          type="text"
          {...form.register("name")}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-text-primary">Email</span>
        <input
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        <FieldError message={form.formState.errors.email?.message} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-text-primary">Mật khẩu</span>
        <input
          autoComplete="new-password"
          className="mt-2 h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Tối thiểu 6 ký tự"
          type="password"
          {...form.register("password")}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </label>

      <PrimaryButton
        className="w-full"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </PrimaryButton>

      {feedback ? (
        <p
          aria-live="polite"
          className="rounded-md border border-error/25 bg-error/10 p-3 text-sm leading-6 text-error"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
