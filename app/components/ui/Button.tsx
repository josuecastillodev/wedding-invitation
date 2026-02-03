interface ButtonProps {
  variant?: "filled" | "outlined";
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "filled",
  href,
  onClick,
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-block px-8 py-3 text-sm uppercase font-serif transition-colors duration-300 text-center";
  const variants = {
    filled: "bg-mauve text-burgundy hover:bg-mauve/80",
    outlined:
      "border border-burgundy text-burgundy hover:bg-burgundy hover:text-white",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
