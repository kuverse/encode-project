"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as ContractData from "../../hardhat/artifacts/contracts/Game.sol/Game.json";
import CommitStage from "./_Components/CommitStage";
import DeployStage from "./_Components/DeployStage";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { usePublicClient } from "wagmi";

const RockPaperScissorsGame: React.FC = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [rivalAddress, setRivalAddress] = useState("");
  const [betAmount, setBetAmount] = useState("0.1");
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
  //{gameStage === "commit" && <CommitStage onCommit={commitMove} />}
  return (
    <div>
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
