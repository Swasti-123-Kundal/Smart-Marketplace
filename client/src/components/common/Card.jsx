import React from 'react';

const Card = ({ children, className = '', hoverable = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-all duration-300
        ${hoverable ? 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/5 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
