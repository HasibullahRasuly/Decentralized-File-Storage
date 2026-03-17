const fs = require('fs'); 

// 1. Tell the computer which file to grab
const filePath = './testfile.jpg'; 

// 2. Read the file into a Buffer
// This is the "Magic" line that turns the image into raw computer data
fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error("Oops! Could not find the file. Make sure the name is correct.");
        return;
    }

    // "data" is now our Buffer!
    console.log("-- Buffer Created Successfully --");
    
    // Show the first 20 bytes of the file so you can see what raw data looks like
    console.log("Raw Data (First 20 bytes):", data.slice(0, 20));

    // Show the total size of the file in bytes
    console.log("Total File Size:", data.length, "bytes");
});