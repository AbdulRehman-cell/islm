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

export function Spinner({ className = '', ...props }) {
  return (
    <div className={`spinner-container ${className}`} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'1rem', width:'100%' }} {...props}>
      <div style={{ width:'2.5rem', height:'2.5rem', border:'3px solid rgba(207,168,107,.2)', borderTopColor:'var(--primary,#cfa86b)', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
      <style dangerouslySetInnerHTML={{__html:'@keyframes spin{to{transform:rotate(360deg)}}'}} />
    </div>
  )
}

export function Textarea({ className = '', style = {}, ...props }) {
  return <textarea className={className} style={{ width:'100%', padding:'12px 16px', border:'1px solid rgba(255,255,255,.15)', borderRadius:'8px', fontSize:'15px', background:'rgba(255,255,255,.05)', color:'var(--text,#fff)', outline:'none', resize:'vertical', minHeight:'100px', boxSizing:'border-box', ...style }} {...props} />;
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.7)' }} onClick={onClose}>
      <div className="card" style={{ maxWidth:'500px', width:'90%', maxHeight:'80vh', overflowY:'auto' }} onClick={(e) => e.stopPropagation()}>
        {title && <h3 style={{ marginBottom:'1rem' }}>{title}</h3>}
        {children}
        <button className="btn-ghost" onClick={onClose} style={{ marginTop:'1rem' }}>Close</button>
      </div>
    </div>
  )
}

export function Stat({ value, label, icon, className = '' }) {
  return (
    <div className={`stat ${className}`} style={{ textAlign:'center', padding:'1.5rem', background:'rgba(255,255,255,.04)', borderRadius:'12px', border:'1px solid rgba(255,255,255,.08)' }}>
      {icon && <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{icon}</div>}
      <div style={{ fontSize:'2.25rem', fontWeight:700, color:'var(--primary,#cfa86b)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'.875rem', color:'var(--muted,#aaa)', marginTop:'.35rem' }}>{label}</div>
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', description, action, icon = '📭' }) {
  return (
    <div style={{ textAlign:'center', padding:'4rem 2rem', color:'var(--muted,#aaa)' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>{icon}</div>
      <h3 style={{ margin:'0 0 .5rem', color:'var(--text,#fff)', fontWeight:600 }}>{title}</h3>
      {description && <p style={{ margin:'0 0 1.5rem', maxWidth:'400px', marginInline:'auto' }}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`page-header ${className}`} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
      <div>
        <h1 style={{ margin:0, fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700 }}>{title}</h1>
        {subtitle && <p style={{ margin:'.35rem 0 0', color:'var(--muted,#aaa)' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>{actions}</div>}
    </div>
  )
}

export function Table({ columns = [], rows = [], className = '' }) {
  return (
    <div style={{ overflowX:'auto' }}>
      <table className={`table ${className}`} style={{ width:'100%', borderCollapse:'collapse', fontSize:'.9375rem' }}>
        <thead>
          <tr>{columns.map((col, i) => <th key={i} style={{ padding:'.75rem 1rem', textAlign:'left', borderBottom:'2px solid rgba(255,255,255,.1)', fontWeight:600, color:'var(--muted,#aaa)', whiteSpace:'nowrap' }}>{typeof col === 'string' ? col : col.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom:'1px solid rgba(255,255,255,.06)' }}>
              {columns.map((col, ci) => <td key={ci} style={{ padding:'.75rem 1rem' }}>{typeof col === 'string' ? row[col] : (col.accessor ? row[col.accessor] : row[ci])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Tabs({ tabs = [], active, onChange, className = '' }) {
  return (
    <div className={`tabs ${className}`} style={{ display:'flex', gap:'.25rem', borderBottom:'2px solid rgba(255,255,255,.1)', marginBottom:'1.5rem' }}>
      {tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id
        const label = typeof tab === 'string' ? tab : tab.label
        const isActive = active === id
        return (
          <button key={id} onClick={() => onChange?.(id)} style={{ padding:'.6rem 1.25rem', background:'none', border:'none', borderBottom:isActive ? '2px solid var(--primary,#cfa86b)' : '2px solid transparent', marginBottom:'-2px', fontWeight:isActive ? 600 : 400, color:isActive ? 'var(--primary,#cfa86b)' : 'var(--muted,#aaa)', cursor:'pointer', borderRadius:'4px 4px 0 0', transition:'all .15s' }}>
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function toast(message, type = 'info') {
  if (typeof document === 'undefined') return
  const colors = { success:'#16a34a', error:'#dc2626', warning:'#d97706', info:'#374151' }
  const el = document.createElement('div')
  el.textContent = message
  el.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:10px;color:#fff;font-size:14px;font-weight:500;background:${colors[type]||colors.info};box-shadow:0 4px 16px rgba(0,0,0,.3);transition:opacity .3s;`
  document.body.appendChild(el)
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300) }, 3000)
}
toast.success = (m) => toast(m, 'success')
toast.error = (m) => toast(m, 'error')
toast.warning = (m) => toast(m, 'warning')
toast.info = (m) => toast(m, 'info')

export default { Button, Card, Input, Select, Badge, Alert, Spinner, Textarea, Modal, Stat, EmptyState, PageHeader, Table, Tabs, toast };