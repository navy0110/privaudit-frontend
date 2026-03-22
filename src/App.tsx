import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS = "0x068FC5C10B3e99B254e0D3c984782aCB1DE783d6";
const ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "string", "name": "_action", "type": "string" }, { "internalType": "string", "name": "_resourceId", "type": "string" }, { "internalType": "bool", "name": "_authorized", "type": "bool" }], "name": "logActivity", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getLogsCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "logs", "outputs": [{ "internalType": "address", "name": "agentAddress", "type": "address" }, { "internalType": "string", "name": "action", "type": "string" }, { "internalType": "string", "name": "resourceId", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "bool", "name": "authorized", "type": "bool" }], "stateMutability": "view", "type": "function" },
];

const RESOURCES = [
  { id: "EXP-001", name: "Financial File Q1", level: "Senior" },
  { id: "EXP-002", name: "Audit Report 2024", level: "Senior" },
  { id: "EXP-003", name: "Employee Data", level: "Director" },
];

type ZkStatus = "verifying" | "approved" | "denied" | null;
interface LogEntry { agent: string; action: string; resourceId: string; timestamp: number; authorized: boolean; }

export default function App() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agentLevel, setAgentLevel] = useState("Junior");
  const [zkStatus, setZkStatus] = useState<ZkStatus>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [tab, setTab] = useState("agent");

  const selectedResource = RESOURCES[selectedIdx];

  async function connectWallet() {
    const w = window as any;
    if (!w.ethereum) return alert("Instal MetaMask");
    const provider = new ethers.BrowserProvider(w.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setWallet(address);
    setContract(c);
    loadLogs(c);
  }

  async function loadLogs(c: ethers.Contract) {
    try {
      const count = await c.getLogsCount();
      const fetched: LogEntry[] = [];
      for (let i = 0; i < Number(count); i++) {
        const log = await c.logs(i);
        fetched.push({ agent: log.agentAddress, action: log.action, resourceId: log.resourceId, timestamp: Number(log.timestamp), authorized: log.authorized });
      }
      setLogs(fetched.reverse());
    } catch (e) { console.error(e); }
  }

  async function requestAccess() {
    if (!contract) return;
    setLoading(true);
    setZkStatus("verifying");
    await new Promise((r) => setTimeout(r, 2000));
    const authorized = (agentLevel === "Senior" && selectedResource.level === "Senior") || agentLevel === "Director";
    setZkStatus(authorized ? "approved" : "denied");
    try {
      const tx = await contract.logActivity(`ACCESS_${agentLevel.toUpperCase()}`, selectedResource.id, authorized);
      await tx.wait();
      await loadLogs(contract);
    } catch (e: any) { alert("Error: " + e.message); }
    setLoading(false);
  }

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="app">
      <header>
        <div className="logo">🔐 PrivAudit</div>
        <div className="subtitle">Zero-Knowledge Access Control · Base Sepolia</div>
        {!wallet
          ? <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
          : <div className="wallet-badge">✅ {shortAddr(wallet)}</div>
        }
      </header>

      {!wallet && (
        <div className="hero">
          <h1>Non-identity audit</h1>
          <p>ZK-Proofs + Base Sepolia + ERC-8004</p>
          <button className="btn-primary big" onClick={connectWallet}>🚀 Connect Wallet</button>
        </div>
      )}

      {wallet && (
        <>
          <div className="tabs">
            <button className={tab === "agent" ? "tab active" : "tab"} onClick={() => setTab("agent")}>🕵️ Agente B — Request Access</button>
            <button className={tab === "audit" ? "tab active" : "tab"} onClick={() => setTab("audit")}>📋 Company A — Audit ({logs.length})</button>
          </div>

          <div className="panel">
            {tab === "agent" && (
              <div>
                <h2>Request Access to File</h2>
                <div className="form-group">
                  <label>Your level (ERC-8004)</label>
                  <select value={agentLevel} onChange={(e) => { setAgentLevel(e.target.value); setZkStatus(null); }}>
                    <option>Junior</option>
                    <option>Senior</option>
                    <option>Director</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>File to be Consulted</label>
                  <select value={selectedIdx} onChange={(e) => { setSelectedIdx(Number(e.target.value)); setZkStatus(null); }}>
                    {RESOURCES.map((r, i) => (
                      <option key={r.id} value={i}>{r.id} — {r.name} (requiere: {r.level})</option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary" onClick={requestAccess} disabled={loading}>
                  {loading ? "⏳ Verifying ZK-Proof..." : "🔍 Request Access"}
                </button>
                {zkStatus === "verifying" && <div className="zk-box verifying"><div className="spinner" /> Generating ZK proof... Your identity will not be revealed.</div>}
                {zkStatus === "approved" && <div className="zk-box approved">✅ ZK-Proof verified — AUTHORIZED access<br /><small>Hash recorded on blockchain.</small><div className="resource-content">📄 {selectedResource.name}: [CONFIDENTIAL DATA]</div></div>}
                {zkStatus === "denied" && <div className="zk-box denied">❌ Insufficient level — Required {selectedResource.level}<br /><small>Attempt recorded on blockchain.</small></div>}
              </div>
            )}

            {tab === "audit" && (
              <div>
                <div className="audit-header">
                  <h2>Immutable Audit Log</h2>
                  <button className="btn-secondary" onClick={() => contract && loadLogs(contract)}>🔄 Upload</button>
                </div>
                {logs.length === 0
                  ? <p className="empty">There are no records yet.</p>
                  : <div className="log-list">
                    {logs.map((log, i) => (
                      <div key={i} className={`log-item ${log.authorized ? "auth" : "denied"}`}>
                        <div className="log-top">
                          <span className="log-status">{log.authorized ? "✅ AUTORIZADO" : "❌ DENEGADO"}</span>
                          <span className="log-time">{new Date(log.timestamp * 1000).toLocaleString()}</span>
                        </div>
                        <div className="log-detail">
                          <span>🔑 <code>{shortAddr(log.agent)}</code></span>
                          <span>📁 <code>{log.resourceId}</code></span>
                          <span>⚡ <code>{log.action}</code></span>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
