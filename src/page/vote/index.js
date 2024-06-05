import React, { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { AuthUserContext } from '../../context';
import { toast } from "react-toastify";
import { tenderAddress, tenderAbi } from '../../utils/contract/TenderContract';
import { tenderVotingAddress, tenderVotingAbi } from '../../utils/contract/TenderVoting';
import { sabzAddress, sabzAbi } from "../../utils/contract/Contract"
import ReactPaginate from 'react-paginate';
function Vote() {
    const { connectWallet } = useContext(AuthUserContext);
    const [loading, setLoading] = useState(false);
    const [proposalDetails, setProposalDetails] = useState([])
    const [openTenderStatus, setOpenTenderStatus] = useState([])
    const [selectedTender, setSelectedTender] = useState("");
    const [selectedTenderForWinner, setSelectedTenderForWinner] = useState("");
    const [proposalDetailForSelect, setProposalDetailForSelect] = useState([])
    const [proposalValue, setProposalValue] = useState('')
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [visibleChars, setVisibleChars] = useState(50);
    const itemsPerPage = 5;
    const [proposalCurrentPage, setProsalCurrentPage] = useState(0);

    const handleProposalPageClick = ({ selected }) => {
        setProsalCurrentPage(selected);
    };

    // proposal pagination
    const indexOfLastItemProposal = (proposalCurrentPage + 1) * itemsPerPage;
    const indexOfFirstItemProposal = indexOfLastItemProposal - itemsPerPage;
    const currentItemsProposal = proposalDetails.slice(indexOfFirstItemProposal, indexOfLastItemProposal);


    const unixTimeConvert = (date) => {
        try {
            const milliseconds = date * 1000;
            if (date > 0) {
                const date = new Date(milliseconds);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }
        } catch (e) {
            console.log("e", e);
        }
    }
    const getValue = async () => {
        try {
            if (connectWallet == "Connect Wallet") {
            } else if (connectWallet == "Wrong Network") {
            } else {
                let proposalArray = []
                let statusArray = []
                const web3 = window.web3;
                const tenderContract = new web3.eth.Contract(
                    tenderAbi,
                    tenderAddress
                )
                let getTotalTenderCount = await tenderContract.methods.getTotalTenderCount().call();
                getTotalTenderCount = Number(getTotalTenderCount)
                let getTotalProposalsCount = await tenderContract.methods.getTotalProposalsCount().call()
                getTotalProposalsCount = Number(getTotalProposalsCount)
                if (getTotalTenderCount > 0) {
                    for (let i = 0; i < getTotalTenderCount; i++) {
                        let tenders = await tenderContract.methods.tenders(i).call()
                        let getTProposals = await tenderContract.methods.getTProposals(i).call()
                        getTProposals.forEach((element) => {
                            let result = {
                                bidder: element.bidder,
                                description: element.proposalDescription,
                                proposalId: Number(element.proposalId),
                                tenderID: Number(element.tenderID),
                                votes: Number(element.votes),
                                proposalStatus: Number(element.proposalStatus) == 0 ? "Winner" : Number(element.proposalStatus) == 1 ? "Rejected" : Number(element.proposalStatus) == 2 ? "Pending" : "Submitted"
                            }
                            proposalArray.push(result)
                        })
                        let tenderDeadline = Number(tenders.tenderDeadline)
                        tenderDeadline = unixTimeConvert(tenderDeadline)
                        let tenderStartSate = Number(tenders.tenderStartSate)
                        tenderStartSate = unixTimeConvert(tenderStartSate)
                        if (Number(tenders.tenderStatus) === 0) {
                            let datas = {
                                tenderId: Number(tenders.tenderId),
                                tenderTitle: tenders.tenderTitle,
                                tenderDescription: tenders.tenderDescription,
                                tenderStatus: Number(tenders.tenderStatus),
                                tenderDeadline: tenderDeadline,
                                tenderStartSate: tenderStartSate,
                                owner: tenders.owner,
                            }
                            statusArray.push(datas)
                        }
                    }
                }
                setProposalDetails(proposalArray)
                setOpenTenderStatus(statusArray)
            }

        } catch (e) {
            console.log("e", e);
        }
    }

    const changeTender = async (e) => {
        try {
            let proposalArray = []
            let value = e.target.value;
            setSelectedTender(value)
            const web3 = window.web3;
            const tenderContract = new web3.eth.Contract(
                tenderAbi,
                tenderAddress
            )
            let getTProposals = await tenderContract.methods.getTProposals(value).call()
            if (getTProposals) {
                getTProposals.forEach((element) => {
                    let result = {
                        bidder: element.bidder,
                        description: element.proposalDescription,
                        proposalId: Number(element.proposalId),
                        tenderID: Number(element.tenderID),
                        votes: Number(element.votes),
                        proposalStatus: Number(element.proposalStatus) == 0 ? "Winner" : Number(element.proposalStatus) == 1 ? "Rejected" : Number(element.proposalStatus) == 2 ? "Pending" : "Submitted"
                    }
                    proposalArray.push(result)
                })
            }
            setProposalDetailForSelect(proposalArray)
        } catch (e) {
            console.log("e", e);
        }
    }


    const handleVoteForProposal = async () => {
        try {

            if (!proposalValue || !selectedTender) {
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
                const sabzContract = new web3.eth.Contract(sabzAbi, sabzAddress);
                const tenderVotingContract = new web3.eth.Contract(tenderVotingAbi, tenderVotingAddress);
                const getHolderShare = await sabzContract.methods.getHolderShare(connectWallet).call();
                const hasVoted = await tenderVotingContract.methods.hasVoted(selectedTender, connectWallet).call();
                const isVotingEnded = await tenderVotingContract.methods.isVotingEnded(selectedTender).call();
                const isVotingStarted = await tenderVotingContract.methods.isVotingStarted(selectedTender).call()
                const getAuthorityMembers = await tenderVotingContract.methods.getAuthorityMembers().call()
                console.log("selectedTender", selectedTender);
                if (getAuthorityMembers.includes(connectWallet)) {
                    if (!hasVoted) {
                        if (isVotingStarted == true) {
                            if (isVotingEnded == false) {
                                if (Number(getHolderShare) >= 10) {
                                    let voteForProposal = await tenderVotingContract.methods.voteForProposal(selectedTender, proposalValue)
                                        .send({ from: connectWallet })

                                    if (voteForProposal) {
                                        setLoading(false)
                                        setSelectedTender("")
                                        setProposalValue("")
                                        toast.success("Voting for proposal successfully")
                                    }
                                } else {
                                    toast.error("insufficient Balance")
                                    setLoading(false)
                                }
                            } else {
                                toast.error("Voting Time Expired");
                                setLoading(false)
                            }
                        } else {
                            toast.error("Voting Time Not Started");
                            setLoading(false)
                        }
                    } else {
                        toast.error("you have already voted");
                        setLoading(false)
                    }
                } else {
                    toast.error("You are not authorized to vote.");
                    setLoading(false);
                }
            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }

    const handleWinner = async () => {
        try {
            if (!selectedTenderForWinner) {
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
                const tenderVotingContract = new web3.eth.Contract(tenderVotingAbi, tenderVotingAddress);
                const isVotingEnded = await tenderVotingContract.methods.isVotingEnded(selectedTenderForWinner).call();
                const owner = await tenderVotingContract.methods.owner().call();
                if (owner === connectWallet) {
                    if (isVotingEnded == true) {
                        let determineWinner = await tenderVotingContract.methods.determineWinner(selectedTenderForWinner).send({from: connectWallet})

                        if(determineWinner){
                            setLoading(false)
                            toast.success("Winner Announced.")
                            setSelectedTenderForWinner("")
                        }
                    } else {
                        toast.error("Winner Time Not Started");
                        setLoading(false)
                    }
                } else {
                    toast.error("You are not authorized");
                    setLoading(false)
                }

            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }

    useEffect(() => {
        getValue()
    }, [connectWallet])
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
                <h2 className='Tender-h2 mb-4'>Vote Details</h2>
                <div className='row mt-4 d-flex justify-content-md-evenly justify-content-center  w-[95%] ml-8'>
                    <div className='box-width-down text-start mt-4 '>
                        <h3 className='mint-h3'>Winner</h3>
                        <Form.Select aria-label="Default select example" className='input-group mb-3 mt-4 p-3 custom-select'
                            value={selectedTenderForWinner} onChange={(e) => setSelectedTenderForWinner(e.target.value)}
                        >
                            <option value="" disabled>Select a Tender</option>
                            {openTenderStatus.map(tender => (
                                <option key={tender.tenderId} value={tender.tenderId}>
                                    {tender.tenderTitle}
                                </option>
                            ))}
                        </Form.Select>
                        <div className=' row d-flex justify-content-center mt-3'>
                            <div className="d-grid col-md-5 gap-2">
                                <button className='btn btn-connect'
                                    onClick={handleWinner}
                                >
                                    Winner
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className='col-md-5 box-width-min-down text-start mt-4 '>
                        <h3 className='mint-h3'>Vote for Proposal</h3>
                        <Form.Select aria-label="Default select example" className='input-group mb-3 mt-4 p-3 custom-select'
                            value={selectedTender} onChange={(e) => changeTender(e)}
                        >
                            <option value="" disabled>Select a Tender</option>
                            {openTenderStatus.map(tender => (
                                <option key={tender.tenderId} value={tender.tenderId}>
                                    {tender.tenderTitle}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Select aria-label="Default select example" className='input-group mb-3 mt-4 p-3 custom-select'
                            value={proposalValue} onChange={(e) => setProposalValue(e.target.value)}>
                            <option value="" disabled>Select a Tender</option>
                            {proposalDetailForSelect.map(proposal => (
                                <option key={proposal.proposalId} value={proposal.proposalId}>
                                    {proposal.proposalId}
                                </option>
                            ))}
                        </Form.Select>
                        <div className='row d-flex justify-content-center mt-5'>
                            <div className="d-grid col-md-5 gap-2">
                                <button className='btn btn-connect'
                                    onClick={handleVoteForProposal}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-4 d-flex justify-content-md-evenly justify-content-center  w-[95%] ml-8'>

                    <div className='col-md-10 mt-4 table-responsive'>
                        <table class="table  table-hover">
                            <thead class="thead-dark">
                                <tr >
                                    <th scope="col" className='th--color'>Proposal ID</th>
                                    <th scope="col" className='th--color'>Tender ID</th>
                                    <th scope="col" className='th--color'>Description</th>
                                    <th scope="col" className='th--color'>Vote</th>
                                    <th scope="col" className='th--color'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    proposalDetails.length > 0 ?
                                        proposalDetails?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row" className='th--color-tr'>{item.proposalId}</th>
                                                    <td className='th--color-tr'>{item.tenderID}</td>
                                                    <td className='th--color-tr'>{item.description.slice(0, visibleChars)}
                                                        {item.description.length > 50 && (
                                                            <button className='ms-2' onClick={() => {
                                                                setShowFullDescription(!showFullDescription);
                                                                setVisibleChars(showFullDescription ? 50 : item.description.length);
                                                            }}
                                                                style={{ color: "#b6209f", borderBottom: "1px solid #b6209f" }}
                                                            >
                                                                {showFullDescription ? 'See Less' : 'See More'}
                                                            </button>
                                                        )}</td>
                                                    <td className='th--color-tr'>{item.votes}</td>
                                                    <td className='th--color-tr'>{item.proposalStatus}</td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr>
                                                <td className='th--color-tr' colSpan={5}>No Record Found</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                        
                    </div>
                    <div className="pagination-container pb-5">
                            {
                                currentItemsProposal.length > 5 && <ReactPaginate
                                    previousLabel={"previous"}
                                    nextLabel={"next"}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    pageCount={Math.ceil(proposalDetails.length / itemsPerPage)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handleProposalPageClick}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"}
                                />
                            }

                        </div>
                </div>

            </div>
        </>

    )
}

export default Vote