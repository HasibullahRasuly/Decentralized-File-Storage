const fs = require('fs');
const crypto = require('crypto');

// DYNAMIC SCAN: Look for the shards created by File_Processor
const shardFiles = fs.readdirSync('./').filter(f => f.endsWith('.bin'));

// Get the hashes from the shards directly
let shardHashes = shardFiles.map(file => {
    const data = fs.readFileSync(file);
    return crypto.createHash('sha256').update(data).digest('hex');
});

// Week 4 Logic: Combine everything into one Master Root
function createMerkleRoot(hashes) {
    console.log("--- Generating Merkle Root ---");
    
    // Combine all the strings together
    const combinedString = hashes.join('');
    
    // Create the final Master Fingerprint
    const root = crypto.createHash('sha256').update(combinedString).digest('hex');
    
    return root;
}

let finalRoot = '';
let targetFile = '';

// Only calculate if shards exist 
if (shardHashes.length > 0) {
    finalRoot = createMerkleRoot(shardHashes);
    console.log("FINAL MERKLE ROOT: " + finalRoot);
    targetFile = shardFiles[0].split('_shard_')[0];
} else {
    console.log("No shards found in main directory. Check Storage_Server.");
}

module.exports = { targetFile, finalRoot };