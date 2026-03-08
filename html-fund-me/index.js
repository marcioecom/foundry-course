import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js";

// DOM elements
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
const walletStatus = document.getElementById("walletStatus");
const walletAddress = document.getElementById("walletAddress");
const balanceValue = document.getElementById("balanceValue");
const fundFeedback = document.getElementById("fundFeedback");
const withdrawFeedback = document.getElementById("withdrawFeedback");

// Event listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

// Feedback helper
function showFeedback(element, type, message) {
  element.className = `feedback visible ${type}`;
  const prefix = type === "loading" ? '<span class="spinner"></span>' : "";
  element.innerHTML = prefix + message;

  if (type !== "loading") {
    setTimeout(() => {
      element.classList.remove("visible");
    }, 5000);
  }
}

function truncateAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// Custom error messages for contract errors
const contractErrorMessages = {
  FundMe__NotOwner: "Only the contract owner can withdraw",
};

// Parse contract errors from revert data
const contractInterface = new ethers.Interface(abi);

function parseContractError(error) {
  // Try to decode custom error from revert data
  if (error.data) {
    try {
      const decoded = contractInterface.parseError(error.data);
      if (decoded) {
        return contractErrorMessages[decoded.name] || decoded.name;
      }
    } catch {}
  }

  // Fallback to reason or generic message
  return error.reason || error.shortMessage || "Transaction failed";
}

// Wallet connection
async function connect() {
  if (typeof window.ethereum === "undefined") {
    walletAddress.textContent = "Please install MetaMask";
    return;
  }

  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await ethereum.request({ method: "eth_accounts" });
    walletStatus.classList.add("connected");
    walletAddress.textContent = truncateAddress(accounts[0]);
    connectButton.textContent = "Connected";
    connectButton.disabled = true;
    getBalance();
  } catch (error) {
    walletAddress.textContent = "Connection rejected";
  }
}

// Fund
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  if (!ethAmount || parseFloat(ethAmount) <= 0) {
    showFeedback(fundFeedback, "error", "Enter a valid ETH amount");
    return;
  }

  if (typeof window.ethereum === "undefined") {
    showFeedback(fundFeedback, "error", "Please install MetaMask");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    showFeedback(fundFeedback, "loading", "Waiting for confirmation...");
    fundButton.disabled = true;

    const tx = await contract.fund({ value: ethers.parseEther(ethAmount) });
    showFeedback(fundFeedback, "loading", "Transaction pending...");
    await tx.wait(1);

    showFeedback(fundFeedback, "success", `Funded ${ethAmount} ETH successfully`);
    document.getElementById("ethAmount").value = "";
    getBalance();
  } catch (error) {
    showFeedback(fundFeedback, "error", parseContractError(error));
  } finally {
    fundButton.disabled = false;
  }
}

// Withdraw
async function withdraw() {
  if (typeof window.ethereum === "undefined") {
    showFeedback(withdrawFeedback, "error", "Please install MetaMask");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    showFeedback(withdrawFeedback, "loading", "Waiting for confirmation...");
    withdrawButton.disabled = true;

    const tx = await contract.withdraw();
    showFeedback(withdrawFeedback, "loading", "Transaction pending...");
    await tx.wait(1);

    showFeedback(withdrawFeedback, "success", "Withdrawal successful");
    getBalance();
  } catch (error) {
    showFeedback(withdrawFeedback, "error", parseContractError(error));
  } finally {
    withdrawButton.disabled = false;
  }
}

// Get balance
async function getBalance() {
  if (typeof window.ethereum === "undefined") {
    balanceValue.textContent = "--";
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    balanceValue.textContent = ethers.formatEther(balance);
  } catch (error) {
    balanceValue.textContent = "Error";
  }
}

// Auto-connect if already authorized
if (typeof window.ethereum !== "undefined") {
  ethereum.request({ method: "eth_accounts" }).then((accounts) => {
    if (accounts.length > 0) {
      walletStatus.classList.add("connected");
      walletAddress.textContent = truncateAddress(accounts[0]);
      connectButton.textContent = "Connected";
      connectButton.disabled = true;
      getBalance();
    }
  });
}
