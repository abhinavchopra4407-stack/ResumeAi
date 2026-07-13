import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`glass-card rounded-xl p-5 border border-white/5 overflow-hidden ${
        hoverEffect ? 'glass-card-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
