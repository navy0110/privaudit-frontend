# 🔐 PrivAudit: ZK-Access Control & Identity Verification

![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-blue)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-lightgrey)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

**PrivAudit** is a decentralized platform designed for immutable auditing and secure access management of confidential files. By combining **Zero-Knowledge Proof concepts (ERC-8004)** with **Self Protocol**, PrivAudit ensures that auditors are verified through real-world digital identities (DIDs) without compromising sensitive personal data.

---

## 🚀 Key Features

* **🕵️ Agent B (Requester):** A specialized interface for auditors to request access to sensitive resources based on hierarchical roles (**Junior, Senior, Director**).
* **📋 Company A (Immutable Audit):** A transparent, tamper-proof log hosted on **Base Sepolia** that records every access attempt (Authorized or Denied).
* **🛂 Real Identity via Self Protocol:** Replaces simulations with actual Digital Identity verification, linking a verified DID to the auditor's wallet.
* **⚡ ZK-Proof Workflow:** A privacy-first logic that validates permissions and credentials without revealing the user's full identity until strictly required by compliance.

---

## 🛠️ Tech Stack

### **Blockchain & Identity**
* **Network:** [Base Sepolia](https://base.org/) (Ethereum Layer 2).
* **Smart Contracts:** Solidity 0.8.20.
* **Framework:** [Hardhat](https://hardhat.org/) (Compilation, Testing, and Deployment).
* **Identity Layer:** [Self Protocol](https://self.xyz/) (On-chain Verifiers and DIDs).

### **Frontend & UI**
* **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) for high-performance rendering.
* **Language:** TypeScript (for type safety and robust code).
* **Web3 Library:** [Ethers.js v6](https://docs.ethers.org/v6/) for blockchain interaction.
* **Styling:** Custom CSS with a focus on dark mode and readability.

### **AI Integration & Hosting**
* **Intelligence:** [Venice AI API](https://venice.ai/)
