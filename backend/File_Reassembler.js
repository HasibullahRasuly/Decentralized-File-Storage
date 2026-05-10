const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function reassembleFile() {
    // Check if the "Map" exists
    if (!fs.existsSync('file_map.json')) {
        return console.log("Error: file_map.json not found!");
    }
    
    // Load the map and prepare the output name
    const map = JSON.parse(fs.readFileSync('file_map.json', 'utf8'));
    const outputPath = 'RESTORED_' + map.fileName;

    // Remove old versions so it start fresh
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    console.log(`Starting recovery for: ${map.fileName}`);

    // Step through each shard in order
    map.shards.forEach(shard => {
        let healthyData = null;

        // Look through all locations (Node1, Node2, etc.)
        for (const nodeName of shard.locations) {
            const shardPath = path.join('./Storage_Server', nodeName, shard.id);
            
            if (fs.existsSync(shardPath)) {
                const buffer = fs.readFileSync(shardPath);
                
                // THE HASH CHECK: Make sure piece isn't corrupted
                const checkHash = crypto.createHash('sha256').update(buffer).digest('hex');

                if (checkHash === shard.hash) {
                    console.log(`  [OK] ${shard.id} verified from ${nodeName}`);
                    healthyData = buffer;
                    break; // Stop looking, I found a perfect copy!
                } else {
                    console.log(`  [WARNING] ${shard.id} in ${nodeName} is corrupted. Checking backup...`);
                }
            }
        }

        // If it found a healthy piece, glue it to the file
        if (healthyData) {
            fs.appendFileSync(outputPath, healthyData);
        } else {
            console.error(`!!! CRITICAL: Couldnt find a valid copy of ${shard.id}`);
        }
    });

    console.log(`\nCOMPLETED: ${outputPath} is ready!`);
}

reassembleFile();