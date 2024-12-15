"use client";

import { ReactNode } from "react";
import * as ContractData from "../../../public/Game.json";
import { encodePacked, formatEther, keccak256 } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import CommitStage from "~~/app/_Components/CommitStage";
import RevealStage from "~~/app/_Components/RevealStage";

enum Moves {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

type Player = [string, string, number];

function Page({ params }: { params: { ContractAddress: string } }) {
  const ContractAddress = params.ContractAddress;
  const { writeContract } = useWriteContract();

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
  // Extracting values from the bet amount query
  const { data: betAmount, isLoading: isBetLoading, isError: isBetError, error: betError } = betAmountQuery;

  // Extracting values from the player1 query
  const { isLoading: isPlayer1Loading, isError: isPlayer1Error, error: player1Error } = player1Query;
  const player1 = (player1Query.data as Player) || ["", "", 0];
  // Extracting values from the player2 query
  const { isLoading: isPlayer2Loading, isError: isPlayer2Error, error: player2Error } = player2Query;
  const player2 = (player2Query.data as Player) || ["", "", 0];

  const commitMove = async (move: Moves, secret: string) => {
    if (!ContractAddress) {
      alert("Contract address not set. Please deploy the contract first.");
      return;
    }

    try {
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
      return <p>It`&apos;`s a draw!</p>;
    } else if (winner) {
      return (
        <p>
          Winner: {winner as ReactNode} Congrats on the {formatEther(betAmount as bigint)} ETH
        </p>
      );
    }

    return null;
  };
  return (
    <div>
      {isBetLoading ? (
        <p>Loading bet amount...</p>
      ) : isBetError ? (
        <p>Error fetching bet amount: {betError.message}</p>
      ) : (
        <p>Bet Amount: {formatEther(betAmount as bigint)?.toString()} ETH</p>
      )}

      {isPlayer1Loading ? (
        <p>Loading player 1...</p>
      ) : isPlayer1Error ? (
        <p>Error fetching player 1: {player1Error.message}</p>
      ) : (
        <div>
          <p>Player 1 Address: {player1[0]}</p>
          <p>Player 1 commitment: {player1[1]}</p>
          <p>Player 1 reveal: {player1[2] != 0 ? "true" : "false"}</p>
        </div>
      )}

      {isPlayer2Loading ? (
        <p>Loading player 2...</p>
      ) : isPlayer2Error ? (
        <p>Error fetching player 2: {player2Error.message}</p>
      ) : (
        <div>
          <p>Player 2 Address: {player2[0]}</p>
          <p>Player 2 commitment: {player2[1]}</p>
          <p>Player 2 reveal: {player2[2] != 0 ? "true" : "false"}</p>
          {player1[1] == "0x0000000000000000000000000000000000000000000000000000000000000000" ||
          player2[1] == "0x0000000000000000000000000000000000000000000000000000000000000000" ? (
            <div>
              <CommitStage onCommit={commitMove} player1={player1} player2={player2} />
            </div>
          ) : (
            <div>
              {player2[2] != 0 && player1[2] != 0 ? (
                renderWinnerInfo()
              ) : (
                <RevealStage contractAddress={ContractAddress} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
