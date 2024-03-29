import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { createPublicClient, http, createWalletClient, parseEther, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
// Import ABIs
import { abi as tokenizedBallotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { abi as myTokenAbi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
// Import the TokenizedBallot bytecode
import { bytecode as tokenizedBallotBytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

dotenv.config();

// Environment Variables
const infuraApiKey = process.env.INFURA_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const myTokenContractAddress = process.env.CONTRACT_ADDRESS || ""; // Ensure this is correctly defined in your .env

async function deployTokenizedBallot() {
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://sepolia.infura.io/v3/${infuraApiKey}`),
    });

    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const deployer = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://sepolia.infura.io/v3/${infuraApiKey}`),
    });

    // Command-line arguments for proposal names
    const args = process.argv.slice(2);
    if (args.length < 1) {
        throw new Error("Usage: ts-node deployTokenizedBallot.ts <proposalName1> <proposalName2> ...");
    }

    // Convert proposal names to bytes32 using toHex
    const proposalNamesBytes32 = args.map(name => toHex(name, { size: 32 }));

    // Fetch the current block number
    const currentBlockNumber = await publicClient.getBlockNumber();

    // Assuming currentBlockNumber is a bigint and you want a block that's slightly in the past
    const historicalBlockNumber = currentBlockNumber - 6n; // Subtracting 6 blocks

    // You can directly use historicalBlockNumber as it represents a block number in the past
    console.log("Deploying TokenizedBallot contract...");
    const tokenizedBallotDeployment = await deployer.deployContract({
        abi: tokenizedBallotAbi,
        bytecode: tokenizedBallotBytecode as `0x${string}`,
        // Pass historicalBlockNumber directly instead of historicalBlockTimestamp
        args: [proposalNamesBytes32, myTokenContractAddress, historicalBlockNumber]
    });

    console.log("TokenizedBallot contract deployed to:", tokenizedBallotDeployment);

}

deployTokenizedBallot().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
