const { ethers } = require("hardhat")

async function main() {
    const CONTRACT_ADDRESS = "0xDFbb2b099a94bD5B23d38240016715377dF4407c"; // Replace with your contract address
    const recipientAddress = "0x053e6D2ab9904f02e268D8E00F7f32d3EA1a60d0"; // Replace with recipient's address
    const mintAmount = ethers.parseUnits("2000000", 6) // ethers.utils.parseUnits("2000000", 6); // 2 million tokens with 6 decimals

    // Get signer
    const [deployer] = await ethers.getSigners();

    // Attach to the contract
    const Tadex = await ethers.getContractFactory("TADEX");
    const tadex = Tadex.attach(CONTRACT_ADDRESS);

    // Call the mint function
    console.log(`Minting ${mintAmount.toString()} tokens to ${recipientAddress}...`);
    const tx = await tadex.mint(recipientAddress, mintAmount);
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
