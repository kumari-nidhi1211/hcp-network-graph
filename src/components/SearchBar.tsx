import React from 'react';

export const SearchBar: React.FC<{ onSearch: (name: string) => void }> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search HCP by name..."
      className="w-full p-3 border rounded-xl shadow-sm"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch((e.target as HTMLInputElement).value.trim());
        }
      }}
    />
  );
};
