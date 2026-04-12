const fs = require('fs');
const crypto = require('crypto');

// The main function(Engine)
function processFile(filePath) {
    const data = fs.readFileSync(filePath); 
    const CHUNK_SIZE = 1024 * 1024; // 1MB

    let offset = 0;
    let chunkNumber = 1;
    let hashes = [];

    // Get just the name of the file (e.g., "photo.jpg") to use for shard naming
    const fileNameOnly = filePath.split('/').pop();

    console.log(`Starting to slice file: ${data.length} total bytes...`);

    // The loop: keep cutting until run out of data 
    while (offset < data.length) {
        const chunk = data.slice(offset, offset + CHUNK_SIZE);
        const hash = crypto.createHash('sha256').update(chunk).digest('hex');

        // Name shards based on the actual file name so they don't overwrite
        fs.writeFileSync(`${fileNameOnly}_shard_${chunkNumber}.bin`, chunk); 

        console.log(`Chunk #${chunkNumber} | Size: ${chunk.length} bytes | Hash: ${hash.substring(0, 10)}...`);
        
        hashes.push(hash);

        // move the "knife" forward for the next slice
        offset += CHUNK_SIZE;
        chunkNumber++;
    }

    console.log("Finished! The file is now sharded.");
    return hashes;
}

// This line allows other weeks to borrow this code
module.exports = { processFile };

// look at the 'uploads' folder for the uploaded file
const UploadsFolder = './Uploads/';

// It finds the first real file in that folder
const files = fs.readdirSync(UploadsFolder).filter(f => !f.startsWith('.'));

if (files.length > 0) {
    const myFile = UploadsFolder + files[0]; 
    console.log(`Processing detected file: ${myFile}`);
    processFile(myFile);
    
    // Delete the file after sharding is done 
    fs.unlinkSync(myFile); 
    console.log(`Cleanup: ${myFile} deleted from Uploads.`);
} else {
    console.log("Error: Please put a file in the 'Uploads' folder first!");
}