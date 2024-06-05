import React, { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { AuthUserContext } from '../../context';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import { tenderAddress, tenderAbi } from '../../utils/contract/TenderContract';
import { RxCross2 } from "react-icons/rx";
import { IoWallet } from "react-icons/io5";
import { MdToken } from "react-icons/md";
import ReactPaginate from 'react-paginate';
function Tender() {
    const [loading, setLoading] = useState(false);
    const { connectWallet, checkBalance } = useContext(AuthUserContext);
    const [modalShow, setModalShow] = React.useState(false);
    const [tenderDetails, setTenderDetails] = useState([])
    const [modelTender, setModalTendar] = useState()
    const [totalTender, setTotalTender] = useState(0)
    const [totalproposal, setTotalProposal] = useState(0)
    const [ownerAddress, setOwnerAddress] = useState()
    const [selectedTender, setSelectedTender] = useState("");
    const [description, setDescription] = useState();
    const [openTenderStatus, setOpenTenderStatus] = useState([])
    const [proposalDetails, setProposalDetails] = useState([])
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [visibleChars, setVisibleChars] = useState(50);
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const [proposalCurrentPage, setProsalCurrentPage] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    console.log(checkBalance,"checkBalance")
    const handleTender = async () => {
        try {
            if (!formData.title || !formData.description || !formData.date) {
                toast.error("Please Fill the Inputs First")
                return false
            }

            if (connectWallet == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallet == "Wrong Network") {
                toast.error("Please Connect Correct network")
            } else {
                setLoading(true)
                let minutes = 86400 * formData.date
                const web3 = window.web3;
                const tenderContract = new web3.eth.Contract(
                    tenderAbi,
                    tenderAddress
                )

                const openTender = await tenderContract.methods.openTender(formData.title, formData.description, minutes)
                    .send({
                        from: connectWallet
                    })
                if (openTender) {
                    setLoading(false)
                    toast.success("Tender Open Successfully.")
                    setFormData({
                        title: '',
                        description: '',
                        date: '',
                    })
                }
            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }

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

    const tanderDetails = (item) => {
        try {
            setModalTendar(item)
            setModalShow(true)
        } catch (e) {
            console.log("e", e);
        }
    }

    const getValue = async () => {
        try {
            if (connectWallet == "Connect Wallet") {
            } else if (connectWallet == "Wrong Network") {
            } else {
                let array = []
                let statusArray = []
                let proposalArray = []
                const web3 = window.web3;
                const tenderContract = new web3.eth.Contract(
                    tenderAbi,
                    tenderAddress
                )
                let getTotalTenderCount = await tenderContract.methods.getTotalTenderCount().call();
                let getTotalProposalsCount = await tenderContract.methods.getTotalProposalsCount().call()
                getTotalProposalsCount = Number(getTotalProposalsCount)
                getTotalTenderCount = Number(getTotalTenderCount)
                setTotalTender(getTotalTenderCount)
                setTotalProposal(getTotalProposalsCount)
                let owner = await tenderContract.methods.owner().call();
                setOwnerAddress(owner)

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
                        let data = {
                            tenderId: Number(tenders.tenderId),
                            tenderTitle: tenders.tenderTitle,
                            tenderDescription: tenders.tenderDescription,
                            tenderStatus: Number(tenders.tenderStatus) == 2 ? "Pending" : Number(tenders.tenderStatus) == 1 ? "Close" : "Open",
                            tenderDeadline: tenderDeadline,
                            tenderStartSate: tenderStartSate,
                            owner: tenders.owner,
                        }
                        array.push(data)
                    }
                }
                setTenderDetails(array)
                setOpenTenderStatus(statusArray)
                setProposalDetails(proposalArray)
            }

        } catch (e) {
            console.log("e", e);
        }
    }

    const handleOpenTender = async (id) => {
        try {
            console.log("id", id);
            setLoading(true)
            const web3 = window.web3;
            const tenderContract = new web3.eth.Contract(
                tenderAbi,
                tenderAddress
            )

            const openTender = await tenderContract.methods.openTender(id)
                .send({
                    from: connectWallet
                })

            if (openTender) {
                setLoading(false)
                toast.success("Tender opened successfully.")
                getValue()
            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }
    const handleCloseTender = async (id) => {
        try {
            console.log("id", id);
            setLoading(true)
            const web3 = window.web3;
            const tenderContract = new web3.eth.Contract(
                tenderAbi,
                tenderAddress
            )

            const closeTender = await tenderContract.methods.closeTender(id)
                .send({
                    from: connectWallet
                })

            if (closeTender) {
                setLoading(false)
                toast.success("Tender Closed successfully.")
                getValue()
            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }

    const handleProposal = async () => {
        try {
            if (!selectedTender || !description) {
                toast.error("Please Fill the Inputs First")
                return false
            }
            setLoading(true)
            const web3 = window.web3;
            const tenderContract = new web3.eth.Contract(
                tenderAbi,
                tenderAddress
            )
            if (checkBalance >= 10) {
                let submitProposal = await tenderContract.methods.submitProposal(Number(selectedTender), description)
                    .send({
                        from: connectWallet
                    })
                if (submitProposal) {
                    setLoading(false)
                    toast.success("Proposal successfully submitted")
                    setDescription('')
                    setSelectedTender('')
                    getValue()

                }
            } else {
                setLoading(false)
                toast.error("Insufficient Token Balance")
            }

        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }

    
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    const handleProposalPageClick = ({ selected }) => {
        setProsalCurrentPage(selected);
    };
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tenderDetails.slice(indexOfFirstItem, indexOfLastItem);

    // proposal pagination
    const indexOfLastItemProposal = (proposalCurrentPage + 1) * itemsPerPage;
    const indexOfFirstItemProposal = indexOfLastItemProposal - itemsPerPage;
    const currentItemsProposal = proposalDetails.slice(indexOfFirstItemProposal, indexOfLastItemProposal);

    useEffect(() => {
        getValue()
    }, [connectWallet, modelTender])
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
                <div className='row d-flex justify-content-md-evenly justify-content-center mt-4'>
                    <div className='col-md-6 col-11 box-width mt-2 '>
                        <span className='mint-span d-flex'><MdToken size={25} color='#fff' className='me-2' /> Total Tender</span>
                        <span>{totalTender}</span>
                    </div>
                    <div className='col-md-6 col-11 box-width mt-2 '>
                        <span className='mint-span d-flex'><IoWallet size={25} color='#fff' className='me-2' /> Total Proposal</span>
                        <span>{totalproposal}</span>
                    </div>
                </div>
                <div className='row mt-4 d-flex justify-content-md-evenly justify-content-center  '>
                <h2 className='Tender-h2 mt-4 mb-3'>Tender Details</h2>
                    <div className='col-md-5 box-width-min-down text-start mt-4 mr-4'>
                        <h3 className='mint-h3'>Open Tender</h3>
                        <InputGroup className="mb-3 mt-4">
                            <Form.Control
                                placeholder="Enter Title"
                                type="text"
                                className='input-group'
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3 mt-4">
                            <Form.Control
                                placeholder="Enter Description"
                                type="text"
                                className='input-group'
                                min={1}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3 mt-4">
                            <Form.Control
                                placeholder='please enter day'
                                type="number"
                                className='input-group'
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <div className='row d-flex justify-content-center'>
                            <div className="d-grid col-md-5 gap-2">
                                <button className='btn btn-connect' onClick={handleTender}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-4 d-flex justify-content-md-evenly justify-content-center  '>
                    
                    <div className='col-md-10 mt-4 table-responsive'>
                        <table class="table  table-hover">
                            <thead class="thead-dark">
                                <tr >
                                    <th scope="col" className='th--color'>Sr.</th>
                                    <th scope="col" className='th--color'>Title</th>
                                    <th scope="col" className='th--color'>Status</th>
                                    <th scope="col" className='th--color'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentItems.length > 0 ?
                                        currentItems?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row" className='th--color-tr'>{index + 1}</th>
                                                    <td className='th--color-tr'>{item.tenderTitle}</td>
                                                    <td className='th--color-tr'>{item.tenderStatus}</td>
                                                    <td className='th--color-tr'><button className='btn btn-connect' onClick={() => tanderDetails(item)}>Details</button></td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr>
                                                <td className='th--color-tr' colSpan={4}>No Record Found</td>
                                            </tr>
                                        )
                                }


                            </tbody>
                        </table>
                        
                    </div>
                    <div className="pagination-container">
                            {
                                currentItems.length > 5 && <ReactPaginate
                                    previousLabel={"previous"}
                                    nextLabel={"next"}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    pageCount={Math.ceil(tenderDetails.length / itemsPerPage)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageClick}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"}
                                />
                            }

                        </div>
                </div>

                <div className='row mt-4 d-flex justify-content-md-evenly justify-content-center '>
                <h2 className='Tender-h2 mt-4 mb-3'>Proposal Details</h2>
                    <div className='col-md-5 box-width-min-down text-start mt-4 mr-4'>
                        <h3 className='mint-h3 mt-4'>Submit Proposal</h3>
                        <Form.Select aria-label="Default select example" className='input-group mb-3 mt-4 p-2 custom-select'
                            value={selectedTender} onChange={(e) => setSelectedTender(e.target.value)}
                        >
                            <option value="" disabled>Select a Tender</option>
                            {openTenderStatus.map(tender => (
                                <option key={tender.tenderId} value={tender.tenderId}>
                                    {tender.tenderTitle}
                                </option>
                            ))}
                        </Form.Select>
                        <InputGroup className="mb-3 mt-4">
                            <Form.Control
                                placeholder='Please Enter Description'
                                type="text"
                                className='input-group'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </InputGroup>
                        <div className='row d-flex justify-content-center mt-5'>
                            <div className="d-grid col-md-5 gap-2">
                                <button className='btn btn-connect' onClick={handleProposal}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-4 d-flex justify-content-md-evenly justify-content-center   '>
                    
                    <div className='col-md-11 mt-4 table-responsive'>
                        <table class="table  table-hover">
                            <thead class="thead-dark">
                                <tr >
                                    <th scope="col" className='th--color'>Proposal ID</th>
                                    <th scope="col" className='th--color'>Tender ID</th>
                                    <th scope="col" className='th--color'>Description</th>
                                    <th scope="col" className='th--color'>Address</th>
                                    <th scope="col" className='th--color'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentItemsProposal.length > 0 ?
                                        currentItemsProposal?.map((item, index) => {
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
                                                            style={{color: "#b6209f", borderBottom: "1px solid #b6209f" }}
                                                            >
                                                                {showFullDescription ? 'See Less' : 'See More'}
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className='th--color-tr'>{item.bidder}</td>
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

            {
                modalShow ? (
                    <Modal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered

                    >
                        <Modal.Body style={{
                            backgroundColor: "#192734"
                        }}>
                            <div className=' d-flex justify-content-between'>
                                <h4 className='Tendar--h4'>Tender Details</h4>
                                <RxCross2 size={30} style={{ cursor: "pointer" }} onClick={() => setModalShow(false)} />
                            </div>
                            <div>
                                <div className='row mt-3'>
                                    <div className='col-md-6 d-flex justify-between mt-3'>
                                        <span className='tile-span'>Tender Title</span>
                                        <span className='tile-span-one'>{modelTender.tenderTitle}</span>
                                    </div>
                                    <div className='col-md-6 d-flex justify-between mt-3'>
                                        <span className='tile-span'>Tender Description</span>
                                        <span className='tile-span-one'>{modelTender.tenderDescription}</span>
                                    </div>
                                    <div className='col-md-6 d-flex justify-between mt-3'>
                                        <span className='tile-span'>Tender Start Date</span>
                                        <span className='tile-span-one'>{modelTender.tenderStartSate}</span>
                                    </div>
                                    <div className='col-md-6 d-flex justify-between mt-3'>
                                        <span className='tile-span'>Tender Deadline</span>
                                        <span className='tile-span-one'>{modelTender.tenderDeadline}</span>
                                    </div>
                                </div>

                                {
                                    ownerAddress === connectWallet ? (
                                        <div className='row mt-4'>
                                            <div className='col-md-6'>
                                                <div className="d-grid gap-2">
                                                    {
                                                        modelTender.tenderStatus == "Open" || modelTender.tenderStatus == "Close" ? <button className='btn btn-connect' disabled>
                                                            Open Tender
                                                        </button> : <button className='btn btn-connect' onClick={() => handleOpenTender(modelTender.tenderId)}>
                                                            Open Tender
                                                        </button>
                                                    }

                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="d-grid gap-2">
                                                    {
                                                        modelTender.tenderStatus == "Close" ? <button className='btn btn-connect' disabled>
                                                            Close Tender
                                                        </button> : <button className='btn btn-connect' onClick={() => handleCloseTender(modelTender.tenderId)}>
                                                            Close Tender
                                                        </button>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='row mt-4'>
                                            <div className='col-md-6'>
                                                <div className="d-grid gap-2">
                                                    <button className='btn btn-connect' disabled>
                                                        Open Tender
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="d-grid gap-2">
                                                    <button className='btn btn-connect' disabled>
                                                        Close Tender
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </Modal.Body>
                    </Modal>
                ) : (
                    <></>
                )
            }
        </>

    )
}

export default Tender