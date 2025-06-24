import React from 'react';
import HCPNetworkGraph from './components/HCPNetworkGraph';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
      <HCPNetworkGraph />
    </div>
  );
};

export default App;