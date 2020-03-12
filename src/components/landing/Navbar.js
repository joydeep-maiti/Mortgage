import React from 'react';
import { Navbar, Form, Button, Nav, Row, Col, FormControl } from 'react-bootstrap'
import { Header, Image, Modal } from 'semantic-ui-react'
import { Button as MyBtn } from 'semantic-ui-react'
import { Icon,Dropdown } from 'semantic-ui-react'
import axios from 'axios';
import './style.css'
import { Data } from '../../config'
import jsPDF from 'jspdf';
import "jspdf-autotable";
import Logo from '../../logo.png'

let totalEmiPaid = 0;

export default class MyNavbar extends React.Component {
    constructor() {
        super()
        this.state = {
            search: '',
            showModal: false,
            user: {},
            reportReq: {
                reqId: "",
                startDate : "",
                endDate : "",
                type: 3,
            },
            showDateField: false
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

    handleOnChange = (e,data,sel) => {
        
        const val = e.target.value;
        let currentState = this.state.reportReq;
        console.log("-------------------- EVENT",val,sel)
        switch(sel) {
            case "req": currentState.reqId = val;
                            break;
            case "startDate": currentState.startDate = val;
                            break;
            case "endDate": currentState.endDate = val;
                            break;
            case "type": currentState.type = data.value;
                            
        }
        this.setState({
            reportReq : currentState
        },
        ()=>console.log(this.state, currentState)
        )

    }

    onSubmitClick = () => {
        const reportInput = this.state.reportReq
        if((reportInput.startDate=="" && reportInput.type===1) || (reportInput.startDate==null && reportInput.type===1) ||(reportInput.endDate=="" && reportInput.type===1) || (reportInput.endDate==null && reportInput.type===1) || reportInput.reqId=="" || reportInput.reqId==null ||reportInput.type=="" || reportInput.type==null){
            alert("All Fields are required");
        }else {
            this.fetchReportData(reportInput.reqId);
        }
    }

    fetchReportData = (reqId) => {
        let reqid = `Req${('000000' + reqId).slice(-5)}`;
        console.log("Req Id", reqid)
        const self = this;
        axios.get(`${Data.url}/users/${reqid}`)
        .then(res => {
            console.log("fetchReportData", res);
            if(res.status === 200){
                this.setState({
                    user: res.data
                },
                ()=>self.exportPDF()
                )
            }
            

        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
    }

    exportPDF = () => {
        console.log("-------------------STATE", this.state);
        let type = this.state.reportReq.type
        let condition = type === 1 ? "PAID":type === 2 ? "UNPAId":"ALL"
        const loan = this.state.user.expLoans;
        const user = this.state.user.user;
        const reqId = this.state.user.id;

        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const marginLeft = 20;
        const marginLeft2 = 350;
        const basePosition = 130;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(20);
    
        let title = "Payement Scheduler";
        let headers = [["SNo", "Month","Principal","Interest","Total EMI","Amount Paid","Balance EMI","Outstanding Amount","Penalty"]];
        let data = []
        const self = this;
        switch(condition){
            case "ALL": title = "Payment Scheduler";
                        data = self.getAllEmiData();
                        break;
            case "PAID": title = "EMI Paid Report";
                        data = self.getPaidEmiData();
                        break;
            case "UNPAId": title = "EMI Due Report";
                        data = self.getUnpaidEmiData();
                        break;
        }
        console.log("---------------DATA",data)
        // return;
        let content = {
          startY: basePosition+100,
          head: headers,
          body: data,
          theme: 'grid',
          styles: {
            cellWidth:'wrap',
            halign: 'center',
          },
          margin: marginLeft
        };
    
        doc.text(title, 200, 100);
        // doc.text("User Name : "+user.fname + " "+ user.lname,marginLeft, 50);
        doc.setFontSize(15);
        
        doc.text("Loan Details",marginLeft, basePosition);
        doc.text("Customer Details",marginLeft2, basePosition);
        doc.setFontSize(12);
        doc.text("Req No.: "+reqId,marginLeft, basePosition+20);
        doc.text("Principle Amount : "+loan.principle,marginLeft, basePosition+35);
        doc.text("Tenure : "+loan.tenure+" Months",marginLeft, basePosition+50);
        doc.text("Current Interest Rate : "+loan.intrest+"%",marginLeft, basePosition+65);
        doc.text("Start Date : "+loan.startDate,marginLeft, basePosition+80);

        doc.text("User Name : "+user.fname + " "+ user.lname,marginLeft2, basePosition+20);
        doc.text("Mobile No. : "+user.mobileNo,marginLeft2, basePosition+35);

        doc.autoTable(content);
        // doc.autoTable({ html: '#emiTable' })
        doc.save(this.state.user.id+".pdf")
    }

    getAllEmiData = () => {
        totalEmiPaid = 0;
        console.log("============= in get all emi",)
        let emidatas = this.state.user.emiScheduler ? this.state.user.emiScheduler : this.state.user.totalEmi
        let data = emidatas.map((el,i)=> {
            totalEmiPaid += el.paidEmi!== undefined?parseInt(el.paidEmi):parseInt(0);
            return [
                i+1,
                el.month!== undefined?el.month:"Nil", 
                el.principal!== undefined?el.principal:"Nil",
                el.interest!== undefined?el.interest:"Nil",
                el.emi!== undefined?el.emi:"Nil",
                el.paidEmi!== undefined?el.paidEmi:"Nil",
                el.balEmi !== undefined?el.balEmi:"Nil",
                el.outstandingBal?el.outstandingBal:0,
                el.unpaidPen !== undefined?el.unpaidPen:"Nil"
            ]
        });
        data.push([
            "",
            "Total",
            "",
            "",
            "",
            totalEmiPaid,
            "",
            "",
            ""
        ])

        return data;
    }

    getPaidEmiData = () => {
        totalEmiPaid = 0;
        
        console.log("============= in get paid emi",)
        if( !this.state.user.emiScheduler ){
            alert("No Paid Emis found");
            return
        }
        let emidatas = this.state.user.emiScheduler 
        let data = [];

        let startdate = this.state.reportReq.startDate
        let enddate = this.state.reportReq.endDate
        
        emidatas.map((el,i)=> {
            totalEmiPaid += el.paidEmi!== undefined?parseInt(el.paidEmi):parseInt(0);
            if(el.paidEmi !== undefined){
                let date = el.month.split("-");
                let day = date[0];
                let mon = date[1];
                let yr = date[2];
                date = yr + '-' + mon + '-' + day;

                if( date >= startdate && date <= enddate){
                    console.log("-----------Start lesser than Emi",date, startdate, enddate)
                    data.push([
                        i+1,
                        el.month!== undefined?el.month:"Nil", 
                        el.principal!== undefined?el.principal:"Nil",
                        el.interest!== undefined?el.interest:"Nil",
                        el.emi!== undefined?el.emi:"Nil",
                        el.paidEmi!== undefined?el.paidEmi:"Nil",
                        el.balEmi !== undefined?el.balEmi:"Nil",
                        el.outstandingBal?el.outstandingBal:0,
                        el.unpaidPen !== undefined?el.unpaidPen:"Nil"
                    ])
                }
                
                
            }
        });
        if(data.length === 0){
            alert("No Paid Emi data found for the time period")
            return
        }
        data.push([
            "",
            "Total",
            "",
            "",
            "",
            totalEmiPaid,
            "",
            "",
            ""
        ])

        return data;
    }

    getUnpaidEmiData = () => {
        console.log("============= in get paid emi",)
        let data = [];
        let count = 1;
        totalEmiPaid = 0;
        let totalDue =0 ;
        let flag = 0;
        let emidatas = this.state.user.emiScheduler ? this.state.user.emiScheduler : this.state.user.totalEmi
        emidatas.map((el,i)=> {
            totalEmiPaid += el.paidEmi!== undefined?parseInt(el.paidEmi):parseInt(0);
            if(el.paidEmi == undefined){
                if(flag == 0){
                    totalDue = el.outstandingBal
                    flag =1;
                }
                data.push([
                    count,
                    el.month!== undefined?el.month:"Nil", 
                    el.principal!== undefined?el.principal:"Nil",
                    el.interest!== undefined?el.interest:"Nil",
                    el.emi!== undefined?el.emi:"Nil",
                    el.paidEmi!== undefined?el.paidEmi:"Nil",
                    el.balEmi !== undefined?el.balEmi:"Nil",
                    el.outstandingBal?el.outstandingBal:0,
                    el.unpaidPen !== undefined?el.unpaidPen:"Nil"
                ])
                count++;

            }
            
        });
        data.push([
            "",
            "Total Due",
            "",
            "",
            "",
            "",
            "",
            totalDue,
            ""
        ])

        return data;
    }

   
    render() {
        const stateOptions = [
            { key: "1", text: "Paid Emi", value: 1},
            { key: "2", text: "UnPaid Emi", value: 2},
            { key: "3", text: "All", value: 3},
        ]
        return (
            <div>
                <Navbar bg="primary" variant="dark" expand="lg">
                    <Navbar.Brand href="/">
                        <img src={Logo} width="50px" height="auto" style={{borderRadius:"11px"}}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav variant="pills" defaultActiveKey="/">
                        <Nav.Item>
                            <Nav.Link href="/mortgage">Apply Loan</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/paymentLoan">Loan Applications</Nav.Link>
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
                    <Modal open={this.state.showModal} style={{height:"auto",minHeight:300,width:'40%',
    marginLeft: '30%', marginTop:'10%',borderradius:'15px',}} closeIcon onClose={this.onCloseClick}>
                        <Modal.Header style={{textAlign: 'center'}}>Generate Report</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                            {/* <Header>Default Profile Image</Header> */}
                            <Row >
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd" style={{textAlign:"right", marginRight:10}} >
                                        Request No. <sup style={{ color: 'red' }}>*</sup>&nbsp;&nbsp;:
                                    </div >
                                    <div className="ui input" style={{width:"196px"}}>
                                        <input type="text" name="reqno" placeholder="Request No." required onChange={(e,data) => this.handleOnChange(e,data,"req" )} value={this.state.reportReq.reqId} required/>
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
                                    <div className="name-wd" style={{textAlign:"right", marginRight:10}}>
                                    Type<sup style={{ color: 'red' }}>*</sup>:
                                    </div>
                                    <div className="ui input">
                                        <Dropdown placeholder='Report Type' search selection options={stateOptions} onChange={(e,data) => this.handleOnChange(e,data,"type")} defaultValue={this.state.reportReq.type} required/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row style={this.state.reportReq.type === 1?{display:"block"}:{display:"none"}}>
                            <Col className="same-row" >
                                <div className="reportCol">
                                    <div className="name-wd" style={{textAlign:"right", marginRight:10}}>
                                        Start date<sup style={{ color: 'red' }}>*</sup>&nbsp;&nbsp;:
                                    </div >
                                    <div className="ui input" style={{width:"196px"}}>
                                        <input type="date" name="Date" placeholder="Start Date" onChange={(e,data) => this.handleOnChange(e,data,"startDate" )} value={this.state.reportReq.startDate} required/>
                                    </div>
                                </div>
                                
                            </Col>
                        </Row>
                        <Row style={this.state.reportReq.type === 1?{display:"block"}:{display:"none"}}>
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd" style={{textAlign:"right", marginRight:10}}>
                                        End date<sup style={{ color: 'red' }}>*</sup>&nbsp;&nbsp;:
                                    </div >
                                    <div className="ui input" style={{width:"196px"}}>
                                        <input type="date" name="Date" placeholder="End Date" onChange={(e,data) => this.handleOnChange(e,data,"endDate" )} value={this.state.reportReq.endDate} required/>
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
                            <Button style={{ width: '130px', color: "white", backgroundColor: 'green', marginTop:"35px",marginLeft:'auto', marginRight:'auto',padding: '8px 10px' }}onClick={this.onSubmitClick}>Generate Report</Button>
                        </Row>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                {/* </div> */}
                
                
            </div>
        )
    }
}
