import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl";
    
    const variants = {
      primary: "primary-gradient-btn text-white shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20",
      secondary: "secondary-glass-btn",
      danger: "bg-error/10 border border-error/20 text-error hover:bg-error/20",
      ghost: "hover:bg-primary/5 text-text-primary hover:text-primary",
      link: "text-primary hover:underline bg-transparent border-none p-0 h-auto",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
