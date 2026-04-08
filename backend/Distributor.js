const fs = require('fs');

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

allFiles.forEach((fileName) => {
    
    // Check: Is this a .bin shard?
    if (fileName.endsWith('.bin')) {
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

        // Move to the next shard number
        shardCount++;
    }
});

console.log("-- Distribution Completed: Efficient and Redundant --");