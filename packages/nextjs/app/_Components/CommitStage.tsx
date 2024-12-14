"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";

// Enum for moves
enum Moves {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}
type Player = [string, string, number];
const CommitStage: React.FC<{
  player1: Player;
  player2: Player;
  onCommit: (move: Moves, secret: string) => void;
}> = ({ onCommit, player1, player2 }) => {
  const [selectedMove, setSelectedMove] = useState<Moves | null>(null);
  const [secret, setSecret] = useState<string>("");

  const generateRandomSecret = () => Math.random().toString(36).substring(2, 15);
  const { address } = useAccount();
  console.log(address);
  console.log(player1);
  console.log(player2);
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Commit Your Move</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {Object.values(Moves)
          .filter(value => typeof value === "number")
          .map(move => (
            <button
              key={move}
              onClick={() => setSelectedMove(move as Moves)}
              className={`p-4 rounded ${
                selectedMove === move ? "bg-blue-500 " : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {Moves[move as Moves]}
            </button>
          ))}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-black">Secret:</label>
        <input
          type="text"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          placeholder="Enter or generate a secret"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={() => setSecret(generateRandomSecret())}
          className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Generate Random Secret
        </button>
      </div>

      <button
        onClick={() => selectedMove !== null && secret && onCommit(selectedMove, secret)}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={
          selectedMove === null ||
          !secret ||
          (address?.toLowerCase() != player1[0].toLowerCase() && address?.toLowerCase() != player2[0].toLowerCase()) ||
          (address.toLowerCase() === player1[0].toLowerCase() &&
            player1[1] !== "0x0000000000000000000000000000000000000000000000000000000000000000") ||
          (address.toLowerCase() === player2[0].toLowerCase() &&
            player2[1] !== "0x0000000000000000000000000000000000000000000000000000000000000000")
        }
      >
        Commit Move
      </button>
    </div>
  );
};

export default CommitStage;
