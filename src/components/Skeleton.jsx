import React from 'react';

const Skeleton = ({ width, height, style }) => {
  return (
    <div 
      className="skeleton" 
      style={{ width: width || '100%', height: height || '20px', borderRadius: '8px', ...style }} 
    />
  );
};

export default Skeleton;