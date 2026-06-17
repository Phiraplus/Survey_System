import React from 'react';

interface FlagIconProps {
  code: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FlagIcon({ code, size = '1.2em', className = '', style }: FlagIconProps) {
  if (!code) return null;
  
  const cleanCode = code.toLowerCase();
  const isISO = cleanCode.length === 2;

  const fontSize = /^\d+$/.test(size) ? `${size}px` : size;
  const isSpecialRegion = ['gb-eng', 'gb-sct', 'gb-wls', 'asean'].includes(cleanCode);

  if (!isISO && !isSpecialRegion) {
    return (
      <span 
        className={className}
        style={{ 
          fontSize: '10px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '1.33em', 
          height: '1em', 
          backgroundColor: 'var(--bg-tertiary)', 
          borderRadius: '2px', 
          color: 'var(--text-tertiary)', 
          fontWeight: 800,
          textTransform: 'uppercase',
          flexShrink: 0,
          border: '1px solid var(--border-color)',
          ...style
        }}
      >
        {code.substring(0, 3)}
      </span>
    );
  }

  return (
    <span 
      className={`fi fi-${cleanCode} ${className}`} 
      style={{ 
        display: 'inline-block',
        width: '1.33em', 
        height: '1em',
        minWidth: '18px',
        minHeight: '13px',
        fontSize: fontSize,
        borderRadius: '2px',
        flexShrink: 0,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        backgroundSize: 'cover',
        verticalAlign: 'middle',
        ...style
      }} 
    />
  );
}
