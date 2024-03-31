import * as dotenv from "dotenv";
import { parseEther } from "viem";

import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { createClients } from "./helpers";

dotenv.config();

const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;

async function selfDelegateTokens() {
  const { publicClient, deployer } = createClients();

  // Get command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    throw new Error("Usage: ts-node selfDelegateTokens.ts <token_amount>");
  }

  const tokenAmount = parseEther(args[0]);

  // Preparing to call the delegate function
  const tokenContractParameters = {
    address: contractAddress,
    abi: abi,
    functionName: "delegate",
    args: [deployer.account.address], // Only pass the delegatee's address
  };

  try {
    const txResponse = await deployer.writeContract(tokenContractParameters);
    await publicClient.waitForTransactionReceipt({ hash: txResponse });
    console.log(
      `Voting power successfully delegated to ${deployer.account.address}.`
    );
  } catch (error) {
    console.error("Failed to self-delegate tokens:", error);
  }
}

selfDelegateTokens().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
