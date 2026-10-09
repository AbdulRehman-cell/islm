import React from 'react';

/**
 * Reusable UI component library for the Islm platform.
 * Provides custom inputs, buttons, cards, selects, badges, and alerts with matching design system classes.
 */

// Button Component
export function Button({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled, 
  className = '', 
  ...props 
}) {
  const btnClass = variant === 'secondary' 
    ? 'btn-secondary' 
    : variant === 'ghost' 
    ? 'btn-ghost' 
    : 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${btnClass} ${className}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        border: 'none',
        ...props.style
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Card Component
export function Card({ 
  children, 
  className = '', 
  elevated = false, 
  ...props 
}) {
  const cardClass = elevated ? 'card card-elevated' : 'card';
  return (
    <div 
      className={`${cardClass} ${className}`} 
      style={{
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        boxSizing: 'border-box',
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Input Component
export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  required = false,
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`form-input ${className}`}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--text, #fff)',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
        ...props.style
      }}
      {...props}
    />
  );
}

// Select Component
export function Select({ 
  value, 
  onChange, 
  children, 
  className = '', 
  ...props 
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`form-select ${className}`}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        background: 'rgba(25, 25, 25, 0.95)',
        color: 'var(--text, #fff)',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        ...props.style
      }}
      {...props}
    >
      {children}
    </select>
  );
}

// Badge Component
export function Badge({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) {
  const getBadgeStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'var(--text-muted, #ccc)',
        };
      case 'success':
        return {
          background: 'rgba(46, 117, 89, 0.2)',
          color: '#4ade80',
          border: '1px solid rgba(74, 222, 128, 0.2)',
        };
      default: // primary / default
        return {
          background: 'var(--primary-light, rgba(163, 137, 87, 0.2))',
          color: 'var(--primary, #cfa86b)',
          border: '1px solid rgba(207, 168, 107, 0.3)',
        };
    }
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        width: 'fit-content',
        ...getBadgeStyles(),
        ...props.style
      }}
      {...props}
    >
      {children}
    </span>
  );
}

// Alert Component
export function Alert({ 
  children, 
  className = '', 
  type = 'error', 
  ...props 
}) {
  const alertClass = type === 'success' ? 'alert alert-success' : 'alert alert-error';
  return (
    <div
      className={`${alertClass} ${className}`}
      style={{
        padding: '14px 18px',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.5',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '12px 0',
        boxSizing: 'border-box',
        ...props.style
      }}
      {...props}
    >
      {type === 'success' ? '✓' : '⚠'} {children}
    </div>
  );
}

// Default export combining all UI elements
export default {
  Button,
  Card,
  Input,
  Select,
  Badge,
  Alert
};