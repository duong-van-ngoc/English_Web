import React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
  // Pass state context down via React Children clone or simple container
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { activeValue: value, onValueChange });
    }
    return child;
  });

  return <div className={`flex flex-col gap-4 ${className}`}>{childrenWithProps}</div>;
}

interface TabsListProps {
  children: React.ReactNode;
  activeValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function TabsList({ children, activeValue, onValueChange, className = "" }: TabsListProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { activeValue, onValueChange });
    }
    return child;
  });

  return (
    <div className={`flex w-fit rounded-xl border border-border bg-surface-strong p-1 ${className}`}>
      {childrenWithProps}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  activeValue,
  onValueChange,
  className = "",
}: TabsTriggerProps) {
  const isActive = activeValue === value;
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        isActive ? "primary-gradient-btn text-white" : "text-text-secondary hover:text-primary"
      } ${className}`}
      onClick={() => onValueChange?.(value)}
      type="button"
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  activeValue?: string;
  className?: string;
}

export function TabsContent({ value, children, activeValue, className = "" }: TabsContentProps) {
  if (activeValue !== value) return null;
  return <div className={`w-full ${className}`}>{children}</div>;
}
