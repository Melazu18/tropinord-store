/**
 * PageShell
 * Consistent horizontal spacing + vertical rhythm for page bodies.
 *
 * Use this inside route pages so each page does not have to repeat container/padding rules.
 */
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("container py-10", className)}>{children}</div>;
}
