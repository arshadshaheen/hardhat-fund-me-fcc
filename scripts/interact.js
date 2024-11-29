const { ethers } = require("hardhat");

async function main() {
    // Replace with your deployed contract address
    const contractAddress = "0xb3212036815788FE65D8AbF2f4eC5e1405AAcA2A";

    // Fetch the ABI
    const Dextian = await ethers.getContractFactory("Dextian");
    const dextian = Dextian.attach(contractAddress);

    // Call functions
    const name = await dextian.name();
    const symbol = await dextian.symbol();
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);

    // Example: Query total supply
    const totalSupply = await dextian.totalSupply();
    console.log(`Total Supply: ${ethers.utils.formatUnits(totalSupply, 6)}`);

    // Example: Interact with mint (if PREDICATE_ROLE is set to your address)
    const [deployer] = await ethers.getSigners();
    const mintAmount = ethers.utils.parseUnits("100000", 6); // Mint 1000 tokens
    const mintTx = await dextian.mint(deployer.address, mintAmount);
    await mintTx.wait();

    console.log(`Minted 1000 DEXTIAN to: ${deployer.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
