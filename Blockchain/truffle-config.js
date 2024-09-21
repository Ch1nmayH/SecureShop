const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();


module.exports = {
    networks: {
        sepolia: {
            provider: () => new HDWalletProvider(process.env.ownerAddress, `https://sepolia.infura.io/v3/${process.env.infuraKey}`),
            network_id: "11155111", // Sepolia's id
            gas: 5500000, // Gas limit
            gasPrice: 20000000000 // 20 gwei
        },
    },
    compilers: {
        solc: {
            version: "0.8.0", // Specify the compiler version
        },
    },
};
