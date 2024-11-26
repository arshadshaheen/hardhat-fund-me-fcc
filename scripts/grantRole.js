const { ethers } = require("hardhat");

async function main() {
    const dextian = await ethers.getContract("DEXTN");
    const predicateRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PREDICATE_ROLE"));

    const newAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // Replace with your MetaMask address
    const tx = await dextian.grantRole(predicateRole, newAddress);
    await tx.wait();

    console.log(`PREDICATE_ROLE granted to ${newAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
