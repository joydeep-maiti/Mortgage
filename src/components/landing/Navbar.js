import React from 'react';
import { Navbar, Form, Button, Nav, Row, Col, FormControl } from 'react-bootstrap'
import { Header, Image, Modal } from 'semantic-ui-react'
import { Button as MyBtn } from 'semantic-ui-react'
import { Icon,Dropdown } from 'semantic-ui-react'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import axios from 'axios';
import './style.css'
import { Data } from '../../config'
import jsPDF from 'jspdf';
import "jspdf-autotable";
import Logo from '../../logo.jpg'

let totalEmiPaid = 0;

export default class MyNavbar extends React.Component {
    constructor() {
        super()
        this.state = {
            search: '',
            showModal: false,
            user: [],
            reportReq: {
                reqId: "",
                startDate : "",
                endDate : "",
                type: 3,
            },
            showDateField: false,
            anchorEl: null,
            selectedValue : 'ALL'
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
        if( this.state.selectedValue == 'APP' ){
            if( reportInput.reqId=="" || reportInput.reqId==null ){
                alert("All Fields are required");
                return
            }else if((reportInput.startDate=="" && reportInput.type===1) || (reportInput.startDate==null && reportInput.type===1) ||(reportInput.endDate=="" && reportInput.type===1) || (reportInput.endDate==null && reportInput.type===1) || reportInput.type=="" || reportInput.type==null){
                alert("All Fields are required");
                return;
            }else {
                this.fetchReportData(reportInput.reqId);
            }
           
        }else {
            if((reportInput.startDate=="" && reportInput.type===1) || (reportInput.startDate==null && reportInput.type===1) ||(reportInput.endDate=="" && reportInput.type===1) || (reportInput.endDate==null && reportInput.type===1) || reportInput.type=="" || reportInput.type==null){
                alert("All Fields are required");
                return;
            }else {
                this.fetchReportData();
            }
        }
        
    }

    fetchReportData = (reqId) => {
        console.log('===============reqId', reqId);
        let url = null
        if( reqId == undefined ){
            url = `${Data.url}/users`
        }else {
            let reqid = `Req${('000000' + reqId).slice(-5)}`;
            // console.log("Req Id", reqid)
            url = `${Data.url}/users/${reqid}`;
        }
        console.log('----------URL', url);
        // return;
        const self = this;
        axios.get(url)
        .then(res => {
            console.log("fetchReportData", res);
            if(res.status === 200){
                if( reqId == undefined ){
                    this.setState({
                        applications: res.data
                    },
                        ()=>self.exportPDF('ALL')
                    )
                }else {
                    let response = []
                    response.push(res.data);
                    this.setState({
                        user: response
                    },
                        ()=>self.exportPDF('APP')
                    )
                }
                
            }
            

        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
    }

    exportPDF = (el) => {
        console.log("-------------------STATE", this.state);
        if(el === 'ALL'){

        }else if(el === 'APP'){

        }
        // return;
        let type = this.state.reportReq.type
        let condition = type === 1 ? "PAID":type === 2 ? "UNPAId":"ALL"
        

        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const marginLeft = 20;
        const marginLeft2 = 350;
        const basePosition = 130;
        const doc = new jsPDF(orientation, unit, size);
    
        
    
        let title = "Payement Scheduler";
        let headers = [["SNo", "Month","Principal","Interest","Total EMI","Amount Paid","Balance EMI","Outstanding Amount","Penalty"]];
        let applicationsEmiJsonArray = []
        const self = this;
        switch(condition){
            case "ALL": title = "Payment Scheduler";
            applicationsEmiJsonArray = self.getAllEmiData();
                        break;
            case "PAID": title = "EMI Paid Report";
            applicationsEmiJsonArray = self.getPaidEmiData();
                        break;
            case "UNPAId": title = "EMI Due Report";
            applicationsEmiJsonArray = self.getUnpaidEmiData();
                        break;
        }
        // console.log("---------------applicationsEmiJsonArray",applicationsEmiJsonArray)
        // return;
        let flag = 0;
        let pageCount = 0;
        // let footer = function (data) {
        //     doc.setFontSize(10);
        //     doc.setFontStyle('normal');
        //     let pageCount = pageCount + data.pageCount
        //     var str ="Page " + pageCount;
        //     doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
        //     // var today = new moment().format("YYYY-MM-DD");
        //     // doc.text(today, right, doc.internal.pageSize.height - 30, 'right');
        // };

        for( let i=0 ; i<applicationsEmiJsonArray.length ; i++ ){

            let loan = applicationsEmiJsonArray[i].expLoans;
            let user = applicationsEmiJsonArray[i].user;
            let reqId = applicationsEmiJsonArray[i].id;
            let content = {
                startY: basePosition+100,
                head: headers,
                body: applicationsEmiJsonArray[i].emiTableData,
                theme: 'grid',
                styles: {
                cellWidth:'wrap',
                halign: 'center',
                },
                margin: marginLeft
            };
            
            if(flag == 1){
                doc.addPage(orientation, unit, size )
            }
            if(flag == 0){
                flag = 1;
            }
            doc.setFontSize(20);
            doc.text(title, 200, 100);
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
            console.log("------------------page no", doc.internal.getNumberOfPages());
            
        }
        console.log("------------------page no", doc.internal.getNumberOfPages())
        // doc.autoTable({ html: '#emiTable' })
        doc.save(this.state.user.id+".pdf")
    }
    // , [], {
    //     afterPageContent: footer,
    //     headerStyles: {
    //         fillColor: 255,
    //         textColor: 0,
    //         fontStyle: 'bold',
    //         rowHeight: 20
    //     }
    // }
    getAllEmiData = () => {
        let applicationsEmiJsonArray = []
        let applications = this.state.applications
        for(let i = 0 ; i < applications.length ; i++){
            totalEmiPaid = 0;
            console.log("============= in get all emi",)
            let emidatas = applications[i].emiScheduler ? applications[i].emiScheduler : applications[i].totalEmi
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
            if(data.length>0){
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
                let applicationsEmiJson =  {
                    user : applications[i].user,
                    expLoans : applications[i].expLoans,
                    id : applications[i].id,
                    emiTableData : data
                }
    
                applicationsEmiJsonArray.push(applicationsEmiJson);
            }  

        }
        
        // console.log("-------------applicationsEmiJsonArray", applicationsEmiJsonArray);
        return applicationsEmiJsonArray;
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
    handleMenu = event => {
        this.setAnchorEl(event.currentTarget);
    };
    
    handleClose = () => {
        this.setAnchorEl(null);
    };

    handleLogout = () => {
        this.props.handleLogout();
    };

    setAnchorEl = (el)=> {
        this.setState({
            anchorEl: el
        })
    }

    handleChange = event => {
        this.setState({
            selectedValue : event.target.value
        })
    };
   
    render() {
        const stateOptions = [
            { key: "1", text: "Paid Emi", value: 1},
            { key: "2", text: "Unpaid Emi", value: 2},
            { key: "3", text: "All", value: 3},
        ]

        const open = Boolean(this.state.anchorEl);
        
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
                        <Nav className="ml-auto">
                            <Nav.Link href="#link">Services</Nav.Link>
                            <Nav.Link href="#link">Contact</Nav.Link>
                        </Nav>
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                            <AccountCircle style={{ color: 'white' }}/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
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
                                    <div className="name-wd2" style={{textAlign:"right", marginRight:10}} >
                                        Application Type. <sup style={{ color: 'red' }}>*</sup>&nbsp;&nbsp;:
                                    </div>
                                    <div className="ui input" style={{width:"200px"}}>
                                    <RadioGroup aria-label="position" name="position" value={this.state.selectedValue} onChange={this.handleChange} row>
                                        <FormControlLabel
                                            value="ALL"
                                            control={<Radio color="primary" />}
                                            label="All"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel
                                            value="APP"
                                            control={<Radio color="primary" />}
                                            label="Application No"
                                            labelPlacement="end"
                                        />
                                    </RadioGroup>

                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row style={this.state.selectedValue === 'APP'?{display:"block"}:{display:"none"}}>
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd2" style={{textAlign:"right", marginRight:10}} >
                                        Request No. <sup style={{ color: 'red' }}>*</sup>&nbsp;&nbsp;:
                                    </div >
                                    <div className="ui input" style={{width:"200px"}}>
                                        <input type="text" name="reqno" placeholder="Request No." required onChange={(e,data) => this.handleOnChange(e,data,"req" )} value={this.state.reportReq.reqId} required/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd2" style={{textAlign:"right", marginRight:10}}>
                                    Report Type<sup style={{ color: 'red' }}>*</sup>:
                                    </div>
                                    <div className="ui input" style={{width:"200px"}}>
                                        <Dropdown placeholder='Report Type' search selection options={stateOptions} onChange={(e,data) => this.handleOnChange(e,data,"type")} defaultValue={this.state.reportReq.type} required/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row style={this.state.reportReq.type === 1?{display:"block"}:{display:"none"}}>
                            <Col className="same-row" >
                                <div className="reportCol">
                                    <div className="name-wd2" style={{textAlign:"right", marginRight:10}}>
                                        Start date<sup style={{ color: 'red' }}>*</sup>&nbsp;&nbsp;:
                                    </div >
                                    <div className="ui input" style={{width:"200px"}}>
                                        <input type="date" name="Date" placeholder="Start Date" onChange={(e,data) => this.handleOnChange(e,data,"startDate" )} value={this.state.reportReq.startDate} required/>
                                    </div>
                                </div>
                                
                            </Col>
                        </Row>
                        <Row style={this.state.reportReq.type === 1?{display:"block"}:{display:"none"}}>
                            <Col className="same-row">
                                <div className="reportCol">
                                    <div className="name-wd2" style={{textAlign:"right", marginRight:10}}>
                                        End date<sup style={{ color: 'red' }}>*</sup>&nbsp;&nbsp;:
                                    </div >
                                    <div className="ui input" style={{width:"200px"}}>
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
