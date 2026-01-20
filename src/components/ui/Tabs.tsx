import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

interface TabsRootProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export function TabsRoot({ defaultValue, children, className = "" }: TabsRootProps) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue} className={className}>
      {children}
    </TabsPrimitive.Root>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <TabsPrimitive.List
      className={`inline-flex items-center justify-center gap-1 border-b border-[var(--color-border)] ${className}`}
    >
      {children}
    </TabsPrimitive.List>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={`
        px-6 py-3 text-base font-medium text-[var(--color-text-muted)]
        transition-colors hover:text-[var(--color-text-dark)]
        data-[state=active]:text-[var(--color-text-dark)]
        data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
        ${className}
      `}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  return (
    <TabsPrimitive.Content value={value} className={`mt-8 ${className}`}>
      {children}
    </TabsPrimitive.Content>
  );
}
