import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;  // Added onClick prop
}

const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div 
      className={`bg-gray-100 rounded-2xl p-4 shadow-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;