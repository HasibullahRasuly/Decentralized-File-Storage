const fs = require('fs');
const crypto = require('crypto');

// Import the data from Merkle script safely
const MerkleScript = require('./Merkle_Generator');

// Wrap the logic in a function so Server.js can run it dynamically on upload
function distributeShards(dynamicFileName) {
    // Safely look up the fallback name from the Merkle script inside the running execution
    const fallbackName = MerkleScript.targetFile ? MerkleScript.targetFile.split('/').pop() : '';
    
    // Use the dynamic file name passed from the server, or fallback to the Merkle target
    const fileToDistribute = dynamicFileName || fallbackName;

    if (!fileToDistribute) {
        console.error("[Distributor] Error: No filename provided for distribution!");
        return { success: false, error: "No filename provided" };
    }

    // These are the Storage Nodes
    const nodes = [
        './Storage_Server/Node1/',
        './Storage_Server/Node2/',
        './Storage_Server/Node3/'
    ];

    console.log("-- Starting Smart Circular Distribution --");

    // Ensure target node directories exist so it doesn't crash
    nodes.forEach(nodePath => {
        if (!fs.existsSync(nodePath)) {
            fs.mkdirSync(nodePath, { recursive: true });
        }
    });

    // Get a list of every file in the current folder
    const allFiles = fs.readdirSync('./'); 

    // We need a counter to keep track of which shard we are in
    let shardCount = 0;
    let shardTracking = []; 

    allFiles.forEach((fileName) => {
        // Only process shards that belong to the CURRENT file
        if (fileName.endsWith('.bin') && fileName.startsWith(fileToDistribute)) {
            console.log("Processing shard: " + fileName);
            
            // Read the shard's raw data into a buffer so we can calculate its SHA-256 hash
            const fileBuffer = fs.readFileSync('./' + fileName);
            const shardHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

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
                hash: shardHash,
                locations: [`Node${(shardCount % 3) + 1}`, `Node${((shardCount + 1) % 3) + 1}`]
            });

            // Move to the next shard number
            shardCount++;

            // CLEANUP: Delete the shard from the main folder after moving it
            fs.unlinkSync('./' + fileName);
        }
    });

    console.log("-- Distribution Completed: Efficient and Redundant --");
    return { targetFile: fileToDistribute, finalRoot: MerkleScript.finalRoot, shardTracking };
}

// Export everything safely including the new runner function for Server.js to access
module.exports = { 
    targetFile: MerkleScript.targetFile ? MerkleScript.targetFile.split('/').pop() : '', 
    finalRoot: MerkleScript.finalRoot, 
    distributeShards 
};