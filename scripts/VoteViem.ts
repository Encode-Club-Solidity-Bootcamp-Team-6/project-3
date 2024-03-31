import * as dotenv from "dotenv";
import { parseEther } from "viem";
import { abi as tokenizedBallotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { createClients } from "./helpers";

dotenv.config();

const tokenizedBallotAddress = process.env
  .TOKENIZED_BALLOT_ADDRESS as `0x${string}`;

async function voteOnProposal() {
  const { publicClient, deployer } = createClients();

  // Get command line arguments for proposal index and token amount
  const args = process.argv.slice(2);
  if (args.length < 2) {
    throw new Error(
      "Usage: ts-node voteOnProposal.ts <proposalIndex> <tokenAmount>"
    );
  }

  // Parse the CLI arguments for proposal index and token amount
  const proposalIndex = parseInt(args[0]);
  const tokenAmount = parseEther(args[1]); // Convert token amount to Wei

  console.log(
    `Voting on proposal index ${proposalIndex} with amount ${args[1]}...`
  );

  try {
    const txResponse = await deployer.writeContract({
      address: tokenizedBallotAddress,
      abi: tokenizedBallotAbi,
      functionName: "vote",
      args: [proposalIndex, tokenAmount], // Arguments passed as an array
    });

    await publicClient.waitForTransactionReceipt({ hash: txResponse });
    console.log(
      `Successfully voted on proposal index ${proposalIndex} with amount ${args[1]}.`
    );
  } catch (error) {
    console.error("Failed to vote on proposal:", error);
  }
}

voteOnProposal().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
