import { Wallet, getDefaultProvider } from "ethers";
//require('dotenv').config()
import { ethers } from "hardhat";
import { NutritionistNFT__factory, UserNFT__factory, Treasury__factory, Community__factory } from "../typechain-types";

//const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
//const wallet = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

const privateKey = process.env.PRIVATE_KEY as string;
const wallet = new Wallet(privateKey);

const arbitrumRpc = "https://goerli-rollup.arbitrum.io/rpc"
const registryAddr = "0x37D9dC70bfcd8BC77Ec2858836B923c560E891D1"
const registrarAddr = "0x1433C1BDfCF1b2E1CE843Ede6FcC5d6e409fE56E"
const linkAddr = "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28"

async function main() {
    //await deployCommunityContracts();
  
    await setupNFTs();
}

async function deployTreasury() {
    //console.log("Deploying Treasury....");

    //const provider = getDefaultProvider(rpc)
    //const connectedWallet = wallet.connect(provider);
    //const TreasuryFactory = new Treasury__factory(connectedWallet);

    const TreasuryFactory: Treasury__factory = await ethers.getContractFactory("Treasury");
    const treasury = await TreasuryFactory.deploy();
    await treasury.deployed();
    console.log("---- Treasury Contract was deployed to: ---- ", treasury.address);
    return treasury.address;
}

async function deployUserNFT(_communityAddr: any) {
    //console.log("Deploying UserNFT....");
    const UserNFTFactory: UserNFT__factory = await ethers.getContractFactory("UserNFT");
    const userNFT = await UserNFTFactory.deploy("User NFT", "UST", _communityAddr);
    await userNFT.deployed();
    console.log("---- UserNFT Contract was deployed to: ---- ", userNFT.address);
    return userNFT.address;
}

async function deployNutritionistNFT(_communityAddr: any) {
    //console.log("Deploying NutrionistNFT....");
    const NutritionistNFTFactory: NutritionistNFT__factory = await ethers.getContractFactory("NutritionistNFT");
    const nutritionistNFT = await NutritionistNFTFactory.deploy("Nutritionist NFT", "NUT", _communityAddr);
    await nutritionistNFT.deployed();
    console.log("---- NutritionistNFT Contract was deployed to: ---- ", nutritionistNFT.address);
    return nutritionistNFT.address;
}

async function setupNFTs() {
    let userNFTAddr = "0x6D919b8dC30BEf41b56Aa8b18b2052c9459F8E9A"
    let nutritionistNFTAddr = "0xA39d26482B5c226Fd02A5f3e159C72ee03d63Fc0"
    let communityAddr = "0x3a65168B746766066288B83417329a7F901b5569"

    const provider = getDefaultProvider(arbitrumRpc);
    const connectedWallet = wallet.connect(provider);

    const communityFactory = new Community__factory(connectedWallet);
    const community = communityFactory.attach(communityAddr);

    try {
        console.log("Setting up NFTs for Arbitrum")
        const tx = await community.setNFTs(userNFTAddr, nutritionistNFTAddr);
        await tx.wait();
        console.log("NFTs setup successful")
    }

    catch (error) {
        console.log(`[source] community.setNFTs ERROR!`);
        console.log(`[source]`, error);

    }
}


async function deployCommunityContracts() {
    console.log("Deploying Contracts for Arbitrum....");
    let treasuryAddr;
    let communityAddr;
    try {
        console.log("Deploying treasury for Arbitrum");
        treasuryAddr = await deployTreasury();

        const CommunityFactory: Community__factory = await ethers.getContractFactory("Community"/*, wallet*/);

        console.log("Deploying Community contract for Arbitrum");
        const community = await CommunityFactory.deploy(treasuryAddr, linkAddr, registrarAddr, registryAddr);
        await community.deployed();
        communityAddr = community.address;
        console.log("---- Community Contract for Arbitrum was deployed to Arbitrum testnet at this address: ---- ", community.address);
    }
    catch (error) {
        console.error("Error deploying Community for Arbitrum:", error);
        throw error;
    }

    console.log("Deploying UserNFT for Arbitrum....");
    let userNFT;
    try {
        userNFT = await deployUserNFT(communityAddr);
    }
    catch (error) {
        console.error("Error User NFT for Arbitrum:", error);
        throw error;
    }

    console.log("Deploying NutritionistNFT for Arbitrum....");
    let nutritionistNFT;
    try {
        nutritionistNFT = await deployNutritionistNFT(communityAddr);
    }
    catch (error) {
        console.error("Error Nutritionist NFT for Arbitrum:", error);
        throw error;
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
