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

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let cdate = new Date();
let nxtmonth = cdate.getMonth()+1;
let yearNo = cdate.getFullYear();
if(nxtmonth === 12){
    nxtmonth = 0;
    yearNo += 1;
}
let nxtmonthName = months[nxtmonth];
let nextMonthWithYear = nxtmonthName+"-"+yearNo;
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
            selectedValue : 'ALL',
            selectedtypeValue : 'Status'
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
                        applications: response
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

        let type = this.state.reportReq.type
        let condition = type === 1 ? "PAID":type === 2 ? "UNPAId":type === 4 ? "STATUS":type === 5 ? "NEXT":"ALL"
        
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const marginLeft = 20;
        const marginLeft2 = 350;
        const basePosition = 130;
        const doc = new jsPDF(orientation, unit, size);
    
        let title = "Payement Scheduler";
        let applicationsEmiJsonArray = []
        let applicationsStatusArray = []
        let nextMonthDataArray = []
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
            case "STATUS": title = "Status Report";
            applicationsStatusArray = self.getStatusReportData();
                        break;
            case "NEXT": title = nextMonthWithYear+" Collection Data";
            nextMonthDataArray = self.getnextMonthData();
                        break;
        }

        console.log("---------------applicationsEmiJsonArray",applicationsEmiJsonArray)
        console.log("---------------applicationsStatusArray",applicationsStatusArray)
        console.log("---------------nextMonthDataArray",nextMonthDataArray)
        // return
        let flag = 0;
        let pageCount = 0;
       
        if( condition === "ALL" || condition === "UNPAId" || condition === "PAID"){
            let headers = [["SNo", "Month","Principal","Interest","Total EMI","Amount Paid","Balance EMI","Outstanding Amount","Penalty"]];
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
                doc.addImage(Logo, 'JPG', 450, 20, 100, 80);
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
            // console.log("------------------page no", doc.internal.getNumberOfPages())
            doc.save("EMI Schedular.pdf")
        }else if( condition === "STATUS" ){
            let headers = [["SNo","Application Id", "Name","Mortgage","Principal","Tenure(Months)","Interest(%)","Start Date","Status"]];
            let content = {
                startY: basePosition+30,
                head: headers,
                body: applicationsStatusArray,
                theme: 'grid',
                styles: {
                cellWidth:'wrap',
                halign: 'center',
                },
                margin: marginLeft
            };
            doc.setFontSize(20);
            doc.text(title, 235, 100);
            doc.autoTable(content);
            doc.save("Status Report.pdf")
        }else if( condition === "NEXT" ){
            let headers = [["SNo","Application Id", "Name","Mortgage","Principal","Tenure(Months)","Interest(%)","Start Date","EMI Amount"]];
            let content = {
                startY: basePosition+30,
                head: headers,
                body: nextMonthDataArray,
                theme: 'grid',
                styles: {
                cellWidth:'wrap',
                halign: 'center',
                },
                margin: marginLeft
            };
            doc.setFontSize(20);
            doc.text(title, 200, 100);
            doc.autoTable(content);
            doc.save(nextMonthWithYear+" Collection Data.pdf")
        }
    }

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
        let applicationsEmiJsonArray = []
        let applications = this.state.applications
        for(let i = 0 ; i < applications.length ; i++){
            totalEmiPaid = 0;
            console.log("============= in get paid emi",)
            let emidatas = applications[i].emiScheduler
            let startdate = this.state.reportReq.startDate
            let enddate = this.state.reportReq.endDate
            let data = []
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
            // console.log()
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

    getUnpaidEmiData = () => {
        let applicationsEmiJsonArray = []
        let applications = this.state.applications
        for(let i = 0 ; i < applications.length ; i++){
            totalEmiPaid = 0;
            let data = [];
            let count = 1;
            totalEmiPaid = 0;
            let totalDue =0 ;
            let flag = 0;
            console.log("============= in get unpaid emi")
            let emidatas = applications[i].emiScheduler ? applications[i].emiScheduler : applications[i].totalEmi
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

    getStatusReportData = () => {
        console.log("------State", this.state)
        let data = this.state.applications.map((el,i)=> {
            return [
                i+1,
                el.id, 
                el.user.fname+" "+el.user.lname,
                el.expLoans.propertyType,
                el.expLoans.principle,
                el.expLoans.tenure,
                el.expLoans.intrest,
                el.expLoans.startDate,
                el.status
            ]

        });
        return data
        
    }

    getnextMonthData = () => {
        let applications = this.state.applications
        let totalEmi = 0;
        let data = []
        let count  = 1;
        console.log("============= in getnextMonthData")
        for(let i = 0 ; i < applications.length ; i++){
            
            let emidatas = applications[i].emiScheduler ? applications[i].emiScheduler : applications[i].totalEmi
            emidatas.map((el,j)=> {
                let cdate = new Date();
                let nxtmonth = cdate.getMonth()+2;
                let yr = cdate.getFullYear();
                if(nxtmonth === 13){
                    nxtmonth = 1;
                    yr += 1;
                }
                nxtmonth = nxtmonth<10?"0"+nxtmonth:nxtmonth
                
                let nxtmon = nxtmonth+"-"+yr;
                let date = el.month.slice(3);
                // console.log("-----------------checking for",date, nxtmon)
                if( date == nxtmon){
                    // console.log("--------------------nxt month",date, nxtmon)
                    totalEmi += el.emi!== undefined?parseInt(el.emi):parseInt(0);
                    data.push([
                        count,
                        applications[i].id, 
                        applications[i].user.fname+" "+applications[i].user.lname,
                        applications[i].expLoans.propertyType,
                        applications[i].expLoans.principle,
                        applications[i].expLoans.tenure,
                        applications[i].expLoans.intrest,
                        applications[i].expLoans.startDate,
                        el.emi
                    ])
                    count++;
                    return
                }
            });
        }
        if(data.length>0){
            data.push([
                "",
                "Total",
                "",
                "",
                "",
                "",
                "",
                "",
                totalEmi
            ])
        } 
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
    handleTypeChange = event => {
        this.setState({
            selectedtypeValue : event.target.value
        })
    };
   
    render() {
        
        const stateOptions = [
            { key: "1", text: "Paid EMI", value: 1},
            { key: "2", text: "Unpaid EMI", value: 2},
            { key: "3", text: "All EMI", value: 3},
            { key: "4", text: "Status Report", value: 4},
            { key: "5", text: "Next Month Collection Data", value: 5}
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
                        <Nav.Item>
                            <Nav.Link href='/usermanagement'>User Managament</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Navbar.Collapse id="basic-navbar-nav" className="left-spacing"  >
                        <Nav className="ml-auto">
                            {/* <Nav.Link href="#link">Services</Nav.Link>
                            <Nav.Link href="#link">Contact</Nav.Link> */}
                        
                        {/* <div> */}
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
                        {/* </div> */}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {this.props.children}
                    <Modal open={this.state.showModal} style={{height:"auto",minHeight:300,width:'40%',
    marginLeft: '30%', marginTop:'10%',borderradius:'15px',overflow:'visible'}} closeIcon onClose={this.onCloseClick}>
                        <Modal.Header style={{textAlign: 'center'}}>Generate Report</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
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
                                        <input type="number" name="reqno" placeholder="Request No." required onChange={(e,data) => this.handleOnChange(e,data,"req" )} value={this.state.reportReq.reqId} required/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
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
                        <Row >
                            <Button style={{ width: '130px', color: "white", backgroundColor: 'green', marginTop:"35px",marginLeft:'auto', marginRight:'auto',padding: '8px 10px' }}onClick={this.onSubmitClick}>Generate Report</Button>
                        </Row>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
            </div>
        )
    }
}
