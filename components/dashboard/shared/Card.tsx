import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;  // Added style prop
}

const Card = ({ children, className = '', onClick, style }: CardProps) => {
  return (
    <div 
      className={`rounded-2xl p-4 shadow-sm ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;