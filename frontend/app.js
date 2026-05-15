// 1. FILL THIS IN FROM YOUR TERMINAL
const contractAddress = "0x9Ae209B49693017b2c24EBB238D02eD6Cc1eb314"; 

// 2. The ABI (Instructions for your contract)
const abi = [
    "function set(uint256 x) public",
    "function get() public view returns (uint256)"
];

let signer;
let contract;

const statusEl = document.getElementById('status');

async function connect() {
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, abi, signer);
            
            const address = await signer.getAddress();
            document.getElementById('walletAddress').innerText = address;
            statusEl.innerText = "Status: Connected to MetaMask";
        } catch (error) {
            statusEl.innerText = "Status: Connection Failed";
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function updateValue() {
    if (!contract) return alert("Connect wallet first!");
    const val = document.getElementById('inputValue').value;
    try {
        statusEl.innerText = "Status: Check MetaMask...";
        const tx = await contract.set(val);
        statusEl.innerText = "Status: Mining Transaction...";
        await tx.wait();
        statusEl.innerText = "Status: Update Successful!";
    } catch (err) {
        console.log(err);
        statusEl.innerText = "Status: Transaction Error";
    }
}

async function getValue() {
    if (!contract) return;
    const currentVal = await contract.get();
    document.getElementById('currentValue').innerText = `Current Value: ${currentVal}`;
}

// Event Listeners
document.getElementById('connectBtn').addEventListener('click', connect);
document.getElementById('setBtn').addEventListener('click', updateValue);
document.getElementById('getBtn').addEventListener('click', getValue);
