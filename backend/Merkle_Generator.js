const crypto = require('crypto');

// This line connects to my File_Processor.js
const { processFile } = require('./File_Processor'); 

// Tell which file to look at
const targetFile = './RealFileSample.pdf';

// This runs Week 3 code and gets the hashes automatically
const shardHashes = processFile(targetFile);

// Week 4 Logic: Combine everything into one Master Root
function createMerkleRoot(hashes) {
    console.log("--- Generating Merkle Root ---");
    
    // Combine all the strings together
    const combinedString = hashes.join('');
    
    // Create the final Master Fingerprint
    const root = crypto.createHash('sha256').update(combinedString).digest('hex');
    
    return root;
}

const finalRoot = createMerkleRoot(shardHashes);

console.log("FINAL MERKLE ROOT: " + finalRoot);
