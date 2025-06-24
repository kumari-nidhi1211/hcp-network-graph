import React from 'react';

interface GraphViewProps {
    containerRef: React.RefObject<HTMLDivElement | null>; // ✅ allow null
}
  

export const GraphView: React.FC<GraphViewProps> = ({ containerRef }) => {
  return <div ref={containerRef} className="w-full h-full" />;
};
