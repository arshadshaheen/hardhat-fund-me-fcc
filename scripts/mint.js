const { ethers } = require("hardhat")
require("dotenv").config();
async function main() {
    const recipientAddress = process.env.MY_ADDRESS; 
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

   
    const mintAmount = ethers.parseUnits("100000", 6); // 2 million tokens with 6 decimals

    // Get signer
    const [deployer] = await ethers.getSigners();

    // Attach to the contract
    const Dextian = await ethers.getContractFactory("DEXTN");
    const dextian = Dextian.attach(CONTRACT_ADDRESS);

    // Call the mint function
    console.log(`Minting ${mintAmount.toString()} tokens to ${recipientAddress}...`);
    const tx = await dextian.mint(recipientAddress, mintAmount);
    console.log("Transaction submitted:", tx.hash);

    // Wait for confirmation
    await tx.wait();
    console.log(`Minting successful. Transaction hash: ${tx.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error occurred while minting:", error);
        process.exit(1);
    });
