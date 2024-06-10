import Web3 from "web3";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

export async function doLogin() {
  if (!window.ethereum) throw new Error("Sem MetaMask instalada!");

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();
  if (!accounts || !accounts.length) throw new Error("Carteira não permitida!");

  localStorage.setItem("wallet", accounts[0].toLowerCase());
  return accounts[0];
}

function getContract() {
  if (!window.ethereum) throw new Error("Sem MetaMask instalada!");

  const from = localStorage.getItem("wallet");
  const web3 = new Web3(window.ethereum);

  return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function getOpenRequests(lastId = 0) {
  const contract = getContract();
  const requests = await contract.methods.getOpenRequests(lastId + 1, 10).call();
  return requests.filter(rq => rq.title !== "");
}

export async function openRequest({ title, description, contact, goal }) {
  const contract = getContract();
  return contract.methods.openRequest(title, description, contact, Web3.utils.toWei(goal, "ether")).send();
}

export async function closeRequest(id) {
  const contract = getContract();
  return contract.methods.closeRequest(id).send();
}

export async function donate(id, donationInBnb) {
  const contract = getContract();
  return contract.methods.donate(id).send({
      value: Web3.utils.toWei(donationInBnb, "ether")
  });
}