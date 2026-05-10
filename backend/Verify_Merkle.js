const fs = require('fs');
const crypto = require('crypto');

const map = JSON.parse(fs.readFileSync('file_map.json', 'utf8'));
const restoredBuffer = fs.readFileSync('./RESTORED_Real_File_Sample.pdf');

// 1. Re-calculate the Merkle Root by hashing the shards
const shardSize = 1024 * 1024; // Must match the original 1MB size
let leafHashes = [];

for (let i = 0; i < restoredBuffer.length; i += shardSize) {
    const chunk = restoredBuffer.slice(i, i + shardSize);
    leafHashes.push(crypto.createHash('sha256').update(chunk).digest('hex'));
}

// 2. This creates the "Root" from the "Leaves"
const actualMerkleRoot = crypto.createHash('sha256').update(leafHashes.join('')).digest('hex');

console.log(`Expected: ${map.fileHash}`);
console.log(`Actual:   ${actualMerkleRoot}`);

if (map.fileHash === actualMerkleRoot) {
    console.log("SUCCESS: Merkle Root matches blockchain metadata!");
} else {
    console.log("FAILED: The tree roots do not match.");
}