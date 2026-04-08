const fs = require('fs');
const crypto = require('crypto');

// I just wrap the code in a function called 'processFile'
function processFile(filePath) {
    const data = fs.readFileSync(filePath); 
    const CHUNK_SIZE = 1024 * 1024; // This equals 1MB in bytes

    let offset = 0;
    let chunkNumber = 1;
    let hashes = []; // this is to collect the hashes

    console.log(`Starting to slice file: ${data.length} total bytes...`);

    // The loop: Keep cutting until run out of data
    while (offset < data.length) {
        const chunk = data.slice(offset, offset + CHUNK_SIZE);
        const hash = crypto.createHash('sha256').update(chunk).digest('hex');

        // this creates shard_1.bin, shard_2.bin, shard_3.bin 
        fs.writeFileSync(`shard_${chunkNumber}.bin`, chunk); 

        console.log(`Chunk #${chunkNumber} | Size: ${chunk.length} bytes | Hash: ${hash.substring(0, 10)}...`);
        
        hashes.push(hash); // Save the hash to the list

        // move the "knife" forward for the next slice
        offset += CHUNK_SIZE;
        chunkNumber++;
    }

    console.log("Finished! The file is now sharded.");
    return hashes; // Return the list to the Merkle Manager
}

// This line allows Week 4 to "borrow" this code
module.exports = { processFile };

// This tells the code to actually start working on my file
const myFile = './RealFileSample.pdf'; 
processFile(myFile);