import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";

dotenv.config();

// Alchemy
const providerApiKey = process.env.ALCHEMY_API_KEY || "";

// Infura keys
const infuraApiKey = process.env.INFURA_API_KEY || "";

const deployerPrivateKey = process.env.PRIVATE_KEY || "";

const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;

async function selfDelegateTokens() {
  const publicClient = createPublicClient({
    chain: sepolia,
    // infura
    transport: http(`https://sepolia.infura.io/v3/${infuraApiKey}`),
    // alchemy
    //transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    // infura
    transport: http(`https://sepolia.infura.io/v3/${infuraApiKey}`),
    // alchemy
    //transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);

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
