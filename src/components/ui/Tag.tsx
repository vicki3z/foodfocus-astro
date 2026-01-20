interface Props {
  variant?: "primary" | "secondary" | "muted";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  primary: "bg-[var(--color-primary)] text-white",
  secondary: "bg-[var(--color-accent)] text-white",
  muted: "bg-[var(--color-bg-light)] text-[var(--color-text-muted)]",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Tag({
  variant = "primary",
  size = "sm",
  className = "",
  children,
}: Props) {
  return (
    <span
      className={`inline-block font-medium rounded uppercase ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
