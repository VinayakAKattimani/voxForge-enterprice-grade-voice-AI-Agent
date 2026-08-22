import React from "react";

const VARIANTS = {
  primary: "bg-signal text-[#04211D] border-signal hover:opacity-90",
  secondary: "bg-surface text-ink border-lineStrong hover:bg-surfaceHover",
  ghost: "bg-transparent text-ink2 border-transparent hover:bg-surfaceHover",
  danger: "bg-dangerDim text-danger border-dangerDim hover:opacity-90",
};

const SIZES = {
  sm: "px-3 py-1.5 text-[12.5px]",
  md: "px-3.5 py-2 text-[13.5px]",
};

export default function Button({
  children,
  variant = "secondary",
  size = "md",
  icon: Icon,
  disabled,
  className = "",
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
