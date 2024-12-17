import React from "react";
import ContractData from "../../public/Game.json";
import { useWriteContract } from "wagmi";
import Image from "next/image";

enum Moves {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

const moveImages = {
  [Moves.Rock]: "/images/rock.png", // Replace with the actual path to your rock image
  [Moves.Paper]: "/images/paper.png", // Replace with the actual path to your paper image
  [Moves.Scissors]: "/images/scissors.png", // Replace with the actual path to your scissors image
};



function RevealStage({
  contractAddress,
  move,
  secret,
  surrender
}: {
  contractAddress: string;
  move: Moves;
  secret: string;
  surrender: () => void 
}) {
  const { writeContract } = useWriteContract();

  const handleReveal = async () => {
    if (!move || !secret) {
      alert("Move or secret is missing.");
      return;
    }

    try {
      await writeContract({
        abi: ContractData.abi,
        address: contractAddress,
        functionName: "revealMove",
        args: [move, secret],
      });

      //alert("Move revealed successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 5000); 
    } catch (error) {
      console.error("Error revealing move:", error);
      alert("Failed to reveal move.");
    }
  };

  return (
    <div className="reveal-stage p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-black items-center justify-center text-center">Chosen Move:</h2>

      <div className="move-display mb-4 flex items-center justify-center text-center">
        <Image
          src={moveImages[move]}
          alt={Moves[move]}
          width={100}
          height={100}
          className="mb-2"
        />
        <p className="ml-2 font-medium text-gray-700">{Moves[move]}</p>
      </div>


      
      <button
        onClick={handleReveal}
        className="w-full py-5 bg-green-500 text-white rounded disabled:bg-gray-300"
      >
        Reveal Move
      </button>
      <button className="mt-2 w-full py-5 bg-red-500 text-white rounded disabled:bg-gray-300" onClick={surrender}>
            Forfeit
          </button>
    </div>
  );
}

export default RevealStage;
