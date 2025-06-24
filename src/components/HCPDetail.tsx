import React from 'react';

interface HCPDetailProps {
  selectedNode: {
    id: string;
    label: string;
    labels: string;
    education?: string;
    experience?: string;
    publications?: string[];
  } | null;
}

export const HCPDetail: React.FC<HCPDetailProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div>
        <h2 className="text-xl font-semibold">HCP Details</h2>
        <p className="text-gray-500">Click on a node to view details</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{selectedNode.label}</h2>
      <p><strong>Type:</strong> {selectedNode.labels}</p>
      <p><strong>Education:</strong> {selectedNode.education || 'N/A'}</p>
      <p><strong>Experience:</strong> {selectedNode.experience || 'N/A'}</p>
      <div>
        <strong>Publications:</strong>
        <ul className="list-disc ml-6">
          {(selectedNode.publications || []).map((pub, i) => (
            <li key={i}>{pub}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
