const fs = require('fs');
const path = require('path');

// 1. These are the "Addresses". Later, these will be URLs(Real servers)
const nodes = [
    './Storage_Server/Node1',
    './storage_Server/Node2',
    './Storage_Server/Node3'
];

console.log("-- Initializing Storage Nodes --");

// 2. A simple function to check if "Servers" are online (if the folders exist)
function checkNodes() {
    nodes.forEach((nodePath, index) => {
        if (fs.existsSync(nodePath)) {
            console.log(`Node ${index + 1} is ONLINE at: ${nodePath}`);
        } else {
            console.log(`Node ${index + 1} is OFFLINE! Creating folder...`);
            fs.mkdirSync(nodePath, { recursive: true });
        }
    });
}

// 3. Run the check
checkNodes();

console.log("-- Storage System is Ready --");