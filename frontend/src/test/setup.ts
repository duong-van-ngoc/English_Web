import "@testing-library/jest-dom/vitest";

import React from "react";
import { vi } from "vitest";

process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { href, ...props }, children),
}));
