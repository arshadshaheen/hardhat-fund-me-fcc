const { expect } = require("chai");
const { ethers, getNamedAccounts, deployments } = require("hardhat");

describe("Dextian Staging Tests", function () {
    let deployer, user;
    let dextian;
    let predicateRole;
    let initialSupply;
    let maxSupply;

    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];

        // Fetch constructor parameters from the environment
        initialSupply = ethers.parseUnits(process.env.MIN_SUPPLY, 6); // Initial supply
        maxSupply = ethers.parseUnits(process.env.MAX_SUPPLY, 6); // Max supply
        const predicateAddress = process.env.MY_ADDRESS; // PREDICATE_ROLE address

        // Deploy the Dextian contract
        await deployments.fixture(["all"]);
        dextian = await ethers.getContract("Dextian", deployer);

        // Compute the PREDICATE_ROLE hash
        predicateRole = ethers.keccak256(ethers.toUtf8Bytes("PREDICATE_ROLE"));
    });

    it("should deploy successfully with correct name, symbol, and initial supply", async () => {
        const name = await dextian.name();
        const symbol = await dextian.symbol();
        const decimals = await dextian.decimals();
        const totalSupply = await dextian.totalSupply();

        expect(name).to.equal(process.env.TOKEN_NAME);
        expect(symbol).to.equal(process.env.TOKEN_SYMBOLE);
        expect(decimals).to.equal(6); // Fixed decimals in the contract
        expect(totalSupply.toString()).to.equal(initialSupply.toString());
    });

    it("should grant PREDICATE_ROLE to the correct address", async () => {
        const hasPredicateRole = await dextian.hasRole(predicateRole, process.env.MY_ADDRESS);
        expect(hasPredicateRole).to.be.true;
    });

    it("should allow minting tokens by PREDICATE_ROLE", async () => {
        const mintAmount = ethers.parseUnits("1000", 6); // 1000 Dextian tokens

        // Grant PREDICATE_ROLE to the deployer for testing
        await dextian.grantRole(predicateRole, deployer.address);

        // Mint tokens to the user
        await dextian.mint(user.address, mintAmount);

        const userBalance = await dextian.balanceOf(user.address);
        expect(userBalance.toString()).to.equal(mintAmount.toString());
    });

    it("should restrict minting tokens to accounts without PREDICATE_ROLE", async () => {
        const mintAmount = ethers.parseUnits("1000", 6); // 1000 Dextian tokens

        // Attempt to mint tokens without PREDICATE_ROLE
        await expect(dextian.connect(user).mint(user.address, mintAmount)).to.be.revertedWith(
            "Dextian: INSUFFICIENT_PERMISSIONS"
        );
    });

    it("should mint tokens on ETH deposit based on price tiers", async () => {
        const depositAmount = ethers.parseEther("1"); // 1 ETH

        const initialSupply = await dextian.totalSupply();
        const expectedTokens = (depositAmount * 10_000) / ethers.parseEther("0.05"); // Tier 1 price

        // Send ETH to the contract
        await user.sendTransaction({
            to: dextian.address,
            value: depositAmount,
        });

        const newSupply = await dextian.totalSupply();
        const tokensMinted = newSupply.sub(initialSupply);

        expect(tokensMinted).to.equal(expectedTokens);
    });

    it("should enforce the maximum deposit minting supply", async () => {
        const depositAmount = ethers.parseEther("100"); // Large ETH amount to exceed supply

        // Attempt to deposit ETH and mint tokens beyond MAX_DEPOSIT_MINT_SUPPLY
        await expect(
            user.sendTransaction({
                to: dextian.address,
                value: depositAmount,
            })
        ).to.be.revertedWith("Deposit minting supply exceeded");
    });

    it("should correctly calculate tokens based on tiered pricing", async () => {
        const currentSupply = await dextian.totalSupply();
        const ethAmount = ethers.parseEther("1");

        let expectedTokens;
        if (currentSupply.lt(ethers.parseUnits("30000000", 6))) {
            expectedTokens = (ethAmount * 10_000) / ethers.parseEther("0.05");
        } else if (currentSupply.lt(ethers.parseUnits("60000000", 6))) {
            expectedTokens = (ethAmount * 10_000) / ethers.parseEther("0.1");
        } else if (currentSupply.lt(ethers.parseUnits("90000000", 6))) {
            expectedTokens = (ethAmount * 10_000) / ethers.parseEther("0.2");
        } else {
            expectedTokens = 0; // No tokens minted beyond max tier
        }

        const calculatedTokens = await dextian._calculateTokens(ethAmount);
        expect(calculatedTokens).to.equal(expectedTokens);
    });
});
