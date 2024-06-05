import React, { useContext, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./navbar.css"
import { AuthUserContext } from '../../context';
import { loadWeb3 } from '../../utils/api/api';
import { Link } from 'react-router-dom';
function Navbars() {
  const { setConnectWallet, checkBalance } = useContext(AuthUserContext);
  const [address, setAddress] = useState("Connect Wallet");
  console.log("checkBalance", checkBalance);
  const handleConnect = async () => {
    try {
      let acc = await loadWeb3();
      if (acc === "No Wallet") {
        setConnectWallet("No Wallet");
        setAddress("Wrong Network");
      } else if (acc === "Wrong Network") {
        setConnectWallet("Wrong Network");
        setAddress("Wrong Network");
      } else {
        setAddress(acc.substring(0, 4) + "..." + acc.substring(acc.length - 4))
        setConnectWallet(acc);
      }
    } catch (err) {
      console.log("err", err);
    }
  }
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" className='mt-3  p-md-4'>
        <Container> 
          <Navbar.Brand href="#home" className='log-text ml-md-12 font-sans hover:text-2xl'>TenderSabz Vote</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Nav className='mr-8'>
              <Link to="/"><Nav.Link href="/" className='buy-text'>BUY SABZ</Nav.Link></Link>
              {
                checkBalance >= 10 ? (
                  <Link to="/tender"><Nav.Link href="/tender" className='buy-text'>TENDERS</Nav.Link></Link>
                ) : (
                  <Nav.Link  className='buy-text'>TENDERS</Nav.Link>
                )
              }
             
             <Link to="/vote"><Nav.Link href="/vote" className='buy-text'>VOTING</Nav.Link></Link>
              <button className="btn btn-connect ms-2 hover:bg-[#414174]" size="sm" onClick={handleConnect}>{address}</button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default Navbars