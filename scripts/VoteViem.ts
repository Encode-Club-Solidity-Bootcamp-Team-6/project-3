// voteOnProposal.ts

import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi as tokenizedBallotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

dotenv.config();

// Alchemy
const providerApiKey = process.env.ALCHEMY_API_KEY || "";

// Infura keys
const infuraApiKey = process.env.INFURA_API_KEY || "";


const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const tokenizedBallotAddress = process.env.TOKENIZED_BALLOT_ADDRESS as `0x${string}`;

async function voteOnProposal() {
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
    console.log("Voter address:", deployer.account.address);

    // Get command line arguments for proposal index and token amount
    const args = process.argv.slice(2);
    if (args.length < 2) {
        throw new Error("Usage: ts-node voteOnProposal.ts <proposalIndex> <tokenAmount>");
    }

    // Parse the CLI arguments for proposal index and token amount
    const proposalIndex = parseInt(args[0]);
    const tokenAmount = parseEther(args[1]); // Convert token amount to Wei

    console.log(`Voting on proposal index ${proposalIndex} with amount ${args[1]}...`);

    try {
        
        const txResponse = await deployer.writeContract({
            address: tokenizedBallotAddress,
            abi: tokenizedBallotAbi,
            functionName: "vote",
            args: [proposalIndex, tokenAmount], // Arguments passed as an array
        });
        
        await publicClient.waitForTransactionReceipt({ hash: txResponse });
        console.log(`Successfully voted on proposal index ${proposalIndex} with amount ${args[1]}.`);
    } catch (error) {
        console.error("Failed to vote on proposal:", error);
    }
}

voteOnProposal().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});