"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ContractData from "../public/Game.json";
import DeployStage from "./_Components/DeployStage";
import { isAddress, parseEther } from "viem";
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
  const isAddressValid = isAddress(inputAddress);
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
      <div className="flex justify-around lg:flex-nowrap flex-wrap">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold text-black">Navigate to Your Game:</h2>

          <div className="w-96">
            <label className="block font-medium text-black">Enter Address:</label>
            <input
              type="text"
              value={inputAddress}
              onChange={e => setInputAddress(e.target.value)}
              placeholder="0xB4787C793e53Fe26aB6Beb0E5A2098506fa553cd"
              className="mt-2 w-full p-2 border rounded text-white mb-4"
            />
            {!isAddressValid && inputAddress && <p className="text-red-500">Invalid Contract address</p>}
          </div>

          <button
            onClick={handleNavigate}
            className={`w-full p-2 rounded ${isAddressValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"}`}
            disabled={!isAddressValid}
          >
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
      <div className="mt-10 flex items-center justify-center">
        <Image src="/image.png" width={1000} height={600} alt="Tutorial" className="rounded-3xl" />
      </div>
    </div>
  );
};

export default RockPaperScissorsGame;
