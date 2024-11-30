const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Address for deployed contract
    const senderAddress = process.env.SENDER_ADDRESS; // Sender's address (must be unlocked in your signer)
    const recipientAddress = process.env.RECIPIENT_ADDRESS; // Recipient's address
    const transferAmount = ethers.parseUnits(process.env.TRANSFER_AMOUNT || "1000", 6); // Default to 1,000 tokens with 6 decimals

    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log(`Using sender account: ${deployer.address}`);

    // Attach to the deployed contract
    const Dextian = await ethers.getContractFactory("DEXTIAN");
    const dextian = Dextian.attach(CONTRACT_ADDRESS);

    // Check sender's balance
    const senderBalance = await dextian.balanceOf(deployer.address);
    console.log(`Sender's balance: ${ethers.formatUnits(senderBalance, 6)} tokens`);

    if (senderBalance<transferAmount) {
        throw new Error("Insufficient balance to make the transfer.");
    }

    // Transfer tokens
    console.log(`Transferring ${ethers.formatUnits(transferAmount, 6)} tokens from ${deployer.address} to ${recipientAddress}...`);
    const tx = await dextian.transfer(recipientAddress, transferAmount);
    console.log("Transaction submitted. Hash:", tx.hash);

    // Wait for confirmation
    await tx.wait();
    console.log(`Transfer successful. Transaction hash: ${tx.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error occurred during transfer:", error);
        process.exit(1);
    });
