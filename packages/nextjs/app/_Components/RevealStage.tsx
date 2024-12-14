import React, { useState } from "react";
import * as ContractData from "../../../hardhat/artifacts/contracts/Game.sol/Game.json";
import { useWriteContract } from "wagmi";

enum Moves {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

function RevealStage({ contractAddress }: { contractAddress: string }) {
  const [move, setMove] = useState<Moves | null>(null);
  const [secret, setSecret] = useState<string>("");
  const { writeContract } = useWriteContract();

  const handleReveal = async () => {
    if (move === null || !secret) {
      alert("Please select a move and enter your secret.");
      return;
    }

    try {
      writeContract({
        abi: ContractData.abi,
        address: contractAddress,
        functionName: "revealMove",
        args: [move, secret],
      });

      alert("Move revealed successfully!");
    } catch (error) {
      console.error("Error revealing move:", error);
      alert("Failed to reveal move.");
    }
  };

  return (
    <div className="reveal-stage p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Reveal Your Move</h2>

      <div className="move-selection mb-4">
        <p className="mb-2">Select Your Move:</p>
        <div className="flex gap-2">
          {Object.keys(Moves)
            .filter(key => isNaN(Number(key)))
            .map(moveName => (
              <button
                key={moveName}
                className={`px-4 py-2 rounded ${
                  move === Moves[moveName as keyof typeof Moves] ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
                onClick={() => setMove(Moves[moveName as keyof typeof Moves])}
              >
                {moveName}
              </button>
            ))}
        </div>
      </div>

      <div className="secret-input mb-4">
        <label htmlFor="secret" className="block mb-2">
          Enter Your Secret:
        </label>
        <input
          id="secret"
          type="text"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter your secret phrase"
        />
      </div>

      <button
        onClick={handleReveal}
        disabled={move === null || !secret}
        className="w-full py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
      >
        Reveal Move
      </button>
    </div>
  );
}

export default RevealStage;
