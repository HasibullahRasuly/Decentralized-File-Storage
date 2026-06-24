import { ethers } from "ethers";
import contractAbi from "./FileRegistryABI.json";

const CONTRACT_ADDRESS = "0xfa291963B6393Bd2D1BF07Bfa5a4Ca2343e6ED0f";
const GANACHE_URL = "http://127.0.0.1:7545"; 

async function getContractInstance() {
    // Connect to my local running Ganache app
    const provider = new ethers.JsonRpcProvider(GANACHE_URL);
    
    // Grab the signer account from Ganache to sign the transaction
    const signer = await provider.getSigner();
    
    // Create and return the functional contract bridge
    return new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
}


// WEEK 11: WRITE TO BLOCKCHAIN (UPLOAD)
export async function uploadMerkleRoot(fileName, merkleRootHash) {
    try {
        const contract = await getContractInstance();
        
        console.log("Pushing Merkle Root to Ganache...");
        // This invokes the exact function I wrote in the Solidity contract!
        const tx = await contract.recordFile(fileName, merkleRootHash); 
        
        // Wait for Ganache to mine the block and return a receipt
        const receipt = await tx.wait(); 
        console.log("Transaction successfully mined in Ganache!", receipt);
        return true;
    } catch (error) {
        console.error("Failed to upload to blockchain:", error);
        return false;
    }
}


// WEEK 12: READ FROM BLOCKCHAIN (AUDIT)
export async function fetchBlockchainRoot(fileName) {
    try {
        const contract = await getContractInstance();
        
        console.log(`Querying blockchain for file: ${fileName}...`);
        
        // Week 12: Call the read-only 'getMerkleRoot' function from Solidity contract
        const storedRoot = await contract.getMerkleRoot(fileName);
        
        return storedRoot; 
    } catch (error) {
        console.error("Failed to fetch data from blockchain:", error);
        return null;
    }
}