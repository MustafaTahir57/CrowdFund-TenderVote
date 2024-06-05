import Web3 from "web3";

let isItConnected = false;

const networks = {
    bsc: {
        chainId: `0x${Number(97).toString(16)}`,
        chainName: "Binance Smart Chain Testnet",
        nativeCurrency: {
            name: "BSC",
            symbol: "tBNB",
            decimals: 18,
        },
        rpcUrls: [
            "https://endpoints.omniatech.io/v1/bsc/testnet/public"
        ],
        blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
};

const changeNetwork = async (networkName) => {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    ...networks[networkName],
                },
            ],
        });
    } catch (err) {
        console.error("Error while changing network: ", err);
    }
};

const handleNetworkSwitch = async (networkName) => {
    await changeNetwork(networkName);
};

const getAccounts = async () => {
    const web3 = window.web3;
    try {
        const accounts = await web3.eth.getAccounts();
        return accounts;
    } catch (error) {
        console.error("Error while fetching accounts: ", error);
        return null;
    }
};

export const disconnectWallet = async () => {
    try {
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
        });
        console.log("Disconnected");
    } catch (error) {
        console.error("Error while disconnecting wallet: ", error);
    }
};

export const loadWeb3 = async () => {
    try {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            let netId = await window.web3.eth.getChainId();

            if (netId.toString() !== "97") {
                await handleNetworkSwitch("bsc");
                netId = await window.web3.eth.getChainId();
            }

            isItConnected = netId.toString() === "97";

            console.log("isItConnected", isItConnected);

            if (isItConnected) {
                const accounts = await getAccounts();
                return accounts[0];
            } else {
                return "Wrong Network";
            }
        } else {
            return "No Wallet";
        }
    } catch (error) {
        console.error("Error while loading Web3: ", error);
        return "No Wallet";
    }
};
