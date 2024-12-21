# SecureShop: A Blockchain-powered Marketplace

SecureShop leverages blockchain technology to provide a secure and transparent e-commerce platform. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and integrated with Ethereum smart contracts using Solidity, SecureShop ensures decentralized, fraud-resistant transactions for both buyers and sellers.

## Features
- **Decentralized Transactions**: All payments are processed using cryptocurrencies and recorded on the blockchain for transparency and security.
- **Integration with MetaMask**: Users can connect their MetaMask wallets to conduct transactions.
- **Smart Contracts**: Automated transaction handling using Solidity and Truffle.
- **Comprehensive E-commerce Functionality**: Buyers can browse products and manage shopping carts, while sellers can list products, manage inventory, and track sales.
- **Sepolia Ethereum Test Network**: Transactions are tested and executed on the Sepolia network.

## Installation Guide

### Prerequisites
1. **Node.js**: Install [Node.js](https://nodejs.org/).
2. **MongoDB**: Install and set up MongoDB.
3. **Truffle Suite**: Install Truffle by running `npm install -g truffle`.
4. **MetaMask**: Install the MetaMask browser extension.
5. **Ganache** (optional): For local blockchain development and testing.
6. **Git**: Install Git for version control.

### Cloning the Repository
```bash
git clone https://github.com/Ch1nmayH/SecureShop.git
cd SecureShop
```
### Setting Up the Backend
1. Navigate to the ```backend``` folder:
```bash
cd backend
```
2. Install dependencies:

```bash
npm install
```
3. Set up environment variables by creating a .env file:
```bash
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```
4. Start the server:
```bash
npm start
```

### Setting Up the Frontend
1. Navigate to the ```frontend``` folder:
```bash
cd ../frontend
```
2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

### Setting Up the Blockchain
1. Navigate to the ```blockchain``` folder:
```bash
cd ../blockchain
```
2. Install dependencies:
```bash
npm install
```
3. Compile the smart contracts:
```bash
truffle compile
```
4. Migrate the smart contracts to the Sepolia test network:
```bash
truffle migrate --network sepolia
```
5. Ensure you have added the Sepolia network to your truffle-config.js file:
```javascript
module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider('<your-mnemonic>', 'https://sepolia.infura.io/v3/<your-infura-project-id>'),
      network_id: 11155111,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
```
6. Configure MetaMask to connect to the Sepolia test network and ensure you have some Sepolia ETH for testing.

### Final Steps
1. Ensure the backend and frontend are running.
2. Open the frontend in your browser (usually at ```bash http://localhost:3000```).
3. Connect MetaMask to the application.
4. Test the platform by browsing products, adding them to the cart, and completing transactions.

### Folder Structure
1. ```frontend```: Contains the React.js frontend application.
2. ```backend```: Contains the Express.js backend server.
3. ```blockchain```: Contains the Solidity smart contracts and Truffle configurations.

### Additional Notes
- Replace ```bash <your-mongodb-connection-string>```, ```bash <your-jwt-secret>```, ```bash <your-mnemonic>```, and ```bash <your-infura-project-id>``` with your respective configurations.
- Use the <a href="https://faucets.chain.link/sepolia">Sepolia Faucet</a> to get Sepolia ETH for testing.
  
### Support
For issues or questions, please raise an issue in the repository or contact the development team.

SecureShop: Revolutionizing E-commerce with Blockchain Technology.
