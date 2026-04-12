const fs = require('fs');

// Import the data from Merkle script
const { targetFile, finalRoot } = require('./Merkle_Generator');

// Get the pure name without the path
const pureFileName = targetFile.split('/').pop();

// These are the Storage Nodes
const nodes = [
    './Storage_Server/Node1/',
    './Storage_Server/Node2/',
    './Storage_Server/Node3/'
];

console.log("-- Starting Smart Circular Distribution --");

// Get a list of every file in the current folder
const allFiles = fs.readdirSync('./'); 

// We need a counter to keep track of which shard we are in
let shardCount = 0;

let shardTracking = []; 

allFiles.forEach((fileName) => {
    // Only process shards that belong to the CURRENT file
    if (fileName.endsWith('.bin') && fileName.startsWith(pureFileName)) {
        console.log("Processing shard: " + fileName);

        // The Circular Math
        // This puts each shard in2o two different nodes(servers)
        const primaryNode = nodes[shardCount % 3]; 
        const backupNode = nodes[(shardCount + 1) % 3];

        // Perform the copies
        fs.copyFileSync('./' + fileName, primaryNode + fileName);
        console.log(" Saved " + fileName + " to " + primaryNode);
        
        fs.copyFileSync('./' + fileName, backupNode + fileName);
        console.log(" Saved " + fileName + " to " + backupNode);

        // WEEK 7 ADDITION: Save the location info for the JSON Map
        shardTracking.push({
            id: fileName,
            locations: [`Node${(shardCount % 3) + 1}`, `Node${((shardCount + 1) % 3) + 1}`]
        });

        // Move to the next shard number
        shardCount++;

        // CLEANUP: Delete the shard from the main folder after moving it
        fs.unlinkSync('./' + fileName);
    }
});

console.log("-- Distribution Completed: Efficient and Redundant --");

// Export the variables for the Map Generator to use
module.exports = { targetFile: pureFileName, finalRoot, shardTracking }; 