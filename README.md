# Decentralized Album Collection

![](screenshot.jpg)

DApp to manage, display and share an online album collection linked to a Metamask wallet, deployed on Polygon.

The App logic consists of two smart contracts:

- **NFT Contract** - This contract allows users to mint albums as ERC-721 tokens.
- **Collection Contract** - This contract allows users to add, transfer or remove albums from their collection.

### Prerequisites

The followings are required for this project:

1. Node.js installed on your machine
2. Metamask wallet extension installed as a browser extension

### The Stack

This is a full stack application using:

- **Web application framework** - [Next.js](https://nextjs.org/)
- **CSS framework** - [Tailwind](https://tailwindcss.com/)
- **Solidity development environment** - [Hardhat](https://hardhat.org/)
- **File Storage** - [IPFS](https://ipfs.io/)
- **Ethereum Web Client Library** - [Ethers.js](https://docs.ethers.io/v5/)

## Getting Started

Clone the project and install all dependencies:

```sh
npm install
```

Hardhat configuration is set up for a deployment on the Polygon Mumbai test network, so configure and connect to the **Polygon Mumbai** test network on Metamask, and get some Matic from the [Matic Faucet](https://faucet.matic.network/) so that you can interact with the application.

## Running the Project

To deploy the smart contract, create a `.env` file at the root of the project using the template provided in the project. You will need to get:

- A RPC Endpoint URL from Infura or Alchemy (Mumbai Network)
- A [Polygonscan](https://polygonscan.com/) API Key
- The Private Key from your Metamask deployer account

Execute the following command to deploy to the Polygon network:

```sh
npx hardhat run scripts/deploy.js --network mumbai
```

When the deployment is complete, the CLI should print out the addresses of the contracts that were deployed. Replace the content of `config.js` with these values.

You can verify the contracts on Polygonscan by running the following command, replacing the address of both deployed contracts:

````sh
npx hardhat verify --network mumbai <deployed-contract-address>
```

Finally, you can now test out the app by running the command:

```sh
npm run dev
````

### Next Steps

- Add the transfer to another wallet feature
- Display activity feed of the user

### Updates

- **Aug 01, 2022**: Created front end page with creation, removal and display features
- **Jul 27, 2022**: Created both smart contracts, deployed and verified on Polygon Mumbai network
