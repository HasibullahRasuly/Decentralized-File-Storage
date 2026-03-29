# Secure Multi-Server File Storage System
**Graduation Project - Engineering Faculty 2026**

## Project Overview
This project is a decentralized storage solution designed to ensure data reliability and security. By utilizing blockchain technology for integrity verification and a multi-server architecture (sharding), the system eliminates single points of failure and provides a transparent audit trail for all stored files.

## Technical Goals
* **Data Integrity:** SHA-256 hashing and Merkle Tree root generation.
* **Distributed Architecture:** File sharding across multiple simulated storage nodes.
* **Blockchain Audit:** Solidity smart contracts to store and verify file roots.
* **Full-Stack Interface:** A React.js dashboard for seamless user interaction.

## 16-Week Implementation Roadmap

### PHASE 1: Data Logic (Month 1)
- [x] **Week 1: Environment Setup & Hashing Test** – Install Node.js and Ganache. Write a script to turn a string of text into a SHA-256 hash.
- [x] **Week 2: File Buffers** – Learn to read actual files (JPG, PDF) into binary "Buffer" objects for processing.
- [x] **Week 3: Chunking & Hashing** – Slice files into smaller pieces (1MB) and assign unique SHA-256 hashes to each.
- [x] **Week 4: Merkle Tree** – Combine piece hashes into a tree structure to generate a final "Root Hash."

### PHASE 2: Distributed Storage (Month 2)
- [x] **Week 5: Create Storage Nodes** – Set up independent folders to simulate distinct storage "servers."
- [ ] **Week 6: Sharding (Distribution)** – Develop a script to distribute file pieces across multiple nodes.
- [ ] **Week 7: Metadata Mapping** – Create a JSON "map" to track which file pieces belong to which nodes.
- [ ] **Week 8: Reassembly** – Retrieve pieces, verify hashes for corruption, and stitch them back into the original file.

### PHASE 3: Blockchain Security (Month 3)
- [ ] **Week 9: Solidity Basics** – Develop a Smart Contract to store File Root Hashes and User Addresses.
- [ ] **Week 10: Ganache Testnet** – Launch a local private blockchain for contract deployment.
- [ ] **Week 11: Web3 / Ethers.js Integration** – Use JavaScript to upload Merkle Roots to the blockchain.
- [ ] **Week 12: On-chain Integrity Audit** – Build functions to compare current node data against the blockchain record.

### PHASE 4: Frontend & Final (Month 4)
- [ ] **Week 13: React.js UI Setup** – Build a dashboard with upload/download functionality.
- [ ] **Week 14: Full-Stack Integration** – Connect the React UI to the Node.js logic and Smart Contracts.
- [ ] **Week 15: Stress Testing** – Perform failure simulations and system recovery tests.
- [ ] **Week 16: Documentation & Jury Defense** – Final code cleanup and preparation for the graduation demo.

## Tech Stack
* **Backend:** Node.js
* **Blockchain:** Solidity, Ganache, Ethers.js
* **Frontend:** React.js