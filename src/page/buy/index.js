import React, { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { sabzAddress, sabzAbi } from "../../utils/contract/Contract"
import { AuthUserContext } from '../../context';
import { toast } from "react-toastify";
import { IoWallet } from "react-icons/io5";
import { MdToken } from "react-icons/md";
import { SiLinuxmint } from "react-icons/si";
function Buy() {
    const { connectWallet,setCheckBalance } = useContext(AuthUserContext);
    const [balance, setBalance] = useState(0)
    const [availableMint, setAvailableMint] = useState(0)
    const [pricePerToken, setPriceToken] = useState(0)
    const [loading, setLoading] = useState(false);
    const [mint, setMint] = useState()
    const [formData, setFormData] = useState({
        address: '',
        tokenNumber: '',
        bidPrice: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const balanceGet = async () => {
        try {
            if (connectWallet == "Connect Wallet") {
            } else if (connectWallet == "Wrong Network") {
            } else {
                const web3 = window.web3;
                const sabzContract = new web3.eth.Contract(
                    sabzAbi,
                    sabzAddress
                );
                let availableToMint = await sabzContract.methods.availableToMint().call();
                availableToMint = (Number(availableToMint)/1000);
                setAvailableMint(availableToMint)
                let balanceOf = await sabzContract.methods.balanceOf(connectWallet).call();
                balanceOf = (Number(balanceOf)/1000);
                // console.log(balanceOf,"balanceOf");
                setBalance(balanceOf)
                let pricePerToken = await sabzContract.methods.pricePerToken().call();
                pricePerToken = Number(pricePerToken)
                setPriceToken(pricePerToken)

                const getHolderShare = await sabzContract.methods.getHolderShare(connectWallet).call()
                setCheckBalance(Number(getHolderShare)/1000)
            }
        } catch (e) {
            console.log("e", e);
        }
    }

    const handleMint = async () => {
        try {
            if (!mint) {
                toast.error("Please Fill the Inputs First")
                return false
            }
            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                setLoading(true)
                const web3 = window.web3;
                const sabzContract = new web3.eth.Contract(
                    sabzAbi,
                    sabzAddress
                )
                let amount = mint * 1000;
                let Value = mint * pricePerToken;
                amount = amount.toString();
                
                let tokenMint = await sabzContract.methods.tokenMint(amount).send({
                    from: connectWallet,
                    value: Value.toString()
                })
                if (tokenMint) {
                    setLoading(false)
                    balanceGet()
                    setMint("")
                    toast.success("Mint successfully.")
                }

            }
        } catch (e) {
            setLoading(false)
            console.log("e", e);
        }
    }

    const handleBuy = async () => {
        try {
            if (!formData.address || !formData.tokenNumber || !formData.bidPrice) {
                toast.error("Please Fill the Inputs First")
                return false
            }

            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect bsc testnet network")
            } else {
                setLoading(true)
                const web3 = window.web3;
                const sabzContract = new web3.eth.Contract(
                    sabzAbi,
                    sabzAddress
                )
                let isTokenHolder = await sabzContract.methods.isTokenHolder(formData.address).call();
                if (isTokenHolder === true) {
                    let getHolderShare = await sabzContract.methods.getHolderShare(formData.address).call()
                    if (Number(getHolderShare) >= Number(formData.tokenNumber)) {
                        const value = formData.tokenNumber * formData.bidPrice
                        let token = formData.tokenNumber *1000;

                        const tokenBuy = await sabzContract.methods.tokenBuy(formData.address, token.toString(), formData.bidPrice)
                            .send({
                                from: connectWallet,
                                value: value
                            })

                        if (tokenBuy) {
                            balanceGet()
                            setLoading(false)
                            setFormData({
                                address: '',
                                tokenNumber: '',
                                bidPrice: '',
                            })
                            toast.success("user Buy token successfully.")
                        }

                    } else {
                        setLoading(false)
                        toast.error("User Insufficient Balance")
                    }
                } else {
                    setLoading(false)
                    toast.error("User is not token holder.")
                }
            }
        } catch (e) {
            setLoading(false)
            console.log("e", e);
        }
    }
    useEffect(() => {
        balanceGet();
    }, [connectWallet, balance, availableMint, pricePerToken])
    return (
        <>
            {
                loading ? (<div>
                    <div className="load-wrapp">
                        <div className="load-9">
                            <div className="spinner">
                                <div className="bubble-1"></div>
                                <div className="bubble-2"></div>
                            </div>
                        </div>
                    </div>
                </div>) : (
                    <></>
                )
            }

            <div className='container mt-3'>
                <div className='mt-4'>
                    <h1 className="title-h1">Unlock Your financial potential<br /> by invest or get funding</h1>
                    <p className='Funding-p mt-3'>Funding On the hand, refers to the act of providing financial resources, often in the form of capital, to <br /> support a project, business, or other venture. Funding can come from  a variety of sources, including<br /> individuals, institutions, or government entities. </p>
                </div>

                <div className='row d-flex justify-content-md-between justify-content-center mt-4 m-md-4'>
   
                        <div className='col-md-4 col-11 box-width mt-2  '>
                            <span className='mint-span d-flex'><SiLinuxmint size={25} color='#fff' className='me-2' /> Available Mint</span>
                            <span>{availableMint}</span>
                        </div>
                        <div className='col-md-4 col-11 box-width mt-2'>
                            <span className='mint-span d-flex'><MdToken size={25} color='#fff' className='me-2' /> Token Price</span>
                            <span>{pricePerToken}</span>
                        </div>
                        <div className='col-md-4 col-11 box-width mt-2'>
                            <span className='mint-span d-flex'><IoWallet size={25} color='#fff' className='me-2' /> User Balance</span>
                            <span>{balance}</span>
                        </div>
                </div>
                <div className='row mt-4 d-flex justify-content-md-evenly justify-content-center  '>
                    <div className='box-width-down text-start mt-4 '>
                        <h3 className='mint-h3'>Mint</h3>
                        <InputGroup className=" mt-4">
                            <Form.Control
                                placeholder="Enter Number"
                                type="number"
                                className='input-group'
                                min={1}
                                value={mint}
                                onChange={(e) => setMint(e.target.value)}
                            />
                        </InputGroup>
                        <div className=' row d-flex justify-content-center mt-3'>
                            <div className="d-grid col-md-5 gap-2">
                                <button className='btn btn-connect' onClick={handleMint}>
                                    MINT
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className='col-md-5 box-width-min-down text-start mt-4 '>
                        <h3 className='mint-h3'>Buy SABZ</h3>
                        <InputGroup className="mb-3 mt-4">
                            <Form.Control
                                placeholder="Enter Address"
                                type="text"
                                className='input-group'
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3 mt-4">
                            <Form.Control
                                placeholder="Enter Token Number"
                                type="number"
                                className='input-group'
                                min={1}
                                name="tokenNumber"
                                value={formData.tokenNumber}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3 mt-4">
                            <Form.Control
                                placeholder="Enter Bid Price"
                                type="number"
                                className='input-group'
                                min={1}
                                name="bidPrice"
                                value={formData.bidPrice}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <div className='row d-flex justify-content-center'>
                            <div className="d-grid col-md-5 gap-2">
                                <button className='btn btn-connect' onClick={handleBuy}>
                                    BUY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Buy