import { ethers } from "./ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connect = async () => {
  if (window.ethereum) {
    console.log(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connectButton").innerHTML = "Connected!";
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install metamask";
  }
};

const fund = async (amount) => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const singer = provider.getSigner();
      console.log(singer);
      const contract = new ethers.Contract(contractAddress, abi, singer);
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(amount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      // console.log(contractAddress);
    } catch (error) {
      console.log(error);
    }
  }
};

const listenForTransactionMine = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}.....`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `Conmpleted with ${transactionReciept.confirmations} confirmation`
      );
      resolve("Done");
    });
  });
};

const getBalance = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(balance);
    console.log(ethers.utils.formatEther(balance));
  }
};

const withdraw = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const singer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, singer);
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      console.log(getBalance());
    } catch (error) {
      console.log(error);
    }
  }
};

document.getElementById("connectButton").addEventListener("click", () => {
  connect();
});

document.getElementById("fundButton").addEventListener("click", () => {
  const amount = document.getElementById("ethAmount").value;
  fund(amount);
});

document.getElementById("balanceButton").addEventListener("click", () => {
  getBalance();
});

document.getElementById("withdrawButton").addEventListener("click", () => {
  withdraw();
});
