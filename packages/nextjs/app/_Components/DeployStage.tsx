"use client";

import React from "react";
import { isAddress } from "viem";

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
  const isRivalAddressValid = isAddress(rivalAddress);
  return (
    <div className="mt-4 flex items-center justify-center text-white">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Deploy Rock Paper Scissors Game</h2>
        <input
          type="text"
          placeholder="Enter Rival's Wallet Address"
          value={rivalAddress}
          onChange={e => setRivalAddress(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        {!isRivalAddressValid && rivalAddress && <p className="text-red-500 mb-2">Invalid Ethereum address</p>}
        <label className="block font-medium text-black">Bet Amount</label>
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
          className={`w-full p-2 rounded ${isRivalAddressValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"}`}
          disabled={!isRivalAddressValid}
        >
          Deploy Game Contract
        </button>
      </div>
    </div>
  );
};

export default DeployStage;
