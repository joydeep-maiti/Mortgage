import React from 'react';
import { withRouter } from 'react-router'
import axios from 'axios'
import { Accordion, Icon, Dropdown, Table, Radio, Select, Modal } from 'semantic-ui-react'
import { Paper } from '@material-ui/core'
import { Row, Col, Form, FormControl, Button } from 'react-bootstrap'
import './style.css';
import { Data } from '../../config'
import download from 'downloadjs';


class Mortgage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifLiability: false,
            enableBtn: false,
            tabOpen: false,
            radio: '',
            finIndex: 0,
            tab: false,
            activeIndex: 0,
            sameAddr: false,
            user: {},
            reqId: '',
            address: {
                currentAddress: {},
                permanentAddress: {}
            },
            annualIncome: '',
            liability: {},
            expLoan: {},
            financial: [],
            property: {},
            upload: {},
            open: false,
            totalProperty: [],
            status: 'Pending',
            search: '',
            totalUser: 0,
            errorMsg: '',
            errorBorder: '',
            update: true,
            propertyRate:null,
            activeAllIndex : false

        }

    }

    componentWillMount = () => {
        console.log("------------Mortgage Props", this.props);
        
        axios.get(`${Data.url}/property/1`)
        .then(res => {
            console.log("gettingInterestConfig data", res);
            this.setState({
                propertyRate: res.data
            })

        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
        let searchID = ""
        if(this.props.location.search !== ""){
            let search = this.props.location.search.slice(1);
            let paramArr = search.split('&')[0].split('=')
            
            if(paramArr[0] == 'id'){
                searchID = paramArr[1]
            }
            console.log("-----------searchID",searchID)
            this.fetchKey(searchID)
        }
        
    }

    handleKeyPress = (event) => {
        console.log("---------------In Key press", event)
        if (event.key == 'Enter') {
            event.preventDefault();
            console.log("----------")
            this.fetchKey();
        }
    }

    handleProperty = (e, { value }) => {
        // debugger
        console.log(value);
        let propertyType = { ...this.state.property, propertyType: value }
        console.log(propertyType)
        this.setState({ property: propertyType }, () => {
            console.log(this.state.property)
        })
    }

    handleAssetVAlue = (e) => {
        let value = e.target.value;
        this.setState({
            property: { ...this.state.property, assestValue: value }
        })
    }
    show = () => {
        const { property } = this.state;
        if ((property.propertyType !== undefined && property.propertyType !== '') && (property.assestValue !== undefined && property.assestValue !== '')) {
            this.setState({ open: true, errorMsg: '', activeIndex: this.state.finIndex })
        }
        else {
            let msg = "Please enter mantatory(*) fields"
            this.setState({
                errorMsg: msg,
                //  errorBorder: 'rgb(247, 12, 12)'
            })
        }


    }
    close = () => this.setState({ open: false })
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex, user, annualIncome, financial, ifLiability, property, expLoan } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({
            finIndex: newIndex
        })
        if (index === 0) {
            this.setState({ activeIndex: newIndex })
        }
        else if (index === 1) {
            console.log("hello", index)
            if ((user.fname !== undefined && user.fname !== '') && (user.lname !== undefined && user.lname !== '')
                && (user.mobileNo !== undefined && user.mobileNo !== '') && (user.AadharNo !== undefined && user.AadharNo !== '')
                && (user.emailId !== undefined && user.emailId !== '') && (user.gender !== undefined && user.gener !== '')
                && (user.age !== undefined && user.age !== '')) {
                this.setState({
                    activeIndex: newIndex,
                    errorMsg: ''
                })
            }
            else {
                let msg = "Please enter mantatory(*) fields"
                this.setState({
                    errorMsg: msg,
                    //  errorBorder: 'rgb(247, 12, 12)'
                })
            }
        }
        else if (index === 2) {
            if ((user.Address.currentAddress.line1 !== undefined && user.Address.currentAddress.line1 !== '') && (user.Address.currentAddress.city !== undefined && user.Address.currentAddress.city !== '')
                && (user.Address.currentAddress.state !== undefined && user.Address.currentAddress.state !== '') && (user.Address.currentAddress.country !== undefined && user.Address.currentAddress.country !== '')) {

                this.setState({ activeIndex: newIndex })
            }
            else {

                let msg = "Please enter mantatory(*) fields"
                this.setState({
                    errorMsg: msg,
                    //  errorBorder: 'rgb(247, 12, 12)'
                })

            }
        }
        else if (index === 3) {
            if (ifLiability === false) {
                console.log('index 3-------')
                if (annualIncome !== undefined && annualIncome !== '') {
                    this.setState({ activeIndex: newIndex })
                }
                else {
                    let msg = "Please enter mantatory(*) fields"
                    this.setState({
                        errorMsg: msg,
                        //  errorBorder: 'rgb(247, 12, 12)'
                    })
                }
            }
            else {
                if ((annualIncome !== undefined && annualIncome !== '') && (financial[0].bankName !== undefined)
                    && (financial[0].liabilityType !== undefined) && (financial[0].AssetValue !== undefined && financial[0].AssetValue !== '')
                    && (financial[0].AssetTenure !== undefined && financial[0].AssetTenure !== '')) {
                    this.setState({ activeIndex: newIndex })
                }
                else {
                    let msg = "Please enter mantatory(*) fields"
                    this.setState({
                        errorMsg: msg,
                        //  errorBorder: 'rgb(247, 12, 12)'
                    })
                }
            }
        }

        else if (index === 4) {
            if (((property.propertyType !== undefined && property.propertyType !== '') && (property.assestValue !== undefined && property.assestValue !== '')) || this.state.totalProperty.length !== 0) {
                this.setState({ activeIndex: newIndex, enableBtn: !this.state.enableBtn })
            }
            else {
                let msg = "Please enter mantatory(*) fields"
                this.setState({
                    errorMsg: msg,
                    enableBtn: false
                    //  errorBorder: 'rgb(247, 12, 12)'
                })
            }
        }
        else if (newIndex === 5) {
            if (expLoan.principle !== undefined && expLoan.principle !== '') {
                this.setState({ activeIndex: newIndex })
            }
            else {
                console.log("hello inside 3")
                let msg = "Please enter mantatory(*) fields"
                this.setState({
                    errorMsg: msg,
                    enableBtn: false
                    //  errorBorder: 'rgb(247, 12, 12)'
                })
            }
        }
    }
    async download(reqId, fileName) {
        // debugger
        const res = await fetch(`${Data.url}/download?reqid=${reqId}&fileName=${fileName}`);
        const blob = await res.blob();
        download(blob, fileName);

    }

    handleCheckBox() {
        let sameAddr = this.state.user.Address;

        console.log("---->", sameAddr)
        this.setState({
            sameAddr: !this.state.sameAddr
        }
        )

    }
    handleOnChange(e) {
        // debugger
        let user = this.state.user;
        user[e.target.name] = e.target.value
        this.setState({
            user: user,

        })
    }
    handleStartDate(e) {
        let expLoan = { ...this.state.expLoan };
        expLoan["startDate"] = e.target.value;
        this.setState({
            expLoan: expLoan
        }, () => console.log(this.state.expLoan, "kkkkkkk"))
    }
    searchKey = (e) => {
        console.log("hello", e.target.value)
        let val = e.target.value
        this.setState({
            search: val
        })

    }
    async deleteFile(index, itemAttributes) {
        // debugger
        this.setState({
            totalProperty: [
                ...this.state.totalProperty.slice(0, index),
                Object.assign({}, this.state.totalProperty[index], itemAttributes),
                ...this.state.totalProperty.slice(index + 1)
            ]
        });


        let p = this.state.totalProperty;
    }

    fetchKey = (reqid)=> {
        if (this.state.search !== '' || reqid !=='' || reqid != undefined) {

            // if (this.state.user !== undefined) {
                let id = ""
                if(reqid){
                    id = reqid
                }else{
                    id = `Req${('000000' + this.state.search).slice(-5)}`;
                }
                localStorage.setItem('req', id)
                axios.get(`${Data.url}/users/${id}`)
                    .then(res => {
                        console.log("Application res data",res.data );
                        let address = res.data.user.Address;
                        localStorage.setItem("ReqId", res.data.id);
                        //let resfile1 = new File(res.data.totalProperty[0].file1)
                        //res.data.totalProperty[0].file1 = resfile1;
                        this.setState({

                            user: res.data.user,
                            financial: res.data.financial,
                            expLoan: res.data.expLoans,
                            // property: res.data.totalProperty[0],
                            totalProperty: res.data.totalProperty,
                            status: res.data.status,
                            annualIncome: res.data.annualIncome,
                            reqId: res.data.id,
                            update: false,
                            tab: true,
                            address: address,
                            activeAllIndex : true
                        }, () => {
                            console.log(this.state, "all dattaaaaa")
                        })

                        // this.setState({
                        //     user: { ...this.state.user, address: address }
                        // }, () => {
                        //     console.log(this.state, "all dattaaaaa")
                        // })

                    }).catch(e => {
                        window.alert("Invalid request number")
                        //this.search.value = "";
                        // throw new Error(e.response.data);
                    });
            // }
        }
    }


    async handleProceed(reqID) {

        // debugger;
        const { financial, user, expLoan, totalProperty, annualIncome, radio, status } = this.state;
        if ((expLoan.principle !== undefined && expLoan.principle !== '') && (expLoan.tenure !== undefined && expLoan.tenure !== '')
            && (expLoan.propertyType !== undefined && expLoan.propertyType !== '') && (expLoan.startDate !== undefined && expLoan.startDate !== '')) {


            let expLoans = { ...expLoan, radio }
            let res;

            let cal = expLoan.principle;
            console.log(cal, "----------------------")
            let tenure = Number(expLoan.tenure);
            console.log(tenure, "----------------------")
            let interest = Number(expLoan.intrest);
            console.log(typeof interest, "----------------------")
            let intr = Number(interest / (12 * 100))
            let r = 1 + intr;
            let e = Math.pow(r, tenure)
            let finalEmi = e / (e - 1)
            let emi = Math.round(cal * intr * finalEmi)
            let emiScheduler = [];
            let date = expLoan.startDate.split('-');
            let day = date[2];
            let j = 0;
            let outstandingBal = 0;
            let yr = date[0];
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
                        mon = date[1];
                        outstandingBal = cal
                        console.log(outstandingBal, "iiiiii")
                    }
                    else {
                        mon = Number(mon) + 1;
                        mon = mon < 10 ? '0'+mon : mon
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
                        yr = Number(yr) + 1
                    }
                    emiScheduler.push(row);
                    j++;
                }
            }
            const emivalue = [...emiScheduler]
            console.log('-------Calculated EMIs:', emivalue);
            if (reqID && reqID != undefined) {
                let body = { user, annualIncome, financial, expLoans, totalProperty, status, totalEmi:emivalue }
                res = await axios.put(`${Data.url}/users/${reqID}`, body, )
                    .then(res => {
                        console.log(res.data, "data")
                        this.setState({
                            errorBorder: ''
                        })
                        return res.data

                    })
                    .catch(e => {
                        // throw new Error(e.response.data);
                        window.alert("data not getting")
                    });
            } else {
                this.setState({
                    status: 'Pending',
                }, () => console.log(this.state.status, "ttttt"))
                let tot = this.state.totalUser + 1
                let id = `Req${('000000' + tot).slice(-5)}`
                let storedID = localStorage.setItem("ReqId", id);
                let body = { user, annualIncome, financial, expLoans, totalProperty, id, status,totalEmi:emivalue }
                res = await axios.post(`${Data.url}/users/`, body, )
                    .then(res => {
                        console.log(res.data, "data")
                        this.setState({
                            errorBorder: ''
                        })
                        return res.data

                    })
                    .catch(e => {
                        // throw new Error(e.response.data);
                        window.alert("data not getting")
                    });
            }


            this.props.history.push('/preview')

            return res;
            this.setState({
                errorMsg: '',
                //  errorBorder: 'rgb(247, 12, 12)'
            })
        } else {
            let msg = "Please enter mantatory(*) fields"
            this.setState({
                errorMsg: msg,
                //  errorBorder: 'rgb(247, 12, 12)'
            })

        }


    }
    componentDidMount() {

        console.log(Data.url, "jjjjjx")
        const res = axios.get(`${Data.url}/users/`)
            .then(res => {
                console.log(res.data);
                this.setState({
                    totalUser: res.data.length
                })
                return res.data
            })
            .catch(e => {
                // throw new Error(e.response.data);
                window.alert("data not getting")
            });
        return res;
    }

    handleGender = (e, { value }) => {
        console.log(value);
        let details = { ...this.state.user, gender: value }
        console.log(details)
        this.setState({ user: details }, () => {

        })

    }
    propertySelect = (e, { value }) => {
        // debugger
        let interestRate;
        // debugger;

        switch (value.toUpperCase()) {
            case ('CAR'):
                interestRate = this.state.propertyRate.car;
                break;
            case ('GOLD'):
                interestRate = this.state.propertyRate.gold;
                break;
            case ('PROPERTY AGAINST'):
                interestRate = this.state.propertyRate.propertyAgainst;
                break;
            case ('OTHERS'):
                interestRate = this.state.propertyRate.other;
                break;
                defalult:
                interestRate = 10;
                break;


        }

        let expLoan = { ...this.state.expLoan }
        expLoan["propertyType"] = value;
        expLoan["intrest"] = interestRate;
        console.log(value);
        this.setState({
            expLoan: expLoan
        }, () => {
            console.log("propertyseledcted----------------------------", this.state.expLoan)
        })

    }
    handleOccup = (e, { value }) => {
        let details = { ...this.state.user, occupation: value }
        console.log(details)
        this.setState({ user: details }, () => {

        })

    }
    addAsset = async () => {
        var newFile1;
        var newFile2;
        var newFile3;
        let property = [];
        let id;
        let availableProperty;
        let newTotalProperty
        // debugger;
        let data = new FormData();
        this.setState({
            tab: true, open: false,
            property: { ...this.state.property }

        });

        if (this.state.totalProperty.length > 0) {
            property = this.state.totalProperty;
        }
        this.propValue.value = "";
        let tot = this.state.totalUser + 1;
        if (this.state.reqId) {
            id = this.state.reqId;
        } else {
            id = `Req${('000000' + tot).slice(-5)}`;
        }
        data.append('id', id)
        // if (this.state.reqId) {
            availableProperty = this.state.totalProperty.find((item, i) => {
                if (item.propertyType.toUpperCase() == this.state.property.propertyType.toUpperCase()) {
                    property[i] = this.state.property;
                    property[i].file1 = this.state.property.file1 ? this.state.property.file1 : item.file1;
                    property[i].file2 = this.state.property.file2 ? this.state.property.file2 : item.file2;
                    property[i].file3 = this.state.property.file3 ? this.state.property.file3 : item.file3;
                    let file1 = property[i].file1;
                    let file2 = property[i].file2;
                    let file3 = property[i].file3;
                    data.append('file1', file1)
                    data.append('file2', file2)
                    data.append('file3', file3)
                    newTotalProperty = property;
                    newTotalProperty[i].propertyType = property[i].propertyType;
                    newTotalProperty[i].assestValue = property[i].assestValue;
                    if (property[i].file1) {
                        newFile1 = {
                            'lastModified': property[i].file1.lastModified,
                            'lastModifiedDate': property[i].file1.lastModifiedDate,
                            'name': property[i].file1.name,
                            'size': property[i].file1.size,
                            'type': property[i].file1.type
                        };
                        newTotalProperty[i]["file1"] = newFile1;
                    }
                    if (property[i].file2) {
                        newFile2 = {
                            'lastModified': property[i].file2.lastModified,
                            'lastModifiedDate': property[i].file2.lastModifiedDate,
                            'name': property[i].file2.name,
                            'size': property[i].file2.size,
                            'type': property[i].file2.type
                        };
                        newTotalProperty[i]["file2"] = newFile2;
                    }
                    if (property[i].file3) {
                        newFile3 = {
                            'lastModified': property[i].file3.lastModified,
                            'lastModifiedDate': property[i].file3.lastModifiedDate,
                            'name': property[i].file3.name,
                            'size': property[i].file3.size,
                            'type': property[i].file3.type
                        };

                        newTotalProperty[i]["file3"] = newFile3;
                    }

                    return true;
                }
            });
            if (!availableProperty) {
                property.push({ ...this.state.property });
            }
        // } else {
        //     availableProperty = this.state.totalProperty.find((item, i) => {
        //         if (item.propertyType.toUpperCase() == this.state.property.propertyType.toUpperCase()) {
        //             property[i] = this.state.property;
        //             property[i].file1 = this.state.property.file1 ? this.state.property.file1 : item.file1;
        //             property[i].file2 = this.state.property.file2 ? this.state.property.file2 : item.file2;
        //             property[i].file3 = this.state.property.file3 ? this.state.property.file3 : item.file3;
        //             let file1 = property[i].file1;
        //             let file2 = property[i].file2;
        //             let file3 = property[i].file3;
        //             data.append('file1', file1)
        //             data.append('file2', file2)
        //             data.append('file3', file3)
        //             newTotalProperty = property;
        //             newTotalProperty[i].propertyType = property[i].propertyType;
        //             newTotalProperty[i].assestValue = property[i].assestValue;
        //             if (property[i].file1) {
        //                 newFile1 = {
        //                     'lastModified': property[i].file1.lastModified,
        //                     'lastModifiedDate': property[i].file1.lastModifiedDate,
        //                     'name': property[i].file1.name,
        //                     'size': property[i].file1.size,
        //                     'type': property[i].file1.type
        //                 };
        //                 newTotalProperty[i]["file1"] = newFile1;
        //             }
        //             if (property[i].file2) {
        //                 newFile2 = {
        //                     'lastModified': property[i].file2.lastModified,
        //                     'lastModifiedDate': property[i].file2.lastModifiedDate,
        //                     'name': property[i].file2.name,
        //                     'size': property[i].file2.size,
        //                     'type': property[i].file2.type
        //                 };
        //                 newTotalProperty[i]["file2"] = newFile2;
        //             }
        //             if (property[i].file3) {
        //                 newFile3 = {
        //                     'lastModified': property[i].file3.lastModified,
        //                     'lastModifiedDate': property[i].file3.lastModifiedDate,
        //                     'name': property[i].file3.name,
        //                     'size': property[i].file3.size,
        //                     'type': property[i].file3.type
        //                 };

        //                 newTotalProperty[i]["file3"] = newFile3;
        //             }

        //             return true;
        //         }
        //     });
        //     if (!availableProperty) {
        //         property.push({ ...this.state.property });
        //     }
        // }


        if (!availableProperty) {
            let l = property.length;
            let file1 = property[l - 1].file1;
            let file2 = property[l - 1].file2;
            let file3 = property[l - 1].file3;

            data.append('file1', file1)
            data.append('file2', file2)
            data.append('file3', file3)
            console.log(data, "......uplaod datass");
            newTotalProperty = property;
            newTotalProperty[l - 1].propertyType = property[l - 1].propertyType;
            newTotalProperty[l - 1].assestValue = property[l - 1].assestValue;
            if (property[l - 1].file1) {
                newFile1 = {
                    'lastModified': property[l - 1].file1.lastModified,
                    'lastModifiedDate': property[l - 1].file1.lastModifiedDate,
                    'name': property[l - 1].file1.name,
                    'size': property[l - 1].file1.size,
                    'type': property[l - 1].file1.type
                };
                newTotalProperty[l - 1]["file1"] = newFile1;
            }
            if (property[l - 1].file2) {
                newFile2 = {
                    'lastModified': property[l - 1].file2.lastModified,
                    'lastModifiedDate': property[l - 1].file2.lastModifiedDate,
                    'name': property[l - 1].file2.name,
                    'size': property[l - 1].file2.size,
                    'type': property[l - 1].file2.type
                };
                newTotalProperty[l - 1]["file2"] = newFile2;
            }
            if (property[l - 1].file3) {
                newFile3 = {
                    'lastModified': property[l - 1].file3.lastModified,
                    'lastModifiedDate': property[l - 1].file3.lastModifiedDate,
                    'name': property[l - 1].file3.name,
                    'size': property[l - 1].file3.size,
                    'type': property[l - 1].file3.type
                };

                newTotalProperty[l - 1]["file3"] = newFile3;
            }

        }
        this.setState({
            totalProperty: newTotalProperty
        }, () => {
            console.log("icon clicked", this.state.totalProperty);
        })
        const res = await axios.post(`${Data.url}/upload`, data)
            .then(res => {
                console.log(res.data, "hello")
                this.setState({

                })

            })
            .catch(e => {
                console.log(e)
                window.alert("data not send")
            })
        return res;
    }


    handleLiability = (e) => {
        this.setState({
            ifLiability: !this.state.ifLiability
        })
    }

    handleRadio = (e, { value }) => {
        this.setState({
            value,
            radio: value
        })
    }
    handleCtAddress = (e) => {

        let addr = { ...this.state.address.currentAddress };
        console.log('Address : ', addr);
        addr[e.target.name] = e.target.value;

        console.log('Address2 : ', addr)
        this.setState({
            address: { ...this.state.address, currentAddress: addr },
            user: { ...this.state.user, Address: { ...this.state.address, currentAddress: addr } }

        }, console.log('---', this.state.address, ">>>>>>>>", this.state.user))
    }
    handlePtAddress = (e) => {

        let addr = { ...this.state.address.permanentAddress };
        addr[e.target.name] = e.target.value;
        this.setState({
            address: { ...this.state.address, permanentAddress: addr },
            user: { ...this.state.user, Address: { ...this.state.address, permanentAddress: addr } }

        }, console.log('---', this.state.address, ">>>>>>>>", this.state.user))



    }
    handleIncome = (e) => {
        this.setState({
            annualIncome: e.target.value
        })
        console.log("annual", this.state.annualIncome)
    }


    handleLiabilityType = (e, { value }) => {
        let data = { ...this.state.liability, liabilityType: value };
        this.setState({
            liability: data
        })

    }
    handleOnLiability = (e) => {
        console.log("........", e.target.value)
        let liability = { ...this.state.liability };
        console.log(liability, "///////////jjjjjj")
        liability[e.target.name] = e.target.value;
        this.setState({
            liability: liability,
            //  user: { ...this.state.user, ...this.state.liability}
        })

    }

    addLiability = () => {
        const { liability } = this.state;
        if ((liability.bankName !== undefined && liability.bankName !== '')
            && (liability.liabilityType !== undefined && liability.liabilityType !== '') && (liability.AssetValue !== undefined && liability.AssetValue !== '')
            && (liability.AssetTenure !== undefined && liability.AssetTenure !== '')) {
            let financial = this.state.financial

            financial.push({ ...this.state.liability });
            console.log('-----', financial)
            this.inputTitle.value = "";
            this.inputTenure.value = "";
            // this.inputType.selected = false;
            this.inputBank.value = "";

            this.setState({
                financial: financial,
                liability: {},
                tabOpen: true,
                activeIndex: this.state.finIndex,
                errorMsg: ''

            })

            console.log("..........", this.state.financial)
        }
        else {

            let msg = "Please enter mantatory(*) fields"
            this.setState({
                errorMsg: msg,
                //  errorBorder: 'rgb(247, 12, 12)'
            })
        }

    }

    handleLoan = (e) => {

        let expLoan = this.state.expLoan
        expLoan[e.target.name] = e.target.value;
        this.setState({
            expLoan: expLoan
        })
        console.log(",.,.,.,.,.,.,.", this.state.expLoan)
    }

    handleUpload = async (e) => {

        let property = { ...this.state.property }
        // let tot = this.state.totalUser + 1;
        // let id = `Req${('000000' + tot).slice(-5)}`
        // // let a = e.target.files[0]
        // let data = new FormData()
        // data.append('id', id)
        // data.append('file', e.target.files[0])
        // console.log(data, "......uplaod datass")
        let file1 = e.target.files[0];

        // let body = {
        //     data
        // }
        // data.append('id', id)
        // file1["name"] = e.target.files[0].name;
        // file1["size"] = e.target.files[0].size;
        // file1["type"] = e.target.files[0].type;
        // console.log(file1, "inside")

        // const res = await axios.post("http://localhost:4000/upload", data)
        //     .then(res => {
        //         console.log(res.data)
        //         file1 = res.data;
        //     })
        //     .catch(e => {
        //         console.log(e)
        //         window.alert("data not send")
        //     })
        this.setState({
            // upload: { ...this.state.upload, file1: file1 },
            property: { ...property, file1: file1 }
        }, () => console.log(this.state.property, "oppppppppp"))
        // return res;
    }
    handleDoc1 = (e) => {
        let property = { ...this.state.property }
        let file2 = e.target.files[0]
        // file2["name"] = e.target.files[0].name;
        // file2["size"] = e.target.files[0].size;
        // file2["type"] = e.target.files[0].type;
        this.setState({
            // upload: { ...this.state.upload, file2: file2 },
            property: { ...property, file2: file2 }

        })
    }
    handleDoc2 = (e) => {
        let property = { ...this.state.property }
        let file3 = e.target.files[0]
        // file3["name"] = e.target.files[0].name;
        // file3["size"] = e.target.files[0].size;
        // file3["type"] = e.target.files[0].type;
        this.setState({
            // upload: { ...this.state.upload, file3: file3 },
            property: { ...property, file3: file3 }

        })
    }

    render() {
        const { activeIndex, activeAllIndex, value, open } = this.state
        // console.log(this.state.user, "user");
        // console.log(this.state.liability, "liability");
        // console.log(this.state.expLoan, "exploan")
        // console.log(this.state.totalProperty, "totalProperty")
        // console.log(this.state.financial, "financial")

        const options = [
            {
                key: 'Male',
                text: 'Male',
                value: 'Male'
            },
            {
                key: 'Female',
                text: 'Female',
                value: 'female'
            },
            {
                key: 'Other',
                text: 'Other',
                value: 'Other'
            },
        ]
        const employee = [
            {
                key: 'Self Employee',
                text: 'Self Employee',
                value: 'Self Employee'
            },
            {
                key: 'Salried',
                text: 'Salried',
                value: 'Salried'
            }

        ]

        const AssetType = [
            {
                key: 'Gold loan',
                text: 'Gold loan',
                value: 'Gold loan'
            },
            {
                key: 'property against',
                text: 'property against',
                value: 'property against'
            },
            {
                key: ' against',
                text: 'property against',
                value: 'property against'
            }


        ]
        const LibType = [
            {
                key: 'Gold loan',
                text: 'Gold loan',
                value: 'Gold loan'
            },
            {
                key: 'property Morgaged',
                text: 'property Morgaged',
                value: 'property Morgaged'
            },
        ]

        const property = [
            {
                key: 'Gold',
                text: 'Gold',
                value: 'Gold'
            },
            {
                key: 'Property',
                text: 'Property',
                value: 'Property'
            },
            {
                key: 'Car',
                text: 'Car',
                value: 'Car'
            }, {
                key: 'Others',
                text: 'Others',
                value: 'Others'
            }


        ]
        let lib = (
            <div style={{ marginTop: '10px' }}>
                <Table striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>BankName</Table.HeaderCell>
                            <Table.HeaderCell>liabilityType</Table.HeaderCell>
                            <Table.HeaderCell>RemaningValue</Table.HeaderCell>
                            <Table.HeaderCell>RemaningTenure</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.financial.map((financial, i) => {
                            return < Table.Row key={i} >
                                <Table.Cell>{financial.bankName}</Table.Cell>
                                <Table.Cell>{financial.liabilityType}</Table.Cell>
                                <Table.Cell> £ {financial.AssetValue}</Table.Cell>
                                <Table.Cell>{financial.AssetTenure}</Table.Cell>
                            </Table.Row>
                        })
                        }
                    </Table.Body>
                </Table>
            </div>
        )

        let modal = (
            <div >
                <Modal size='tiny' open={open} onClose={this.close} closeOnDimmerClick={false} className="modalEdit" style={{ marginTop: '150px', marginLeft: '30%' }} closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}>
                    <Modal.Header>Please Upload Required Document</Modal.Header>
                    <Modal.Content>
                        <div className="name-space">
                            <div className="name-wd" >
                                MortgageDoc:
                            </div>
                            <div className="ui input"><input type="file" name="morgageDoc" style={{ border: '0px' }}
                                onChange={(e) => this.handleUpload(e)}
                                /></div>
                        </div>
                        <div className="name-space">
                            <div className="name-wd" >
                                AadhaarCard:
                            </div >
                            <div className="ui input"><input type="file" name="document2" style={{ border: '0px', marginLeft: '2px' }}
                                onChange={(e) => this.handleDoc1(e)}

                                /></div>
                        </div>
                        <div className="name-space">
                            <div className="name-wd" >
                                PanCard:
                            </div >
                            <div className="ui input"><input type="file" name="document3" style={{ border: '0px', marginLeft: '27px' }}
                                onChange={(e) => this.handleDoc2(e)}

                                /></div>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => this.addAsset()} style={{ marginRight: '230px', width: '120px' }}>Done</Button>

                    </Modal.Actions>
                </Modal>
            </div>
        )

        let PermanentData = (
            <div>
                <Row >
                    <Col className="same-row">
                        <div className="name-space">
                            <div className="name-wd" >
                                AddressLine1:
                            </div >
                            <div className="ui input"><input type="text" name='ptline1' onChange={(e) => this.handlePtAddress(e)}
                                defaultValue={(this.state.user.address && this.state.user.address.permanentAddress) ? this.state.user.address.permanentAddress.ptline1 : ''}
                                placeholder="Address line 1" /></div>
                        </div>

                        <div className="name-space">
                            <div className="name-wd">
                                Addressline2:
                            </div >
                            <div className="ui input"><input type="text" name='ptline2' onChange={(e) => this.handlePtAddress(e)}
                                defaultValue={(this.state.user.address && this.state.user.address.permanentAddress) ? this.state.user.address.permanentAddress.ptline2 : ''}
                                placeholder="Address line 2" /></div>
                        </div>
                        <div className="name-space">
                            <div className="name-wd">
                                LandMark:
                            </div >
                            <div className="ui input"><input type="text" name='ptlandmark'
                                onChange={(e) => this.handlePtAddress(e)}
                                defaultValue={(this.state.user.address && this.state.user.address.permanentAddress) ? this.state.user.address.permanentAddress.ptlandmark : ''}
                                placeholder="LandMark" /></div>
                        </div>
                    </Col></Row>


                <Row >
                    <Col className="same-row">
                        <div className="name-space">
                            <div className="name-wd" >
                                City:
                            </div >
                            <div className="ui input"><input type="text" name="ptcity"
                                onChange={(e) => this.handlePtAddress(e)}
                                // defaultValue={(this.state.user.address && this.state.user.address.permanentAddress) ? this.state.user.address.permanentAddress.ptcity : ''}
                                placeholder="City" /></div>
                        </div>
                        <div className="name-space">
                            <div className="name-wd" >
                                State:
                            </div >
                            <div className="ui input"><input type="text"
                                onChange={(e) => this.handlePtAddress(e)}
                                name="ptstate"
                                defaultValue={(this.state.user.address && this.state.user.address.permanentAddress) ? this.state.user.address.permanentAddress.ptstate : ''}
                                placeholder="State" /></div>
                        </div>
                        <div className="name-space">
                            <div className="name-wd">
                                Country:
                            </div >
                            <div className="ui input"><input type="text"
                                onChange={(e) => this.handlePtAddress(e)}
                                name="ptcountry"
                                defaultValue={(this.state.user.address && this.state.user.address.permanentAddress) ? this.state.user.address.permanentAddress.ptcountry : ''}
                                placeholder=" Country" /></div>
                        </div>
                    </Col>
                </Row>
            </div>

        )


        let assetTab = (
            <div style={{ marginTop: '10px' }}>
                <Table striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>AssetType</Table.HeaderCell>
                            <Table.HeaderCell>AssetValue</Table.HeaderCell>
                            <Table.HeaderCell>Document</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.totalProperty.length !== 0 &&
                        
                        this.state.totalProperty.map((property, i) => {

                            return < Table.Row key={i} >
                                <Table.Cell>{property.propertyType}</Table.Cell>
                                <Table.Cell> {property.assestValue}</Table.Cell>
                                <Table.Cell disabled={this.state.status === "Approved"?true:false}>
                                    <div >MorgagedDoc : <a href="javascript:;" onClick={() => this.download(this.state.reqId, (property.file1 ? property.file1.name : ''))}>{property.file1 ? property.file1.name : ' '} </a>
                                        {property.file1 && <Icon size="small" inverted name='delete' className="searchIcon" color='black' link onClick={() => this.deleteFile(i, { file1: undefined })} />}</div>
                                    <div >AadhaarCard : <a href="javascript:;" onClick={() => this.download(this.state.reqId, (property.file2 ? property.file2.name : ''))}>{property.file2 ? property.file2.name : ' '}</a>
                                        {property.file2 && <Icon size="small" inverted name='delete' className="searchIcon" color='black' link onClick={() => this.deleteFile(i, { file2: undefined })} />}</div>
                                    <div>PanCard : <a href="javascript:;" onClick={() => this.download(this.state.reqId, (property.file3 ? property.file3.name : ''))}>{property.file3 ? property.file3.name : ' '}
                                    </a>
                                        {property.file3 && <Icon size="small" inverted name='delete' className="searchIcon" color='black' link onClick={() => this.deleteFile(i, { file3: undefined })} />}</div></Table.Cell>
                            </Table.Row>

                        })
                        }
                    </Table.Body>
                </Table>
            </div>
        )

        let liability = (
            <div style={{ display: 'flex' }}>
                <div className="name-space">
                    <div className="name-wd" >
                        LiabilityType{this.state.ifLiability && <sup style={{ color: 'red' }}>*</sup>}:
                            </div >
                    <Select style={{ height: '20px' }}
                        clearable={true}
                        placeholder='Select Type'
                        ref={el => this.inputType = el}
                        onChange={this.handleLiabilityType}
                        selection
                        options={LibType}
                        defaultValue={this.state.liability.liabilityType}
                        disabled={this.state.status === "Approved"?true:false}
                        />
                </div>

                <div className="name-space">
                    <div className="name-wd" style={{ marginTop: '-1px' }}>
                        Remaining
                        Value{this.state.ifLiability && <sup style={{ color: 'red' }}>*</sup>}:
                            </div >
                    <div className="ui input" ><input type="text" style={{ height: '38px' }}
                        ref={el => this.inputTitle = el}
                        name="AssetValue"
                        onChange={(e) => this.handleOnLiability(e)}
                        defaultValue={this.state.liability.AssetValue}
                        placeholder=" RemainingValue" disabled={this.state.status === "Approved"?true:false}/></div>
                </div>
                <div className="name-space">
                    <div className="name-wd" style={{ marginTop: '-1px' }}>
                        Remaining
                        Tenure{this.state.ifLiability && <sup style={{ color: 'red' }}>*</sup>}:
                        (months)
                            </div >
                    <div className="ui input" ><input type="text" style={{ height: '38px' }}
                        name="AssetTenure"
                        ref={el => this.inputTenure = el}
                        onChange={(e) => this.handleOnLiability(e)}
                        defaultValue={this.state.liability.AssetTenure}
                        placeholder=" RemainingValue" disabled={this.state.status === "Approved"?true:false}/></div>


                </div>

                <Icon name='add circle' className="ml-auto" style={{ marginTop: '15px' }} size="large" onClick={this.addLiability} disabled={this.state.status === "Approved"?true:false}/>

            </div>
        )


        return (
            <div className="head-m" style={{ backgroundColor: '#f5f6fa', paddingBottom: '45px' }}>
                <div style={{ display: 'flex' }}>
                    <h2 className="heading-m">
                        Welcome to the Mortgages
                </h2>
                    <Form inline style={{ marginLeft: '200px' }} >
                            <FormControl type="text" placeholder="Request Number...." className="mr-sm-2" ref={el => this.search = el}
                            onChange={(e) => this.searchKey(e)} value={this.state.search} style={{ marginLeft: '187px', paddingRight: '35px' }} onKeyPress={this.handleKeyPress} />
                       
                        <Icon size="large" inverted name='search' className="searchIcon" color='black' link onClick={() => this.fetchKey()} />
                    </Form>
                </div>


                <Paper style={{ marginRight: '0px', padding: '15px', width: '97%', height: "fit-content", marginBottom: '10px', marginLeft: '18px', marginTop: '25px' }}>
                    <form>


                        <Accordion styled className="acc-m">
                            <Accordion.Title
                                active={activeIndex === 0 || activeAllIndex === true}
                                index={0}
                                onClick={this.handleClick}
                                >
                                <Icon name='dropdown' />
                                Enter your personal details
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0 || activeAllIndex === true}>

                                <Row >
                                    <Col className="same-row">
                                        <div className="name-space">
                                            <div className="name-wd" >
                                                FirstName <sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text"
                                                style={{ borderColor: this.state.errorBorder ? this.state.errorBorder : '' }}
                                                name="fname" onChange={(e) => this.handleOnChange(e)}
                                                placeholder="firstName"
                                                defaultValue={this.state.user.fname && this.state.user.fname} required 
                                                disabled={this.state.status === "Approved"?true:false}/>
                                            </div>
                                        </div>

                                        <div className="name-space">
                                            <div className="name-wd">
                                                LastName<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text" style={{ borderColor: this.state.errorBorder ? this.state.errorBorder : '' }}
                                                name="lname" onChange={(e) => this.handleOnChange(e)}
                                                defaultValue={this.state.user.lname && this.state.user.lname}
                                                placeholder="lastName" required disabled={this.state.status === "Approved"?true:false}/>
                                            </div>
                                        </div>


                                        <div className="name-space">
                                            <div className="name-wd">
                                                FatherName<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text"
                                                style={{ borderColor: this.state.errorBorder ? this.state.errorBorder : '' }}
                                                name="faName" onChange={(e) => this.handleOnChange(e)}
                                                defaultValue={this.state.user.faName && this.state.user.faName}
                                                placeholder="Father Name" required disabled={this.state.status === "Approved"?true:false}/>
                                            </div>
                                        </div>

                                    </Col>
                                </Row>
                                <Row >
                                    <Col className="same-row">
                                        <div className="name-space">
                                            <div className="name-wd">
                                                DOB<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="date"
                                                name="age" onBlur={(e) => this.handleOnChange(e)}
                                                defaultValue={this.state.user.age}
                                                style={{ borderColor: this.state.errorBorder ? this.state.errorBorder : '' }}
                                                placeholder="age" required disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                        <div className="name-space">
                                            <div className="name-wd">
                                                MobileNo<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="number"
                                                name="mobileNo" onChange={(e) => this.handleOnChange(e)}
                                                defaultValue={this.state.user.mobileNo} placeholder=" MobileNo"
                                                required disabled={this.state.status === "Approved"?true:false}
                                                /></div>
                                        </div>
                                        <div className="name-space">
                                            <div className="name-wd">
                                                Email<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text"
                                                name="emailId" onChange={(e) => this.handleOnChange(e)} defaultValue={this.state.user.emailId} placeholder=" email"
                                                required disabled={this.state.status === "Approved"?true:false}
                                                /></div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row >
                                    <Col className="same-row">
                                        <div className="name-space">
                                            <div className="name-wd" >
                                                Gender<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <Dropdown
                                                onChange={this.handleGender}
                                                options={options}
                                                placeholder='select'
                                                selection={true}
                                                defaultValue={value}
                                                value={this.state.user.gender}
                                                required
                                                disabled={this.state.status === "Approved"?true:false}
                                                />

                                        </div>
                                        <div className="name-space">
                                            <div className="name-wd">
                                                PanNo<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text"
                                                name="panNo" onChange={(e) => this.handleOnChange(e)} placeholder=" PanNo:"
                                                defaultValue={this.state.user.panNo}
                                                required disabled={this.state.status === "Approved"?true:false}
                                                /></div>
                                        </div>
                                        <div className="name-space">
                                            <div className="name-wd">
                                                AadharNo<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text"
                                                name="AadharNo" onChange={(e) => this.handleOnChange(e)} placeholder=" AadharNo"
                                                defaultValue={this.state.user.AadharNo}
                                                required disabled={this.state.status === "Approved"?true:false}
                                                /></div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col className="same-row">
                                        <div className="name-space">
                                            <div className="name-wd" >
                                                Occupation:
                                            </div >
                                            <Dropdown
                                                onChange={this.handleOccup}
                                                options={employee}
                                                placeholder='Choose an option'
                                                selection
                                                defaultValue={value}
                                                value={this.state.user.occupation}
                                                required
                                                disabled={this.state.status === "Approved"?true:false}
                                                />

                                        </div>
                                        <div className="name-space" style={{ marginLeft: '40px' }}>
                                            <div className="name-wd">
                                                Company:
                                            </div >
                                            <div className="ui input" ><input type="text"
                                                name="company" onChange={(e) => this.handleOnChange(e)} placeholder=" company"
                                                defaultValue={this.state.user.company}
                                                required disabled={this.state.status === "Approved"?true:false}
                                                />
                                            </div>
                                        </div>

                                    </Col>
                                </Row>
                                <p style={{ color: 'red', marginLeft: '35px', marginTop: '10px' }}>
                                    {this.state.activeIndex === 0 && this.state.errorMsg}
                                </p>
                            </Accordion.Content>
                        </Accordion>
                        <Accordion styled className="acc-m">
                            <Accordion.Title
                                active={activeIndex === 1 || activeAllIndex === true}
                                index={1}
                                onClick={this.handleClick}
                                >
                                <Icon name='dropdown' />
                                Address
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1 || activeAllIndex === true}>
                                <div>
                                    <p>
                                        Current Address
                                    </p>
                                </div>
                                <Row >
                                    <Col className="same-row">
                                        <div className="name-space">
                                            <div className="name-wd" >
                                                AddressLine1<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text" name='line1' onChange={(e) => this.handleCtAddress(e)}
                                                defaultValue={(this.state.user.address && this.state.user.address.currentAddress) ? this.state.user.address.currentAddress.line1 : ''}
                                                placeholder="Address line 1" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>

                                        <div className="name-space">
                                            <div className="name-wd">
                                                AddressLine2:
                                            </div >
                                            <div className="ui input"><input type="text" name='line2' onChange={(e) => this.handleCtAddress(e)}

                                                defaultValue={(this.state.user.address && this.state.user.address.currentAddress) ? this.state.user.address.currentAddress.line2 : ''}
                                                placeholder="Address line 2" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                        <div className="name-space">
                                            <div className="name-wd">
                                                LandMark:
                                            </div >
                                            <div className="ui input"><input type="text" name='landmark'
                                                defaultValue={(this.state.user.address && this.state.user.address.currentAddress) ? this.state.user.address.currentAddress.landmark : ''}

                                                onChange={(e) => this.handleCtAddress(e)}
                                                placeholder="LandMark" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                    </Col></Row>


                                <Row >
                                    <Col className="same-row">
                                        <div className="name-space">
                                            <div className="name-wd" >
                                                City<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text" name="city"
                                                onChange={(e) => this.handleCtAddress(e)}
                                                defaultValue={(this.state.user.address && this.state.user.address.currentAddress) ? this.state.user.address.currentAddress.city : ''}
                                                // value={this.state.user.Address.city}
                                                placeholder="City" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                        <div className="name-space">
                                            <div className="name-wd" >
                                                State<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text"
                                                onChange={(e) => this.handleCtAddress(e)}
                                                defaultValue={(this.state.user.address && this.state.user.address.currentAddress) ? this.state.user.address.currentAddress.state : ''}
                                                // value={this.state.user.Address.state}
                                                name="state"
                                                placeholder="State" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                        <div className="name-space">
                                            <div className="name-wd">
                                                Country<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text"
                                                name="country"
                                                onChange={(e) => this.handleCtAddress(e)}
                                                defaultValue={(this.state.user.address && this.state.user.address.currentAddress) ? this.state.user.address.currentAddress.country : ''}
                                                placeholder=" Country" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="ui checkbox top-align" >
                                    <input type="checkbox" tabIndex="0" value={this.state.sameAddr} onChange={() => this.handleCheckBox()} disabled={this.state.status === "Approved"?true:false}/>
                                    <label>Permanent address is as same as current address</label>
                                </div>

                                {!this.state.sameAddr && PermanentData}
                                <p style={{ color: 'red', marginLeft: '35px', marginTop: '10px' }}>
                                    {this.state.activeIndex === 1 && this.state.errorMsg}
                                </p>
                            </Accordion.Content>

                        </Accordion>
                        <Accordion styled className="acc-m">
                            <Accordion.Title
                                active={activeIndex === 2 || activeAllIndex === true}
                                index={2}
                                onClick={this.handleClick}
                                >
                                <Icon name='dropdown' />
                                Financial Details
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 2 || activeAllIndex === true}>
                                <Row >
                                    <Col className="same-row">

                                        <div className="name-space" style={{ marginBottom: '15px' }}>
                                            <div className="name-wd">
                                                Income<sup style={{ color: 'red' }}>*</sup>:
                                         </div >
                                            <div className="ui input"><input type="text" placeholder="Annual Income"
                                                defaultValue={this.state.annualIncome}
                                                onChange={(e) => this.handleIncome(e)} disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>


                                    </Col></Row>
                                <Row>
                                    <Col>
                                        <div style={{ display: 'flex' }}>
                                            <div className="ui checkbox top-align" >
                                                <input type="checkbox" tabIndex="0" value={this.state.ifLiability} onChange={() => this.handleLiability()} disabled={this.state.status === "Approved"?true:false}/>
                                                <label>If any Liabilities:</label>
                                            </div>
                                            <div style={{ marginTop: '-5px' }}>
                                                {this.state.ifLiability && <div className="name-space">
                                                    <div className="name-wd">
                                                        BankName{this.state.ifLiability && <sup style={{ color: 'red' }}>*</sup>}:
                                         </div >
                                                    <div className="ui input"><input type="text" name="bankName"
                                                        onChange={(e) => this.handleOnLiability(e)}
                                                        ref={el => this.inputBank = el}
                                                        defaultValue={this.state.liability.bankName}
                                                        placeholder="Bank Name" disabled={this.state.status === "Approved"?true:false}/></div>
                                                </div>}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{ marginTop: '10px' }}>
                                        {this.state.ifLiability && liability}
                                        {this.state.tabOpen && lib}
                                    </Col>
                                </Row>
                                <p style={{ color: 'red', marginLeft: '35px', marginTop: '10px' }}>
                                    {this.state.activeIndex === 2 && this.state.errorMsg}
                                </p>
                            </Accordion.Content>

                        </Accordion>

                        <Accordion styled className="acc-m">
                            <Accordion.Title
                                active={activeIndex === 3 || activeAllIndex === true}
                                index={3}
                                onClick={this.handleClick}
                                >
                                <Icon name='dropdown' />
                                Property Details:
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 3 || activeAllIndex === true}>
                                <Row >
                                    <Col className="same-row">
                                        <form className='same-row'>
                                            <div className="name-space">
                                                <div className="name-wd" >
                                                    AssetType<sup style={{ color: 'red' }}>*</sup>:
                                                </div >
                                                <Dropdown
                                                    placeholder='Select Type'
                                                    onChange={this.handleProperty}
                                                    selection
                                                    options={AssetType}
                                                    defaultValue={value}
                                                    value={this.state.totalProperty ? this.state.property.propertyType : ''}
                                                    disabled={this.state.status === "Approved"?true:false}
                                                    />
                                            </div>

                                            <div className="name-space">
                                                <div className="name-wd">
                                                    AssetValue<sup style={{ color: 'red' }}>*</sup>:
                                                </div >
                                                <div className="ui input"><input type="text"
                                                    ref={el => this.propValue = el}
                                                    name="AssetValue" onChange={(e) => this.handleAssetVAlue(e)}
                                                    defaultValue={value}
                                                    placeholder=" asset value" disabled={this.state.status === "Approved"?true:false}/></div>
                                            </div>
                                            <div>
                                                <Button className="ml-auto" style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '100px', marginTop: '10px' }} onClick={() => this.show()} disabled={this.state.status === "Approved"?true:false}>Upload Document</Button>
                                                {modal}
                                            </div>
                                        </form>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {this.state.tab && assetTab}
                                    </Col>
                                </Row>
                                <p style={{ color: 'red', marginLeft: '35px', marginTop: '10px' }}>
                                    {this.state.activeIndex === 3 && this.state.errorMsg}
                                </p>
                            </Accordion.Content>
                        </Accordion>
                        <Accordion styled className="acc-m">
                            <Accordion.Title
                                active={activeIndex === 4 || activeAllIndex === true}
                                index={4}
                                onClick={this.handleClick}
                                >
                                <Icon name='dropdown' />
                                Expected Loan amount
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 4 || activeAllIndex === true}>
                                <Row >
                                    <Col className="same-row">
                                        <div className="name-spaced">
                                            <div className="name-wd" >
                                                Principal<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="text" placeholder="principal"
                                                name="principle"
                                                defaultValue={this.state.expLoan.principle}
                                                onChange={(e) => { this.handleLoan(e) } }
                                                disabled={this.state.status === "Approved"?true:false}/></div>

                                        </div>

                                        <div className="name-spaced">
                                            <div className="name-wd">
                                                Tenure<sup style={{ color: 'red' }}>*</sup>:
                                                (months)
                                            </div >
                                            <div className="ui input"><input type="text"
                                                name="tenure"
                                                defaultValue={this.state.expLoan.tenure}
                                                onChange={(e) => { this.handleLoan(e) } }
                                                placeholder="Tenure" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                        <div className="name-spaced">
                                            <div className="name-wd">
                                                Interest(%)<sup style={{ color: 'red' }}>*</sup>:

                                            </div >
                                            <div className="ui input"><input type="number" step="0.5" placeholder="Interest"
                                                name="intrest"
                                                defaultValue={this.state.expLoan.intrest}
                                                onChange={(e) => { this.handleLoan(e) } } disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>



                                    </Col>
                                    <Col className="same-row" style={{ marginLeft: '-37px' }}>
                                        <div className="name-space">
                                            <div className="name-wd" >
                                                Mortgage<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <Dropdown
                                                onChange={this.propertySelect}
                                                options={property}
                                                placeholder='select'
                                                selection={true}
                                                defaultValue={value}
                                                value={this.state.expLoan.propertyType}
                                                disabled={this.state.status === "Approved"?true:false}
                                                />
                                        </div>
                                        <div className="name-space">


                                            <div className="name-wd">
                                                StartDate<sup style={{ color: 'red' }}>*</sup>:
                                            </div >
                                            <div className="ui input"><input type="date"
                                                name="StartDate" onBlur={(e) => this.handleStartDate(e)} defaultValue={this.state.expLoan.startDate}
                                                placeholder="startDate" disabled={this.state.status === "Approved"?true:false}/></div>
                                        </div>
                                        <div className="name-space" >
                                            <Radio
                                                label='Flexible'
                                                name='flexible'
                                                value='flexible'
                                                checked={this.state.value === 'flexible'}
                                                onChange={this.handleRadio}
                                                className='radio-space name-wd '
                                                />
                                            <Radio
                                                label='Fixed'
                                                name='fixed'
                                                value='fixed'
                                                checked={this.state.value === 'fixed'}
                                                onChange={this.handleRadio}
                                                className='radio-space name-wd '
                                                />
                                        </div>
                                    </Col>
                                </Row>
                                <p style={{ color: 'red', marginLeft: '35px', marginTop: '10px' }}>
                                    {this.state.activeIndex === 4 && this.state.errorMsg}
                                </p>
                            </Accordion.Content>
                        </Accordion>
                        <Row>
                            {this.state.update && (
                                <Button className="ml-auto" style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '-70%' }} onClick={() => this.handleProceed()}>Save</Button>)}
                            {!this.state.update && (
                                <Button className="ml-auto" style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '-69%' }} onClick={() => this.handleProceed(this.state.reqId)}>Update</Button>)}

                            <Button className="ml-auto" style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '250px' }} onClick={() => this.handleProceed()} disabled={!this.state.enableBtn}>Proceed</Button>
                        </Row>
                    </form>
                </Paper>
            </div>
        )
    }
}


export default withRouter(Mortgage);
