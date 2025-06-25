import React from 'react';

export const SearchBar: React.FC<{ onSearch: (name: string) => void }> = ({ onSearch }) => {
  return (
    <div className="flex items-center justify-between mb-4  p-[10px] bg-white hadow rounded-lg">
      <input
        type="text"
        placeholder="🔍 Search"
        className="w-[80vw] px-3 py-2 border rounded-xl shadow-sm"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value.trim());
        }}
      />
      <button className="w-[15vw] px-3 py-2 border rounded-lg text-sm text-gray-600">
        Filter ▽
      </button>
    </div>
  );
};
