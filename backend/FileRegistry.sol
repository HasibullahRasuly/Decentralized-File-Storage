// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileRegistry {
    
    // State Variables (Saved permanently to Blockchain Storage)
    mapping(string => string) private fileHashes;
    address public owner;

    // Constructor (Runs only ONCE when I deploy the contract)
    constructor() {
        owner = msg.sender; // Saves deployers address as the owner
    }

    // Function to write data (Secure)
    function recordFile(string memory _fileName, string memory _merkleRoot) public {
        require(msg.sender == owner, "Only the owner can record files");
        fileHashes[_fileName] = _merkleRoot;
    }

    // Function to read data (Publicly viewable)
    function getMerkleRoot(string memory _fileName) public view returns (string memory) {
        return fileHashes[_fileName];
    }
}