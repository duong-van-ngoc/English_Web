import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthForm } from "@/components/auth-form";

const { push, refresh, login, loginHookFn } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  login: vi.fn(),
  loginHookFn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

vi.mock("@/lib/api", () => ({
  api: {
    login,
  },
  isApiError: (error: unknown) =>
    error instanceof Error && "status" in (error as Record<string, unknown>),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    login: loginHookFn,
  }),
}));

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors for invalid login input", async () => {
    const user = userEvent.setup();

    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText("Email"), "student@example.com");
    await user.type(screen.getByLabelText("Mật khẩu"), "123");
    await user.click(screen.getByRole("button", { name: "Đăng nhập" }));

    expect(
      await screen.findByText("Mật khẩu tối thiểu 6 ký tự"),
    ).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("submits login and redirects on success", async () => {
    const user = userEvent.setup();

    login.mockResolvedValue({
      accessToken: "token-123",
      user: {
        id: "user-1",
        email: "student@example.com",
        name: "Student",
        role: "USER",
      },
    });

    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText("Email"), "student@example.com");
    await user.type(screen.getByLabelText("Mật khẩu"), "123456");
    await user.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "student@example.com",
        password: "123456",
      });
    });
    expect(loginHookFn).toHaveBeenCalledWith("token-123");
    expect(push).toHaveBeenCalledWith("/me");
  });

  it("shows API feedback on login failure", async () => {
    const user = userEvent.setup();

    login.mockRejectedValue(
      Object.assign(new Error("Thông tin đăng nhập không đúng"), { status: 401 }),
    );

    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText("Email"), "student@example.com");
    await user.type(screen.getByLabelText("Mật khẩu"), "123456");
    await user.click(screen.getByRole("button", { name: "Đăng nhập" }));

    expect(
      await screen.findByText("Thông tin đăng nhập không đúng"),
    ).toBeInTheDocument();
  });
});

