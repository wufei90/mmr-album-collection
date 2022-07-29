import React from "react";
import { useState, useEffect } from "react";
import "../styles/globals.css";
import NavBar from "./NavBar";

function MyApp({ Component, pageProps }) {
  // Define accounts that will be connected to the app
  const [currentAccount, setCurrentAccount] = useState();

  // Connect a Metamask wallet to the app
  async function connectAccount() {
    // Metamask will inject window.ethereum in the app when connected
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        handleAccountsChanged(accounts);
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert('Please connect your MetaMask wallet.');
        } else {
          console.error(error);
        }
      } 
    }
  }

  // Connect wallet on load
  async function checkAccountConnection() {
    if (window.ethereum) {
       try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        handleAccountsChanged(accounts);
      } catch (error) {
          console.error(error);
      } 
    }
  }

  // handle Metamask account change
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
    }
  }

  // Connect wallet on mount
  useEffect(() => {
    checkAccountConnection();
  }, []);

  // Listen for Metamask account or network changes
  useEffect(() => {
    if (window.ethereum) {
      // Reload if chain changed
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      // Reload if account changed
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <NavBar currentAccount={currentAccount} connectAccount={connectAccount} />
      <Component {...pageProps} currentAccount={currentAccount} />
    </div>
  );
}

export default MyApp;
