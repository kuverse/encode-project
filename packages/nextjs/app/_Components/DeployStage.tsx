"use client";

import React from "react";

interface DeployStageProps {
  rivalAddress: string;
  setRivalAddress: (address: string) => void;
  betAmount: string;
  setBetAmount: (amount: string) => void;
  onDeploy: () => Promise<void>;
}

const DeployStage: React.FC<DeployStageProps> = ({
  rivalAddress,
  setRivalAddress,
  betAmount,
  setBetAmount,
  onDeploy,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-red-800">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Deploy Rock Paper Scissors Game</h2>
        <input
          type="text"
          placeholder="Enter Rival's Wallet Address"
          value={rivalAddress}
          onChange={e => setRivalAddress(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          placeholder="Bet Amount (ETH)"
          value={betAmount}
          onChange={e => setBetAmount(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          step="0.01"
        />
        <button
          onClick={onDeploy}
          className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600"
          disabled={!rivalAddress}
        >
          Deploy Game Contract
        </button>
      </div>
    </div>
  );
};

export default DeployStage;
