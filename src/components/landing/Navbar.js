import React from 'react';
import { Navbar, Form, Button, Nav, Row, Col, FormControl } from 'react-bootstrap'
import { Header, Image, Modal } from 'semantic-ui-react'
import { Button as MyBtn } from 'semantic-ui-react'
import { Icon,Dropdown } from 'semantic-ui-react'
import axios from 'axios';
import './style.css'

export default class MyNavbar extends React.Component {
    constructor() {
        super()
        this.state = {
            search: '',
            showModal: false,
            user: {}
        }
    }

    onCloseClick = () => {
        console.log("Close clicked");
        this.setState({
            showModal : false
        })
    }
    showModal = () => {
        console.log("Close clicked");
        this.setState({
            showModal : true
        })
    }

    // async fetchKey() {
    //     const res = await axios.get(`http://localhost:4000/users/${this.state.search}`, )
    //         .then(res => {
    //             console.log(res.data, "reqData is coming")
    //             this.setState({
    //                 user: res.data
    //             }, () => console.log(this.state.user.user, "-------------------")

    //             )

    //             localStorage.setItem("searchData1", JSON.stringify(this.state.user))

    //         })
    //         .catch(e => {
    //             throw new Error(e.response.data);
    //         });
    //     this.search.value = "";

    // }
    // searchKey = (e) => {
    //     console.log("hello", e.target.value)
    //     let val = e.target.value
    //     this.setState({
    //         search: val
    //     })
    //     localStorage.setItem('reqID', val)
    // }
    render() {
        const stateOptions = [
            { key: "1", text: "Paid Emi", value: 1},
            { key: "2", text: "UnPaid Emi", value: 2},
            { key: "3", text: "All", value: 3},
        ]
        return (
            <div>
                <Navbar bg="primary" variant="dark" expand="lg">
                    <Navbar.Brand href="/">Mortgage Loan</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav variant="pills" defaultActiveKey="/">
                        <Nav.Item>
                            <Nav.Link href="/paymentLoan">Payment Loan</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="link-1" href='/paymentScheduler'>Payment Scheduler</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={this.showModal}>Reports</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/config'>Config</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Navbar.Collapse id="basic-navbar-nav" className="left-spacing"  >



                        {/* <Form inline style={{ marginLeft: '200px' }} >
                            <FormControl type="text" placeholder="Search" className="mr-sm-2"
                                ref={el => this.search = el}
                                onChange={(e) => this.searchKey(e)} defaultValue={this.state.search} />
                            <Icon size="large" inverted name='search' className="searchIcon" color='white' link onClick={() => this.fetchKey()} />
                        </Form> */}
                        <Nav className="ml-auto">

                            <Nav.Link href="#link">Services</Nav.Link>
                            <Nav.Link href="#link">Contact</Nav.Link>
                            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>

                        <Form inline className="loginBtn">
                            <Button className="mr-sm-2" variant="outline-light" >LogIn </Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
                {this.props.children}
                {/* <div class="reportModal"> */}
                    <Modal open={this.state.showModal} style={{height: 400,minHeight: '380px',width:'70%', height: '50%',
    marginLeft: '15%', marginTop:'5%'}} closeIcon onClose={this.onCloseClick}>
                        <Modal.Header style={{textAlign: 'center'}}>Generate Report</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                            {/* <Header>Default Profile Image</Header> */}
                            <Row >
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd" >
                                        Request No. <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input">
                                        <input type="text" name="lname" placeholder="Request No." required />
                                        {/* <input type="text"
                                        style={{ borderColor: this.state.errorBorder ? this.state.errorBorder : '' }}
                                        name="fname" onChange={(e) => this.handleOnChange(e)}
                                        placeholder="firstName"
                                        defaultValue={this.state.user.fname && this.state.user.fname} required /> */}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd">
                                        Start date<sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input">
                                        <input type="date" name="Date" placeholder="Start Date" />
                                    </div>
                                </div>
                                
                            </Col>
                        </Row>
                        <Row >
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd">
                                        End date<sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input">
                                        <input type="date" name="Date" placeholder="End Date" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd">
                                    Type<sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input">
                                        <Dropdown placeholder='Report Type' search selection options={stateOptions} />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {/* <Row >
                            <Col className="same-row">
                                <div className="name-space">
                                    <div className="name-wd">
                                    </div >
                                    <div className="ui input">
                                        <Button style={{ width: '150px', color: "white", backgroundColor: 'green' }}>Generate Report</Button>
                                    </div>
                                </div>
                                
                            </Col>
                        </Row> */}
                        <Row >
                            <Button style={{ width: '130px', color: "white", backgroundColor: 'green', marginTop:"35px",marginLeft:'auto', marginRight:'auto',padding: '8px 10px' }}>Generate Report</Button>
                        </Row>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                {/* </div> */}
                
                
            </div>
        )
    }
}
