# Tokenized Ballot Contract Interaction Guide

## Setup

1. **Installation**: Run `npm install` to install necessary dependencies.
2. Create a `.env` file at the root with:

   - `PRIVATE_KEY=yourPrivateKey` for the deployer/chairperson's private key.
   - `ALCHEMY_API_KEY=yourAlchemyApiKey` for network access via Alchemy.
   - `INFURA_API_KEY=yourInfuraApiKey` for network acces via Infura (Alchemy may restrict usage due to high traffic)

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

## Query vote results

// TODO

## Notes

- Safeguard your private keys and carefully manage `.env` contents.
