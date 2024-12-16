"use client";

import { ReactNode, useEffect, useState } from "react";
import ContractData from "../../../public/Game.json";
import { encodePacked, formatEther, keccak256 } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import CommitStage from "~~/app/_Components/CommitStage";
import RevealStage from "~~/app/_Components/RevealStage";
import Image from "next/image";

enum Moves {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

type Player = [string, string, number];

function Page({ params }: { params: { ContractAddress: string } }) {
  const ContractAddress = params.ContractAddress;
  const { writeContract } = useWriteContract();
  const [gameAddresses, setGameAddresses] = useState<string[]>([]);
  const [move, setMove] = useState<Moves | null>(null);
  const [secret, setSecret] = useState<string>("");

  useEffect(() => {
    const savedMove = localStorage.getItem("move");
    const savedSecret = localStorage.getItem("secret");
  
    if (savedMove) {
      setMove(JSON.parse(savedMove));
    }
    if (savedSecret) {
      setSecret(savedSecret);
    }
  }, []);
  

  const betAmountQuery = useReadContract({
    abi: ContractData.abi,
    address: ContractAddress,
    functionName: "betAmount",
  });

  const player1Query = useReadContract({
    abi: ContractData.abi,
    address: ContractAddress,
    functionName: "players",
    args: [0],
  });

  const player2Query = useReadContract({
    abi: ContractData.abi,
    address: ContractAddress,
    functionName: "players",
    args: [1],
  });

  const winnerQuery = useReadContract({
    abi: ContractData.abi,
    address: ContractAddress,
    functionName: "viewWinner",
  });

  const { data: winner, isLoading: isWinnerLoading, isError: isWinnerError, error: winnerError } = winnerQuery;
  const { data: betAmount, isLoading: isBetLoading, isError: isBetError, error: betError } = betAmountQuery;
  const { isLoading: isPlayer1Loading, isError: isPlayer1Error, error: player1Error } = player1Query;
  const player1 = (player1Query.data as Player) || ["", "", 0];
  const { isLoading: isPlayer2Loading, isError: isPlayer2Error, error: player2Error } = player2Query;
  const player2 = (player2Query.data as Player) || ["", "", 0];

  const commitMove = async (move: Moves, secret: string) => {
    if (!ContractAddress) {
      alert("Contract address not set. Please deploy the contract first.");
      return;
    }
    try {
      setMove(move);
      setSecret(secret);

      localStorage.setItem("move", JSON.stringify(move));
      localStorage.setItem("secret", secret);

      console.log(move, secret);
      const encoded = encodePacked(["uint8", "string"], [move, secret]);
      const commitHash = keccak256(encoded);

      writeContract({
        abi: ContractData.abi,
        address: ContractAddress,
        functionName: "commitMove",
        args: [commitHash],
        value: betAmount as bigint,
      });
      alert("Move committed successfully!");
    } catch (error) {
      console.error("Error committing move:", error);
      alert("Failed to commit move.");
    }
  };

  const renderWinnerInfo = () => {
    if (isWinnerLoading) return <p>Loading winner...</p>;
    if (isWinnerError) return <p>Error fetching winner: {winnerError?.message}</p>;

    // Assuming the winner is returned as an address or a specific identifier
    if (winner === "0x0000000000000000000000000000000000000000") {
      return <p className="text-lg text-black">Draw! Try again.</p>;
    } else if (winner) {
      return (
        <p className="text-lg text-black">
          Winner: {winner as ReactNode} Congrats on the {formatEther(betAmount as bigint)} ETH
          Move and secret: {move}{secret}
        </p>
      );
    }

    return null;
  };
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto bg-white">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/images/rps-logo.png"
          width={400}
          height={400}
          alt="Rock Paper Scissors"
          className="mx-auto"
        />
      </div>
     
      {/* Bet Amount */}
      {isBetLoading ? (
        <p>Loading bet amount...</p>
      ) : isBetError ? (
        <p>Error fetching bet amount: {betError.message}</p>
      ) : (
        <p className="text-xl bg-green-500 font-bold text-center">
          Bet Amount: {formatEther(betAmount as bigint)?.toString()} ETH
        </p>
      )}
  
      {/* Player Cards */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Player 1 Card */}
        {isPlayer1Loading ? (
          <p>Loading Player 1...</p>
        ) : isPlayer1Error ? (
          <p>Error fetching Player 1: {player1Error.message}</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-lg space-y-4 w-300 lg:w-1/2">
            {/* Player 1 Header */}
            <div className="flex items-center space-x-4">
              <img
                src="/images/girl.webp"
                alt="Player 1"
                className="w-16 h-16 object-cover rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Player 1:</h2>
                <h3 className="text-lg font-bold text-gray-800">
                  {`${player1[0].slice(0, 6)}...${player1[0].slice(-8)}`}
                </h3>
              </div>
            </div>
  
            {/* Player 1 Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-600">Move Chosen</span>
                <input
                  type="checkbox"
                  readOnly
                  checked={
                    player1[1] !==
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                  }
                />
              </div>
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-600">Revealed</span>
                <input
                  type="checkbox"
                  readOnly
                  checked={player1[2] !== 0}
                />
              </div>
            </div>
          </div>
        )}
  
        {/* Player 2 Card */}
        {isPlayer2Loading ? (
          <p>Loading Player 2...</p>
        ) : isPlayer2Error ? (
          <p>Error fetching Player 2: {player2Error.message}</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-lg space-y-4 w-300 lg:w-1/2">
            {/* Player 2 Header */}
            <div className="flex items-center space-x-4">
              <img
                src="/images/boy.webp"
                alt="Player 2"
                className="w-16 h-16 object-cover rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Player 2:</h2>
                <h3 className="text-lg font-bold text-gray-800">
                  {`${player2[0].slice(0, 6)}...${player2[0].slice(-8)}`}
                </h3>
              </div>
            </div>
  
            {/* Player 2 Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-600">Move Chosen</span>
                <input
                  type="checkbox"
                  readOnly
                  checked={
                    player2[1] !==
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                  }
                />
              </div>
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <span className="font-medium text-gray-600">Revealed</span>
                <input
                  type="checkbox"
                  readOnly
                  checked={player2[2] !== 0}
                />
              </div>
            </div>
          </div>
        )}
      </div>
  
      {/* Commit or Reveal Stage */}
      {player1[1] === "0x0000000000000000000000000000000000000000000000000000000000000000" ||
      player2[1] === "0x0000000000000000000000000000000000000000000000000000000000000000" ? (
        <CommitStage onCommit={commitMove} player1={player1} player2={player2} />
      ) : (
        <div>
          {player2[2] !== 0 && player1[2] !== 0 ? (
            renderWinnerInfo()
          ) : (
          <RevealStage 
            contractAddress={ContractAddress} 
            move={move as Moves} 
            secret={secret} 
          />            
             
          )}
        </div>
      )}
       <p className="font-medium text-gray-600">
        Move: {move ? Moves[move] : "Waiting for move..."}
      </p>
      <p className="font-medium text-gray-600">
        Secret: {secret || "Waiting for secret..."}
      </p>
    </div>
  );
  
  
  
}

export default Page;
