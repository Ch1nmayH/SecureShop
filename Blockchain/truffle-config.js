const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    networks: {
        sepolia: {
            provider: () => new HDWalletProvider(
                process.env.ownerAddress, // Your mnemonic or private key
                `https://sepolia.infura.io/v3/${process.env.infuraKey}` // Infura URL with the key
            ),
            network_id: "11155111", // Sepolia's network ID
            gas: 3000000, // Gas limit (can adjust as needed)
            gasPrice: 78188633915, // Gas price set to 20 gwei
            networkCheckTimeout: 10000, // Increase the timeout (in milliseconds)
            timeoutBlocks: 200, // Increase block timeout if necessary
            confirmations: 2, // Wait for 2 confirmations
        },
    },
    compilers: {
        solc: {
            version: "0.8.0", // Specify the Solidity compiler version
        },
    },
};
