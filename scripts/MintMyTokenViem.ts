import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import {
  createPublicClient,
  http,
  createWalletClient,
  parseEther,
  formatEther,
  toHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";

dotenv.config();

// Alchemy keys
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
// Infura keys
const infuraApiKey = process.env.INFURA_API_KEY || "";

const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;

async function mintTokens() {
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
  if (args.length !== 2) {
    throw new Error(
      "Usage: ts-node mintTokens.ts <recipient_address> <token_amount>"
    );
  }

  const recipientAddress = args[0];
  const tokenAmount = parseEther(args[1]);

  const tokenContractParameters = {
    address: contractAddress,
    abi: abi,
    functionName: "mint",
    args: [recipientAddress, tokenAmount],
  };

  try {
    const txResponse = await deployer.writeContract(tokenContractParameters);
    await publicClient.waitForTransactionReceipt({ hash: txResponse });
    console.log(`Tokens minted successfully to address ${recipientAddress}.`);
  } catch (error) {
    console.error("Failed to mint tokens:", error);
  }

  // Optionally, check and log the deployer's balance
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
}

mintTokens().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
