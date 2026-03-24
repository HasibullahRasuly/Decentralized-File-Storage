const fs = require('fs');
const crypto = require('crypto');

const filePath = './RealFileSample.pdf'; 
const CHUNK_SIZE = 1024 * 1024; // This equals 1MB in bytes

fs.readFile(filePath, (err, data) => {
    if (err) return console.log("Error reading file");

    let offset = 0;
    let chunkNumber = 1;

    console.log(`Starting to slice file: ${data.length} total bytes...`);

    // The Loop:  "Keep cutting until we run out of data"
    while (offset < data.length) {
        // 1. Take a slice (from 'offset' to 'offset + 1MB')
        const chunk = data.slice(offset, offset + CHUNK_SIZE);

        // 2. Hash this specific slice
        const hash = crypto.createHash('sha256').update(chunk).digest('hex');

        console.log(`Chunk #${chunkNumber} | Size: ${chunk.length} bytes | Hash: ${hash.substring(0, 10)}...`);

        // 3. Move the "knife" forward for the next slice
        offset += CHUNK_SIZE;
        chunkNumber++;
    }

    console.log("Finished! The file is now sharded.");
});