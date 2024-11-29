const { ethers } = require("hardhat");

async function main() {
    const dextian = await ethers.getContract("DEXTIAN");
    const predicateRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PREDICATE_ROLE"));

    const newAddress = "0x053e6D2ab9904f02e268D8E00F7f32d3EA1a60d0"; // Replace with your MetaMask address
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
