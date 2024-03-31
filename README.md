# Tokenized Ballot Contract Interaction Guide

## Setup

1. **Installation**: Run `npm install` to install necessary dependencies.
2. Create a `.env` file at the root as described in `.env.example`
3. **Security**: Never commit your `.env` file to version control.

## Compile Contracts MyToken & TokenizedBallot

- Compile the contract: `npx hardhat compile`.

## Deploy MyToken

- Deploy by running: `npx ts-node ./scripts/DeployMyTokenViem.ts`.

## Mint Tokens to your own or other addresses

- Mint to your address / other addresses: `npx ts-node ./scripts/MintMyTokenViem.ts <Recipient address> <Token amount>`.

## Delegate to your own address to assign voting power

- Delegate to your own address running: `npx ts-node ./scripts/DelegateTokens.ts <delegateAddress>`.

## Deploy TokenizedBallot

- Run this command: `npx ts-node ./scripts/DeployTokenizedBallotViem.ts <proposal1> <proposaln>`

## Vote

- Run this command: `npx ts-node ./scripts/VoteViem.ts <proposal index> <Token amount>`

## Get Voting Power available and spent

- Run this command: `npx ts-node ./scripts/GetVotingPowerInfo.ts <address to check>`

## Get winning proposal

- Run this command: `npx ts-node ./scripts/GetWinningProposal.ts`

## Notes

- Safeguard your private keys and carefully manage `.env` contents.
