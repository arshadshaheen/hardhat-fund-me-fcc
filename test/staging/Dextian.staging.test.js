const { expect } = require("chai");
const { ethers, getNamedAccounts, deployments } = require("hardhat");

describe("DEXTIAN Staging Tests", function () {
    let deployer;
    let dextian;
    let predicateRole;
    let initialHolder;
    let initialSupply;
    let maxSupply;

    beforeEach(async () => {
        try {
            // Fetch deployer account
            deployer = (await getNamedAccounts()).deployer;

            // Ensure deployer has sufficient balance
            const balance = await ethers.provider.getBalance(deployer);
            console.log(`Deployer Balance: ${ethers.formatEther(balance)} ETH`);

            if (balance.lt(ethers.utils.parseEther("0.01"))) {
                throw new Error("Deployer does not have enough funds for deployment.");
            }

            // Deploy the contract using the fixture
            await deployments.fixture(["all"]);

            // Get the deployed DEXTIAN contract
            dextian = await ethers.getContract("DEXTIAN", deployer);

            // Define initial test parameters
            initialHolder = deployer;
            initialSupply = ethers.utils.parseUnits("500000", 6); // 500,000 DEXTIAN tokens
            maxSupply = ethers.utils.parseUnits("1000000", 6); // 1,000,000 DEXTIAN tokens

            // Compute the PREDICATE_ROLE hash
            predicateRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PREDICATE_ROLE"));
        } catch (error) {
            console.error("Error in beforeEach:", error);
            throw error;
        }
    });

    it("should deploy successfully with correct parameters", async () => {
        const name = await dextian.name();
        const symbol = await dextian.symbol();
        const decimals = await dextian.decimals();
        const totalSupply = await dextian.totalSupply();
        const maxSupplyValue = await dextian.maxSupply();

        expect(name).to.equal("DEXTIAN Token");
        expect(symbol).to.equal("DEXTIAN");
        expect(decimals).to.equal(6); // As defined in the constructor
        expect(totalSupply.toString()).to.equal(initialSupply.toString());
        expect(maxSupplyValue.toString()).to.equal(maxSupply.toString());
    });

    it("should grant PREDICATE_ROLE to the correct address", async () => {
        const predicateAddress = deployer; // Example address with the role
        await dextian.grantRole(predicateRole, predicateAddress);
        const hasPredicateRole = await dextian.hasRole(predicateRole, predicateAddress);

        expect(hasPredicateRole).to.be.true;
    });

    it("should allow minting tokens by accounts with PREDICATE_ROLE", async () => {
        const mintAmount = ethers.utils.parseUnits("1000", 6); // 1,000 DEXTIAN tokens
        const user = (await ethers.getSigners())[1].address;

        // Grant PREDICATE_ROLE to the deployer for testing purposes
        await dextian.grantRole(predicateRole, deployer);

        // Mint tokens to the user
        await dextian.mint(user, mintAmount);

        const userBalance = await dextian.balanceOf(user);
        expect(userBalance.toString()).to.equal(mintAmount.toString());
    });

    it("should restrict minting tokens by accounts without PREDICATE_ROLE", async () => {
        const mintAmount = ethers.utils.parseUnits("1000", 6); // 1,000 DEXTIAN tokens
        const user = (await ethers.getSigners())[1].address;

        // Try minting without granting PREDICATE_ROLE
        await expect(dextian.mint(user, mintAmount)).to.be.revertedWith(
            "DEXTIAN: INSUFFICIENT_PERMISSIONS"
        );
    });

    it("should not allow minting above the max supply", async () => {
        const user = (await ethers.getSigners())[1].address;

        // Grant PREDICATE_ROLE to the deployer for testing purposes
        await dextian.grantRole(predicateRole, deployer);

        // Attempt to mint an amount exceeding the max supply
        const excessiveMintAmount = maxSupply.add(ethers.utils.parseUnits("1", 6));
        await expect(dextian.mint(user, excessiveMintAmount)).to.be.revertedWith(
            "Mint exceeds maximum supply"
        );
    });
});
