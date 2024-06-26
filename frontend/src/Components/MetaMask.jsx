import React from "react";
import { Button, Card } from "react-bootstrap";
import { useState } from "react";
import Web3 from "web3";

const MetaMask = () => {
	const [address, setAddress] = useState("");
	const [balance, setBalance] = useState("0");
	const [connectionMessage, setConnectionMessage] =
		useState("Connect MetaMask");

	const connectMetaMask = async () => {
		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});
				const web3 = new Web3(window.ethereum);
				window.web3 = web3;
				accountChangeHandler(accounts[0]);
			} catch (error) {
				console.error(error);
			}
			setConnectionMessage("Connected");
		} else {
			console.log("MetaMask is not installed!");
		}
	};
	const getbalance = async (account) => {
		const balance = await window.web3.eth.getBalance(account);
		setBalance(window.web3.utils.fromWei(balance, "ether"));
	};
	// Function for getting handling all events
	const accountChangeHandler = (account) => {
		// Setting an address data
		setAddress(account);

		// Setting a balance
		getbalance(account);
	};

	return (
		<>
			<Card className="text-center">
				<Card.Title>
					<strong>Address: </strong> {address}
				</Card.Title>
				<Card.Body>
					<Card.Text>
						<strong>Balance: </strong> {balance}
					</Card.Text>
					<Button onClick={connectMetaMask} variant="primary">
						{connectionMessage}
					</Button>
				</Card.Body>
			</Card>
		</>
	);
};

export default MetaMask;
