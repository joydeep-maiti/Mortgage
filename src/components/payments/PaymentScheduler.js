import React, { Component } from 'react'
import { Paper } from '@material-ui/core'
import axios from 'axios'
import { Data } from '../../config'

import { Icon, Dropdown, Table, Modal, Button, Pagination } from 'semantic-ui-react'
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Form, FormControl } from 'react-bootstrap'
import './style.css'
import ReactDOM from 'react-dom';
// import { PDFViewer } from '@react-pdf/renderer';
// import ReactPDF from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

class PaymentScheduler extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            emi: undefined,
            tenure: undefined,
            search: '',
            interest: '',
            open: false,
            currentData: [],
            paid: false,
            indexValue: 0,
            paidEmi: 0,
            activePage: 1,
            rows: 10,
            currentDate: 0

        }
    }

    searchKey = (e) => {
        console.log("hello", e.target.value)
        let val = e.target.value
        this.setState({
            search: val
        })

    }
    // async donloadPDF() {
    //    // ReactDOM.render(<App />, document.getElementById('root'));
    //     ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
    // }
    close = () => this.setState({ open: false })
    show = (data, i) => {
        console.log(i, "main value----------------===================")
        this.setState({
            open: true,
            currentData: { ...data, paidEmi: this.state.emi },

        })
        if (this.state.activePage === 2) {
            i = i + 10;
            this.setState({
                indexValue: i
            })
        }
        else {
            let temp = Number((this.state.activePage - 1) + '0');
            i = i + temp
            this.setState({
                indexValue: i
            })
            console.log(i)
        }

    }
    handlePaginationChange = (e, { activePage }) => {
        console.log(activePage, this.state.activePage, "gggg")
        this.setState({ activePage }, () => console.log(activePage, this.state.activePage, "rrrrr"))

        let trimStart = (activePage - 1) * this.state.rows;
        let trimEnd = trimStart + this.state.rows;

        let trim = this.state.user
        console.log(this.state.user, "new update")
        console.log("hhhh")
        let trimedData = trim.emiScheduler !== undefined ? (trim.emiScheduler.slice(trimStart, trimEnd) ? trim.emiScheduler.slice(trimStart, trimEnd) : '') : trim.totalEmi.slice(trimStart, trimEnd)
        console.log(trimedData, "data")
        this.setState({
            trimedData
        })

    }
    handleKeyPress = (event) => {
        console.log("hello", event)
        // console.log("hello")
        if (event.key == 'Enter') {
            console.log("----------")
            this.fetchData();
        }
    }
    handleOnChange = (e) => {
        let ctDate = e.target.value.split('-');
        let ctDay = Number(ctDate[2]);
        let ctMon = Number(ctDate[1]);
        let ctYr = Number(ctDate[0]);

        let ctMonth = ctDay + '-' + ctMon + '-' + ctYr;
        console.log(ctMonth, "ct month.......")

        let currentData = { ...this.state.currentData, ctDate: ctMonth }
        this.setState({
            currentData: currentData
        }, () => console.log(this.state.currentData, "date..???????????"))
    }
    handleOnChangeEmi = (e) => {
        let currentData = { ...this.state.currentData, paidEmi: e.target.value }
        this.setState({
            currentData: currentData
        }, () => console.log(this.state.currentData, "date..???????????"))

    }
    paymentDone = async () => {
        const id = this.state.user.id;
        let property = [];
        let user = {}
        let newData = [];
        let currentUser = this.state.user
        console.log(this.state.user, "user data current")
        let i = this.state.indexValue
        // if (this.state.activePage === 2) {
        //     i = i + 10;
        //     this.setState({
        //         indexValue: i
        //     })
        // }
        // else {
        //     let temp = Number((this.state.activePage - 1) + '0');
        //     i = i + temp
        //     this.setState({
        //         indexValue: i
        //     })
        //     console.log(i)
        // }


        if (this.state.user.emiScheduler == undefined) {
            console.log("helooo")
            property = this.state.user.totalEmi;
            property[i]["paymentMode"] = this.state.currentData.paymentType;
            property[i]["ctDate"] = this.state.currentData.ctDate;
            property[i]["paidEmi"] = this.state.currentData.paidEmi;
            let balEmi = this.state.emi - this.state.currentData.paidEmi
            property[i]["balEmi"] = balEmi;
            // let user = { ...this.state.user, emiScheduler: property }
            user = { ...this.state.user, emiScheduler: property }
            this.setState({
                open: false,

            }, () => (console.log(user, "ssssss")))

        }
        else {
            property = this.state.user.emiScheduler;

            console.log("helooo1234")
            console.log(i, "current value of i")
            property[i]["paymentMode"] = this.state.currentData.paymentType;
            property[i]["ctDate"] = this.state.currentData.ctDate;
            property[i]["paidEmi"] = this.state.currentData.paidEmi;
            let balEmi = this.state.emi - this.state.currentData.paidEmi
            property[i]["balEmi"] = balEmi;
            console.log(property, "property all ----------------------")
            user = { ...this.state.user, emiScheduler: property }
            this.setState({
                open: false,

            }, (console.log(user, "pppppp")))
        }
        console.log(property, "emi scheduler getting or not ")
        if ((user.emiScheduler && user.emiScheduler[i].balEmi !== 0)) {
            console.log("inside")
            let a = 0.05;
            let b = user.emiScheduler[i].balEmi * a;
            let penality = user.emiScheduler[i].balEmi + b;
            user.emiScheduler[i].unpaidPen = penality;
            newData = user.emiScheduler[i];
            // console.log(newData, "unpaid penality", user.emiScheduler[i].unpaidPen, "oooo")
            // console.log(user.emiScheduler[i].unpaidPen, "qqqqqqqqqq----", user.emiScheduler[i - 1].unpaidPen, "wwwwwwwww-------")
            let unPaidValue = user.emiScheduler[i].unpaidPen ? i > 0 ? user.emiScheduler[i].unpaidPen + (user.emiScheduler[i - 1].unpaidPen ? user.emiScheduler[i - 1].unpaidPen : 0) : user.emiScheduler[i].unpaidPen : penality
            console.log(unPaidValue, "valye----------------", penality)
            user.emiScheduler[i].unpaidPen = newData["unpaidPen"] = unPaidValue;
            // console.log(newData, "------ penality", user.emiScheduler[i].unpaidPen, "oooo---------")
            if (user.emiScheduler[i].paidEmi >= user.emiScheduler[i].emi) {
                console.log("inside i am coming......")
                let sub = user.emiScheduler[i].paidEmi - user.emiScheduler[i].emi;
                newData["unpaidPen"] = newData["unpaidPen"] - sub;
                user.emiScheduler[i] = newData;
                // this.setState({
                //     user: userData
                // })
                console.log(user, "whole value........")
            }
        }

        else {
            console.log("hello outside.........")
        }

        const res = await axios.put(`${Data.url}/users/${id}`, user)
            .then(res => {
                console.log(res.data, "patched")
                let active = {
                    activePage: this.state.activePage
                }
                this.setState({
                    user: res.data
                })
                this.handlePaginationChange(null, active)

            })
            .catch(e => {
                // throw new Error(e.response);
                window.alert("error occurred")
            });
        return res;



    }
    paymentMode = (e, { value }) => {
        let currentData = { ...this.state.currentData, paymentType: value }
        this.setState({
            currentData: currentData
        }, () => {
            console.log("adding data", this.state.currentData)

        })
    }
    // componentDidUpdate() {
    //     let id = localStorage.getItem('reqId')
    //     const res = axios.get(`${Data.url}/users/${id}`)
    //         .then(res => {
    //             console.log(res.data, "getting data......")
    //         }).catch(e => {
    //             throw new Error(e.response.data);
    //         });
    //     return res;
    // }
    printDocument() {
        const input = document.getElementById('divToPrint');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 0, 0);
                // pdf.output('dataurlnewwindow');
                pdf.save(this.state.user.id + ".pdf");
            })
            ;
    }
    exportToCSV = () => {
        console.log("============================state", this.state);
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        // const csvData = this.state.trimedData;
        const csvData = this.state.user.totalEmi;
        const fileName = this.state.user.id;
        const formattedData = this.formatDataForExport(csvData);
        console.log("------------------------formattedData", formattedData);
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    formatDataForExport = (data) => {
        let formattedData = [];
        data!==undefined ? data.map((el, i)=> {
            let obj = {
                "Month": el.month!== undefined?el.month:"Nil",
                "Principal": el.principal!== undefined?el.principal:"Nil",
                "Interest": el.interest!== undefined?el.interest:"Nil",
                "Total EMI": el.emi!== undefined?el.emi:"Nil",
                "Amount Paid":el.paidEmi!== undefined?el.paidEmi:"Nil",
                "Balance EMI":el.balEmi !== undefined?el.balEmi:"Nil",
                "Outstanding Amount": el.outstandingBal?el.outstandingBal:0,
                "Penalty":el.unpaidPen !== undefined?el.unpaidPen:"Nil"
            }
            console.log("-----------------OBJ", obj);
            formattedData.push(obj);
        }): formattedData = [];
        return formattedData;
    }

    async fetchData(e) {

        if (this.state.search !== '') {

            if (this.state.user !== undefined) {
                console.log("inside fetch method")
                let id = `Req${('000000' + this.state.search).slice(-5)}`;
                localStorage.setItem('reqId', id)
                const res = await axios.get(`${Data.url}/users/${id}`)
                    .then(res => {
                        debugger
                        console.log(res.data, "data")
                        this.setState({
                            user: res.data
                        }, () => {
                            console.log(res.data, "all dattaaaaa")
                        })
                        let cal = (res.data.expLoans.principle);
                        console.log(cal, "----------------------")
                        let tenure = Number(res.data.expLoans.tenure);
                        console.log(tenure, "----------------------")
                        let interest = Number(res.data.expLoans.intrest);
                        console.log(typeof interest, "----------------------")
                        let intr = Number(interest / (12 * 100))
                        let r = 1 + intr;
                        let e = Math.pow(r, tenure)
                        let finalEmi = e / (e - 1)
                        let emi = Math.round(cal * intr * finalEmi)
                        this.setState({
                            emi: emi,
                            tenure: tenure,
                            interest: intr

                        })
                        let emiScheduler = [];
                        let date = this.state.user.expLoans.startDate.split('-');
                        let day = Number(date[2]);
                        let j = 0;
                        let outstandingBal = 0;
                        let yr = Number(date[0]);
                        let mon = 0;
                        if (cal) {
                            for (var i = 0; i < tenure; i++) {
                                let row = {
                                    month: '',
                                    interest: '',
                                    principal: '',
                                    outstandingBal: '',
                                    emi: ''
                                }
                                if (i === 0) {
                                    mon = Number(date[1]);
                                    outstandingBal = cal
                                    console.log(outstandingBal, "iiiiii")
                                }
                                else {
                                    mon = mon + 1;
                                }
                                row.month = day + '-' + mon + '-' + yr;
                                row.emi = emi;
                                let a = (intr * outstandingBal);
                                let b = emi - a;
                                row.interest = Math.round(a);
                                row.principal = Math.round(b);
                                outstandingBal = outstandingBal - (emi - Math.floor(a));
                                outstandingBal = Math.round(outstandingBal);
                                console.log(outstandingBal, "before 0")
                                outstandingBal = (outstandingBal < 0) ? 0 : outstandingBal;
                                row.outstandingBal = outstandingBal;
                                // console.log('int:' + Math.round(a), 'prin:' + b, 'outstanding bal: ' + outstandingBal, 'emi : ', a + b, "-----")
                                console.log('EMI :', emi, 'INT:', Math.round(a), 'Prin:', (emi - a), (emi - Math.floor(a)), 'Balance:', outstandingBal);
                                if (mon >= 12) {
                                    mon = 0;
                                    yr = yr + 1
                                }
                                emiScheduler.push(row);
                                j++;
                            }
                        }
                        const emivalue = [...emiScheduler]
                        this.setState({
                            user: { ...this.state.user, totalEmi: emivalue, },
                        })
                        this.search.value = "";
                        let active = {
                            activePage: this.state.activePage
                        }
                        this.handlePaginationChange(null, active)
                    })
                    .catch(e => {
                        window.alert("Invalid request number")
                        this.search.value = "";
                        // throw new Error(e.response.data);
                    });

                return res;
            }
            else {
                this.setState({
                    user: this.state.user
                })
            }
        }
        else {
            window.alert("Please Enter Request ID")
        }
    }
    componentDidMount() {
        let d = new Date();
        let month = ("00" + (d.getMonth() + 1)).slice(-2)
        console.log("month", month)
        let day = ("00" + (d.getDate())).slice(-2);
        let yr = d.getFullYear()
        let currentDate = yr + '-' + month + '-' + day
        console.log(currentDate, "uuuu")
        this.setState({
            currentDate: currentDate
        })
    }


    render() {
        // const styles = StyleSheet.create({
        //     page: {
        //         flexDirection: 'row',
        //         backgroundColor: '#E4E4E4'
        //     },
        //     section: {
        //         margin: 10,
        //         padding: 10,
        //         flexGrow: 1
        //     }
        // });

        // // Create Document Component
        // const MyDocument = () => (
        //     <Document>
        //         <Page size="A4" style={styles.page}>
        //             <View style={styles.section}>
        //                 <Text>Section #1</Text>
        //             </View>
        //             <View style={styles.section}>
        //                 <Text>Section #2</Text>
        //             </View>
        //         </Page>
        //     </Document>
        // );
        // const App = () => (
        //     <PDFViewer>
        //         <MyDocument />
        //     </PDFViewer>
        // );


        const { open, activePage } = this.state;
        console.log("index value", this.state.indexValue)
        const payment = [
            {
                key: 'cash',
                text: 'cash',
                value: 'cash'
            },
            {
                key: 'cheque',
                text: 'cheque',
                value: 'cheque'
            },
            {
                key: 'NFFT',
                text: 'NFFT',
                value: 'NFFT'
            },
            {
                key: 'IMPS',
                text: 'IMPS',
                value: 'IMPS'
            },
        ]
        let modal = (
            <div>
                <Modal size='large' open={open} onClose={this.close} closeOnDimmerClick={false} className="modalEdit" style={{ marginTop: '150px', marginLeft: '10%' }} closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}>
                    <Modal.Header>Payment details</Modal.Header>
                    <Modal.Content>
                        <Table striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell> EMI Due Date</Table.HeaderCell>
                                    <Table.HeaderCell>EMI Amount</Table.HeaderCell>
                                    <Table.HeaderCell>Penality</Table.HeaderCell>
                                    <Table.HeaderCell>Payment Date</Table.HeaderCell>
                                    <Table.HeaderCell>EMI+Penality</Table.HeaderCell>
                                    <Table.HeaderCell>Payment Mode</Table.HeaderCell>

                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row >

                                    <Table.Cell>{this.state.currentData.month}</Table.Cell>
                                    <Table.Cell>{this.state.currentData.emi}</Table.Cell>
                                    {
                                        <Table.Cell>{this.state.user.emiScheduler ? this.state.indexValue > 0 ? (this.state.user.emiScheduler[this.state.indexValue - 1].unpaidPen ? this.state.user.emiScheduler[this.state.indexValue - 1].unpaidPen : 0) : this.state.user.emiScheduler[this.state.indexValue].unpaidPen : 'Nil'}</Table.Cell>
                                    }


                                    <Table.Cell>
                                        <input type="date"
                                            name="Date" onChange={(e) => this.handleOnChange(e)}
                                            placeholder="Payment Date"
                                            min={this.state.currentDate}
                                            defaultValue={this.state.currentData.ctDate} />

                                    </Table.Cell>
                                    <Table.Cell>
                                        <input type="number"
                                            name="paidAmt" onChange={(e) => this.handleOnChangeEmi(e)}
                                            placeholder="paid amount"
                                            defaultValue={this.state.user.emiScheduler ? (this.state.indexValue > 0
                                                ? (this.state.user.emiScheduler[this.state.indexValue - 1].unpaidPen ? this.state.user.emiScheduler[this.state.indexValue - 1].unpaidPen : 0) + this.state.currentData.paidEmi :
                                                this.state.currentData.paidEmi) :
                                                this.state.currentData.paidEmi} />

                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            onChange={this.paymentMode}
                                            options={payment}
                                            placeholder='select'
                                            selection={true}
                                            defaultValue={this.state.currentData.paymentType}
                                            />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => this.paymentDone()} style={{ marginRight: '230px', width: '120px', color: "white", backgroundColor: 'green' }}>Done</Button>

                    </Modal.Actions>
                </Modal>
            </div>
        )
        return (
            <div id="divToPrint" className="head-m" style={{ backgroundColor: '#f5f6fa', paddingBottom: '45px', marginTop: '0px' }}>
                <div style={{ display: 'flex' }}>
                    <h2 className="heading-m">
                        Payment Scheduler
                     </h2>
                    <div inline style={{ marginLeft: '200px', display: 'flex', marginTop: '10px' }} >
                        <FormControl type="text" placeholder="Request Number...." className="mr-sm-2"
                            ref={el => this.search = el}
                            onChange={(e) => this.searchKey(e)} defaultValue={this.state.search} style={{ marginLeft: '187px', paddingRight: '35px' }} onKeyPress={this.handleKeyPress} />
                        <Icon size="large" inverted name='search' style={{ marginTop: '7px' }} className="searchIcon" color='black' link onClick={() => this.fetchData()} />
                    </div>
                </div>

                <Paper style={{ marginRight: '0px', padding: '15px', width: '97%', height: "fit-content", marginBottom: '10px', marginLeft: '18px', marginTop: '25px' }}>
                    <div className="align">
                        <h3>Payement Scheduler</h3>
                        {
                            this.state.user.expLoans &&
                            <p>
                                Principal amount: £{this.state.user.expLoans.principle}, Tenure: {this.state.user.expLoans.tenure} months and interest:{this.state.user.expLoans.intrest}%

                                    <Button style={{ float: 'right', marginBottom: '10px', backgroundColor: 'green', borderColor: 'green' }} onClick={() => { this.printDocument() } }>Download </Button>
                                    <Button style={{ float: 'right', marginBottom: '10px', backgroundColor: 'green', borderColor: 'green' }} onClick={() => { this.exportToCSV() } }>Download As excel </Button>
                            </p>

                        }

                    </div>

                    <Table >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>SNo</Table.HeaderCell>
                                <Table.HeaderCell>Month</Table.HeaderCell>
                                <Table.HeaderCell>Principal</Table.HeaderCell>
                                <Table.HeaderCell>Interest</Table.HeaderCell>
                                <Table.HeaderCell>TotalEmi</Table.HeaderCell>
                                <Table.HeaderCell>Amount Paid</Table.HeaderCell>
                                <Table.HeaderCell>BalanceEMI</Table.HeaderCell>
                                <Table.HeaderCell>OutstandingAmount</Table.HeaderCell>
                                <Table.HeaderCell>Penality</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body className="tableHover">
                            {console.log(this.state.trimedData, "trimed data what")}
                            {
                                this.state.trimedData && this.state.trimedData.map((data, i) => {
                                    return <Table.Row className={this.state.trimedData && this.state.trimedData[i].paymentMode !== undefined ? "tableSelected" : ""} key={i}
                                        style={{
                                            cursor: 'pointer',
                                            textDecoration: 'none'
                                        }} onClick={() => this.show(data, i)}
                                        disabled={this.state.trimedData && this.state.trimedData[i].paymentMode !== undefined ? true : false} >
                                        <Table.Cell>{i + 1}</Table.Cell>

                                        <Table.Cell >{data.month}</Table.Cell>
                                        <Table.Cell>{data.principal}</Table.Cell>
                                        <Table.Cell>{data.interest}</Table.Cell>
                                        <Table.Cell>{data.emi}</Table.Cell>
                                        <Table.Cell>{data.paidEmi !== undefined ? data.paidEmi : 'Nil'}</Table.Cell>
                                        <Table.Cell>{data.balEmi !== undefined ? data.balEmi : 'Nil'}</Table.Cell>
                                        <Table.Cell>{data.outstandingBal}</Table.Cell>
                                        <Table.Cell>{data.unpaidPen !== undefined ? data.unpaidPen : 'Nil'}</Table.Cell>
                                    </Table.Row>
                                })
                            }


                        </Table.Body>

                    </Table>
                    {modal}
                    {
                        this.state.trimedData && <Pagination style={{ float: "right", marginTop: '20px' }}
                            totalPages={Math.ceil(this.state.user.totalEmi.length / 10)}
                            activePage={activePage}
                            onPageChange={this.handlePaginationChange}
                            />
                    }

                </Paper>
            </div >

        )
    }

}

export default PaymentScheduler;