import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import {
  abi,
  contractAddress,
  priceFeedAbi,
  priceFeedAddress,
} from "./constants.js";

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
const networkInfo = document.getElementById("networkInfo");
const ownerAddress = document.getElementById("ownerAddress");
const minimumUsd = document.getElementById("minimumUsd");
const ethPrice = document.getElementById("ethPrice");
const fundersList = document.getElementById("fundersList");

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
  if (error.data) {
    try {
      const decoded = contractInterface.parseError(error.data);
      if (decoded) {
        return contractErrorMessages[decoded.name] || decoded.name;
      }
    } catch {}
  }
  return error.reason || error.shortMessage || "Transaction failed";
}

// Get a read-only provider and contract
function getProvider() {
  return new ethers.BrowserProvider(window.ethereum);
}

async function getReadContract() {
  const provider = getProvider();
  return new ethers.Contract(contractAddress, abi, provider);
}

// Network status
async function updateNetworkInfo() {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    const networkNames = {
      1: "Ethereum Mainnet",
      11155111: "Sepolia Testnet",
      31337: "Anvil (Local)",
    };
    const name = networkNames[chainId] || `Chain ${chainId}`;
    networkInfo.innerHTML = `<span class="network-dot"></span>${name}`;
    networkInfo.classList.add("visible");
  } catch {}
}

// Contract info: owner, minimum USD, ETH price
async function loadContractInfo() {
  try {
    const contract = await getReadContract();

    const owner = await contract.getOwner();
    ownerAddress.textContent = truncateAddress(owner);
    ownerAddress.title = owner;

    const minUsd = await contract.MINIMUM_USD();
    const formatted = ethers.formatUnits(minUsd, 18);
    minimumUsd.textContent = `$${parseFloat(formatted).toFixed(0)} USD`;
  } catch {}

  try {
    const provider = getProvider();
    const priceFeed = new ethers.Contract(
      priceFeedAddress,
      priceFeedAbi,
      provider,
    );
    const [, answer] = await priceFeed.latestRoundData();
    const decimals = await priceFeed.decimals();
    const price = Number(answer) / 10 ** Number(decimals);
    ethPrice.textContent = `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } catch {}
}

// Funders list
async function loadFunders() {
  if (typeof window.ethereum === "undefined") return;

  try {
    const contract = await getReadContract();
    const funders = [];

    for (let i = 0; ; i++) {
      try {
        const addr = await contract.getFunder(i);
        const amount = await contract.getAddressToAmountFunded(addr);
        funders.push({ address: addr, amount });
      } catch {
        break;
      }
    }

    if (funders.length === 0) {
      fundersList.innerHTML =
        '<div class="funders-empty">No funders yet</div>';
      return;
    }

    fundersList.innerHTML = funders
      .map(
        (f) =>
          `<div class="funder-row">
            <span class="funder-address" title="${f.address}">${truncateAddress(f.address)}</span>
            <span class="funder-amount">${parseFloat(ethers.formatEther(f.amount)).toFixed(4)} ETH</span>
          </div>`,
      )
      .join("");
  } catch {
    fundersList.innerHTML =
      '<div class="funders-empty">Could not load funders</div>';
  }
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
    onConnected();
  } catch (error) {
    walletAddress.textContent = "Connection rejected";
  }
}

// Load all data after connection
function onConnected() {
  getBalance();
  updateNetworkInfo();
  loadContractInfo();
  loadFunders();
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
    const provider = getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    showFeedback(fundFeedback, "loading", "Waiting for confirmation...");
    fundButton.disabled = true;

    const tx = await contract.fund({ value: ethers.parseEther(ethAmount) });
    showFeedback(fundFeedback, "loading", "Transaction pending...");
    await tx.wait(1);

    showFeedback(
      fundFeedback,
      "success",
      `Funded ${ethAmount} ETH successfully`,
    );
    document.getElementById("ethAmount").value = "";
    getBalance();
    loadFunders();
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
    const provider = getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    showFeedback(withdrawFeedback, "loading", "Waiting for confirmation...");
    withdrawButton.disabled = true;

    const tx = await contract.withdraw();
    showFeedback(withdrawFeedback, "loading", "Transaction pending...");
    await tx.wait(1);

    showFeedback(withdrawFeedback, "success", "Withdrawal successful");
    getBalance();
    loadFunders();
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
    const provider = getProvider();
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
      onConnected();
    }
  });

  // Update on network/account change
  ethereum.on("chainChanged", () => window.location.reload());
  ethereum.on("accountsChanged", () => window.location.reload());
}
