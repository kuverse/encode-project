"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as ContractData from "../../hardhat/artifacts/contracts/Game.sol/Game.json";
import DeployStage from "./_Components/DeployStage";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { usePublicClient } from "wagmi";

const RockPaperScissorsGame: React.FC = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [rivalAddress, setRivalAddress] = useState("");
  const [betAmount, setBetAmount] = useState("0.1");
  const [inputAddress, setInputAddress] = useState<string>("");
  const Router = useRouter();
  const client = usePublicClient();

  const deployContract = async () => {
    if (!walletClient || !address) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const { abi, bytecode } = ContractData;
      const deploymentResult = await walletClient.deployContract({
        abi,
        account: address,
        args: [address, rivalAddress, parseEther(betAmount)],
        bytecode: bytecode as `0x${string}`,
      });
      const receipt = await client?.waitForTransactionReceipt({ hash: deploymentResult });
      const contractAdd = receipt?.contractAddress;
      alert(`Contract deployed at: ${contractAdd}`);
      Router.push(`/Game/${contractAdd}`);
    } catch (error) {
      console.error("Error deploying contract:", error);
      alert("Failed to deploy contract.");
    }
  };
  const handleNavigate = () => {
    if (inputAddress.trim() === "") {
      alert("Please enter a valid address!");
      return;
    }
    Router.push(`/Game/${inputAddress}`);
  };
  return (
    <div>
      <div className="max-w-md mx-auto p-5 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold text-black">Navigate to Game</h2>

        <div className="">
          <label className="block font-medium text-black">Enter Address:</label>
          <input
            type="text"
            value={inputAddress}
            onChange={e => setInputAddress(e.target.value)}
            placeholder="0x1234..."
            className="w-full p-2 border rounded text-white"
          />
        </div>

        <button onClick={handleNavigate} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Go to Game
        </button>
      </div>
      <DeployStage
        rivalAddress={rivalAddress}
        setRivalAddress={setRivalAddress}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        onDeploy={deployContract}
      />
    </div>
  );
};

export default RockPaperScissorsGame;
