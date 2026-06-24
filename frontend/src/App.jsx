import React, { useState } from 'react';
import { uploadMerkleRoot, fetchBlockchainRoot } from './blockchainService';

function App() {
  // CORE STATE 
  const [mockFileName, setMockFileName] = useState("No file selected yet");
  const [mockMerkleRoot, setMockMerkleRoot] = useState("0x0000000000000000000000000000000000000000000000000000000000000000");

  // Track selected file from local computer
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Track the filename the user wants to download directly
  const [downloadTargetName, setDownloadTargetName] = useState("");

  // Status messages for user tracking
  const [backendStatus, setBackendStatus] = useState(""); 
  const [uploadStatus, setUploadStatus] = useState("");   
  const [auditStatus, setAuditStatus] = useState("");     
  const [downloadStatus, setDownloadStatus] = useState(""); 
  
  const [blockchainRecord, setBlockchainRecord] = useState("");

  // Handle file selection for uploading
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMockFileName(file.name);
    }
  };

  // SEND REAL FILE TO NODE.JS BACKEND (Upload Pipeline)
  const handleSendToBackend = async () => {
    if (!selectedFile) {
      setBackendStatus(" Please choose a file first!");
      return;
    }
    setBackendStatus(" Sending file over HTTP to Node.js backend server...");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setBackendStatus(` Success! Sharded into ${data.totalChunks} pieces.`);
        if (data.realMerkleRoot) {
          setMockMerkleRoot(data.realMerkleRoot);
        }
      } else {
        setBackendStatus(` Backend error: ${data.error}`);
      }
    } catch (error) {
      setBackendStatus(" Connection Failed!");
    }
  };

  // WRITE TO BLOCKCHAIN
  const handleUpload = async () => {
    setUploadStatus("Connecting to Ganache...");
    const success = await uploadMerkleRoot(mockFileName, mockMerkleRoot);
    if (success) {
      setUploadStatus(" Success! Merkle Root anchored on-chain.");
    } else {
      setUploadStatus(" Upload failed.");
    }
  };

  // READ & AUDIT DATA 
  const handleAudit = async (currentLocalHash) => {
    setAuditStatus("Fetching ledger record...");
    const liveBlockchainRoot = await fetchBlockchainRoot(mockFileName);
    if (!liveBlockchainRoot) {
      setAuditStatus(" Error: Could not retrieve data.");
      return;
    }
    setBlockchainRecord(liveBlockchainRoot);
    if (liveBlockchainRoot === currentLocalHash) {
      setAuditStatus(" AUDIT PASSED: Local file matches blockchain perfectly.");
    } else {
      setAuditStatus(" AUDIT FAILED: Warning! Data tampering detected!");
    }
  };

  // DIRECT DOWNLOAD RETRIEVAL ENGINE (No Upload Steps Needed!)
  const handleDirectDownload = async () => {
    if (!downloadTargetName) {
      setDownloadStatus(" Please type the filename you want to retrieve!");
      return;
    }

    setDownloadStatus(` Searching nodes for: ${downloadTargetName}...`);
    
    try {
      const downloadUrl = `http://localhost:5001/api/download/${encodeURIComponent(downloadTargetName)}`;
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error("Shards not found on storage nodes.");
      }

      const fileBlob = await response.blob();
      const nativeUrl = window.URL.createObjectURL(fileBlob);
      const fileSaveTrigger = document.createElement('a');
      fileSaveTrigger.href = nativeUrl;
      fileSaveTrigger.setAttribute('download', downloadTargetName);
      document.body.appendChild(fileSaveTrigger);
      
      fileSaveTrigger.click(); 
      fileSaveTrigger.remove(); 
      
      setDownloadStatus(" Success! Shards gathered and file reassembled perfectly.");
    } catch (error) {
      console.error(error);
      setDownloadStatus(" Error: Could not find or rebuild shards for this file name.");
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: 'auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '5px' }}>Graduation Project Dashboard</h1>
      <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>Decentralized Storage & Integrity Verification Verification</p>
      
      {/* TWO MAIN MODULES: SIDE-BY-SIDE PLATFORM */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: THE UPLOAD PIPELINE */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
          <h2 style={{ marginTop: 0, color: '#e67e22', borderBottom: '2px solid #e67e22', paddingBottom: '8px' }}>📤 Upload Control Panel</h2>
          
          <div style={{ margin: '15px 0' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Select Local File:</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div style={{ background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '15px' }}>
            <strong>Selected:</strong> <span style={{ color: '#666' }}>{mockFileName}</span>
          </div>

          <button onClick={handleSendToBackend} style={{ width: '100%', backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
            Step 1: Shard & Send to Nodes
          </button>
          {backendStatus && <p style={{ fontSize: '13px', color: '#333', margin: '5px 0 15px 0' }}>{backendStatus}</p>}

          <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '4px', marginBottom: '15px', border: '1px dashed #bbb' }}>
            <strong style={{ fontSize: '12px' }}>Merkle Root Hash:</strong>
            <code style={{ display: 'block', wordBreak: 'break-all', fontSize: '11px', color: '#007bff' }}>{mockMerkleRoot}</code>
          </div>

          <button onClick={handleUpload} style={{ width: '100%', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
            Step 2: Anchor Hash to Ganache Blockchain
          </button>
          {uploadStatus && <p style={{ fontSize: '13px', color: '#333' }}>{uploadStatus}</p>}

          <div style={{ borderTop: '1px solid #ddd', margin: '20px 0' }}></div>
          
          <h3>Optional: Run Verification Check</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => handleAudit(mockMerkleRoot)} style={{ backgroundColor: '#007bff', color: 'white', padding: '8px', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1, fontSize: '12px', fontWeight: 'bold' }}>
              Run Safe Audit
            </button>
            <button onClick={() => handleAudit("0xMUTATED_HASH_ERROR")} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1, fontSize: '12px', fontWeight: 'bold' }}>
              Simulate Tamper
            </button>
          </div>
          {auditStatus && <p style={{ fontSize: '13px', marginTop: '10px', fontWeight: 'bold' }}>{auditStatus}</p>}
        </div>

        {/* RIGHT COLUMN: THE DIRECT DOWNLOAD PIPELINE (THE ACTION YOU WANTED) */}
        <div style={{ flex: 1, border: '2px solid #9b59b6', padding: '20px', borderRadius: '8px', backgroundColor: '#fdfbfe' }}>
          <h2 style={{ marginTop: 0, color: '#9b59b6', borderBottom: '2px solid #9b59b6', paddingBottom: '8px' }}>📥 Direct Download Vault</h2>
          <p style={{ fontSize: '13px', color: '#666' }}>Skip all upload workflows. Type the exact name of any file previously distributed across the cluster nodes to retrieve it immediately.</p>
          
          <div style={{ margin: '20px 0' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              Target File Name:
            </label>
            <input 
              type="text" 
              placeholder="e.g., test_homework.docx" 
              value={downloadTargetName}
              onChange={(e) => setDownloadTargetName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', marginBottom: '15px' }}
            />
          </div>

          <button 
            onClick={handleDirectDownload}
            style={{ width: '100%', backgroundColor: '#9b59b6', color: 'white', border: 'none', padding: '15px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ⚡ Reassemble & Fetch from Nodes
          </button>

          {downloadStatus && (
            <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f3e5f5', borderRadius: '5px', border: '1px solid #d1c4e9', fontSize: '13px', fontWeight: 'bold', color: '#4a148c' }}>
              {downloadStatus}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;