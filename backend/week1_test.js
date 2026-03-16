const CryptoJS = require('crypto-js');

// Week 1: Basic Hashing Test
const mySecretData = "My Graduation Project 2026";

// Create a SHA-256 Hash
const hash = CryptoJS.SHA256(mySecretData).toString();

console.log("Original Text:", mySecretData);
console.log("SHA-256 Hash:", hash);
console.log("--- Week 1 Setup Complete ---");