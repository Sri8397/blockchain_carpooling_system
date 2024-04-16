# Decentralized Carpooling System

Introducing carpooling using blockchain technology offers a transformative solution to address urban transportation challenges. By leveraging the decentralized and transparent nature of blockchain, carpooling platforms can enhance security, trust, and efficiency in ride-sharing arrangements.

## Features

- **Smart Contract:** Utilizes Solidity smart contracts on the Ethereum blockchain for access control and ownership management.
- **Access Control:** Users can grant or revoke access to their uploaded images to specific individuals through the smart contract.

## Technologies Used

- **Solidity:** Smart contract development for ownership and access control.
- **React:** Front-end interface for uploading images and managing access.

## Usage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sri8397/blockchain_carpooling_system.git
   ```
2. Install dependencies for the hardhat:

   ```bash
   # Navigate to the root directory
   cd blockchain_carpooling_system
   # Install hardhat dependencies
   npm install
   ```
3. Compile the smart contract for artifacts:

   ```bash
   # Compile Smart Contract
   npx hardhat compile
   ```
4. Deploy the Solidity smart contract to an Ethereum testnet or local development environment.
   ```bash
   # Deploy Smart Contract
   npx hardhat run scripts/deploy.js --network <network-name>
   ```
5. Install dependencies for the React front end:
   ```bash
   # Navigate to the React client directory
   cd client 
   # Install React dependencies
   npm install
   ```
6. Run the react application:
   ```bash
   # Start React Application
   npm start
   ```
   
### Configuration

1. Set up environment variables:
   - Update the contract address
     
### Usage

Once the setup and configuration are complete, follow these steps to utilize the decentralized image upload and sharing system:

1. **Install Metamask:**
   - Ensure Metamask is installed and configured in your browser for Ethereum interactions.

2. **Update Contract Address:**
   - After smart contract deployment, make sure to update the contract address in `App.js` within the React application.

These steps will ensure smooth navigation and utilization of the system while maintaining access control and avoiding potential errors.

