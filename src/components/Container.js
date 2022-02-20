import React, {useEffect, useState} from 'react';
import "../App.css";
import { ethers } from "ethers";
import dirtJson from "./dirtCoin.json"

function Container() {
    const [provider, setProvider] = useState({});
    const [num, setNum] = useState("");
    const [address, setAddress] = useState();

    useEffect(() => {
        window.ethereum.enable();
        setTimeout(()=>{
            switchNetMetamask();
        }, 300)
    }, [])
    
    async function handleConnect() {
        const provider1 = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider1);
        console.log("handleConnect ran")

        // load Address;
        setTimeout(()=>{
            getAddress(provider1);
        }, 1500)
    }

    async function addTokenMetamask() {
        const tokenAddress = "0x776b12e29408A919DbDEc017B710A70A0221CcA2";
        const tokenSymbol = "DTC";
        const tokenDecimals = 18;
        const tokenImage = "https://gateway.pinata.cloud/ipfs/Qmf5QHE2ViSNvra16yjnpYZuPzaJPdQPyA9RYmaLPQWsyQ"

        try {
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: 'ERC20',
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage,
                    },
                },
            });

            if (wasAdded){
                console.log("Thanks for the interest, Added!")
            } else {
                console.log("User declined addition of coin")
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function switchNetMetamask(){
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0x4'}],
        })
    }
    

    function getAddress(pro) {
        const signer = pro.getSigner();
        signer.getAddress().then(addy => {
            setAddress(addy)
            console.log(address)
        })

        setTimeout(()=>{
            addTokenMetamask();
        }, 1500)
    }

    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length >= 1){
            setAddress(accounts[0]);
            console.log(accounts);
        } else {
            setTimeout(()=>{
                if (!address ){
                    window.ethereum.enable()
                }
            }, 200)
            console.log("Accounts Array is empty, what is going on")
        }
    })

    const [hash, setHash] = useState();

    async function handleTx(){

        
        const signer = provider.getSigner();
        console.log(signer)
        const myAddress = await signer.getAddress();
        console.log(myAddress);
        
        // Contract part
        const dtcContract = new ethers.Contract("0x776b12e29408A919DbDEc017B710A70A0221CcA2", dirtJson.abi, provider);
        console.log(dtcContract)
        const sdtContract = dtcContract.connect(signer);
        
        const amount = ethers.utils.parseUnits(num);
        console.log("Amount: ", amount);
        
        sdtContract.transferEx(amount).then((tx) => {
            console.log(tx);
            // Loading is finished
            setHash(tx.hash);
        })
    }

    function update(event){
        const {value} = event.target;
        setNum(value);
    }


    return (
        <div className="central-container center">
            <div className="titleRow">
                <div className="ellipse-1"></div>
                <h1 className="title">dirtCoin</h1>
            </div>
            
            <p className="description-dirt">
                dirtCoin is a coin that you can mint at anytime. You press the button and this colorful little token appears in your account.
            </p>

            <div className="input-container">
                <input type="numbers" className="input-value" onChange={update} id="input" placeholder="1">

                </input>

                <button className="to-user" onClick={handleTx} id="give">
                    give me dirt
                </button>

                <button className="connect-wallet" id="connect" onClick={handleConnect}>
                    connect wallet
                </button>
            </div>

            <div className="container-bottom-row">
                {address &&
                <div className="description-address">
                    {address}
                </div> 
                } 
                
                <div className="description-copyright">
                    {
                        hash ? 
                           <a className="gray" target="_blank" href={`https://rinkeby.etherscan.io/tx/${hash}`}>your tx hash i guess</a> : "made by jerry using dirt" 
                    }
                </div>
            </div>
        </div>
    )
}

export default Container;