import type { CSSProperties, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
};

const sizeStyle: Record<Size, CSSProperties> = {
  sm: { fontSize: 12, padding: '6px 14px' },
  md: { fontSize: 14, padding: '10px 22px' },
  lg: { fontSize: 16, padding: '14px 36px' },
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantClass[variant]}${className ? ` ${className}` : ''}`}
      style={{
        ...sizeStyle[size],
        ...(fullWidth ? { width: '100%', justifyContent: 'center' } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
