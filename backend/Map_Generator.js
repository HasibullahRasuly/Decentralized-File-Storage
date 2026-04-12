const fs = require('fs');

// Import the data from Distributor 
const { targetFile, finalRoot, shardTracking } = require('./Distributor');

console.log("-- Generating Final File Map (JSON MAP) --");

// Build the Map Object
const fileMap = {
    fileName: targetFile,
    fileHash: finalRoot, // The Merkle Root we generated
    totalShards: shardTracking.length,
    storageStrategy: "Circular Redundancy (n+1)",
    distributedAt: new Date().toISOString(),
    shards: shardTracking // This contains the list of which Nodes have which Shards
};

// 3. Save it to a JSON file
fs.writeFileSync('./file_map.json', JSON.stringify(fileMap, null, 4));

console.log("SUCCESS: file_map.json has been Created.");