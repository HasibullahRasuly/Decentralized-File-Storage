const fs = require('fs');
const crypto = require('crypto');

// Week 4 Logic: Combine everything into one Master Root
function createMerkleRoot(hashes) {
    console.log("--- Generating Merkle Root ---");
    
    // Combine all the strings together
    const combinedString = hashes.join('');
    
    // Create the final Master Fingerprint
    const root = crypto.createHash('sha256').update(combinedString).digest('hex');
    
    return root;
}

// Wrap the logic into a reusable function for Express Server
function generateMerkleRoot() {
    // DYNAMIC SCAN: Look for the shards created by File_Processor
    const shardFiles = fs.readdirSync('./').filter(f => f.endsWith('.bin'));

    // Get the hashes from the shards directly
    let shardHashes = shardFiles.map(file => {
        const data = fs.readFileSync(file);
        return crypto.createHash('sha256').update(data).digest('hex');
    });

    let finalRoot = '';
    let targetFile = '';

    // Only calculate if shards exist 
    if (shardHashes.length > 0) {
        finalRoot = '0x' + createMerkleRoot(shardHashes); // Added '0x' prefix so it matches standard blockchain hex formats!
        console.log("FINAL MERKLE ROOT GENERATED: " + finalRoot);
        targetFile = shardFiles[0].split('_shard_')[0];
    } else {
        console.log("No shards found in directory.");
    }

    // Return the real computed data back to the server
    return { targetFile, finalRoot };
}

// Export the function so Server.js can run it
module.exports = { generateMerkleRoot };
// Week 4