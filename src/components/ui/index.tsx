import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';
import './ui.css';

export { FlagIcon } from './FlagIcon';

// ---- Button ----
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = variant === 'ghost' ? 'btn-secondary' : `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="spinner spinner-sm" /> : icon}
      {children}
    </button>
  );
}

// ---- Input ----
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className={`form-label ${required ? 'form-label-required' : ''}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`form-input ${error ? 'form-input-error' : ''} ${className}`.trim()}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="form-error" role="alert">
            <AlertCircle size={14} />
            {error}
          </span>
        )}
        {hint && !error && (
          <span id={`${inputId}-hint`} className="form-hint">{hint}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ---- Select ----
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, required, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={selectId} className={`form-label ${required ? 'form-label-required' : ''}`}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`form-input form-select ${error ? 'form-input-error' : ''} ${className}`.trim()}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && (
          <span className="form-error" role="alert">
            <AlertCircle size={14} />
            {error}
          </span>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ---- Spinner ----
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

export function Spinner({ size = 'md', overlay = false }: SpinnerProps) {
  const sizeClass = size !== 'md' ? `spinner-${size}` : '';
  const spinner = <div className={`spinner ${sizeClass}`} />;

  if (overlay) {
    return <div className="spinner-overlay">{spinner}</div>;
  }
  return spinner;
}

// ---- Badge ----
interface BadgeProps {
  variant?: 'gold' | 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'gold', children, className = '' }: BadgeProps) {
  return <span className={`badge badge-${variant} ${className}`.trim()}>{children}</span>;
}

// ---- Card ----
interface CardProps {
  variant?: 'default' | 'glass' | 'gradient-border' | 'interactive';
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ variant = 'default', className = '', children, onClick, style }: CardProps) {
  const variantClass = variant === 'default' ? 'card' :
    variant === 'interactive' ? 'card card-interactive' :
    variant === 'glass' ? 'card-glass' :
    'card-gradient-border';

  return (
    <div 
      className={`${variantClass} ${className}`.trim()} 
      onClick={onClick} 
      role={onClick ? 'button' : undefined} 
      tabIndex={onClick ? 0 : undefined}
      style={style}
    >
      {children}
    </div>
  );
}

// ---- Modal ----
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'default' | 'wide' | 'extra-wide';
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'default', className = '' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClass = size === 'wide' ? 'modal-wide' : size === 'extra-wide' ? 'modal-extra-wide' : '';

  return createPortal(
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal-content ${sizeClass} ${className}`.trim()} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
        {title && (
          <div className="modal-header">
            <h3 className="modal-title" id="modal-title">{title}</h3>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

// ---- Toast Container ----
export function ToastContainer({ toasts, onRemove }: { toasts: { id: string; type: string; title: string; message?: string }[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  const iconMap: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{iconMap[toast.type] || 'ℹ'}</span>
          <div className="toast-text">
            <strong>{toast.title}</strong>
            {toast.message && <p style={{ fontSize: '11px', margin: '2px 0 0 0' }}>{toast.message}</p>}
          </div>
          <button className="modal-close" onClick={() => onRemove(toast.id)} aria-label="Dismiss" style={{ flexShrink: 0, padding: '4px', width: '24px', height: '24px' }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ---- Skeleton Loader ----
export function Skeleton({ className = '', variant = 'text', width, height }: { className?: string; variant?: 'text' | 'title' | 'circle' | 'rect'; width?: string | number; height?: string | number }) {
  const style = {
    width: width,
    height: height,
  };
  
  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`} 
      style={style}
    />
  );
}

// ---- Progress Bar ----
interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  return (
    <div className={`progress-bar ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
