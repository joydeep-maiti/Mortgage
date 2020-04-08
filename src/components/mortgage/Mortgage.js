import React from 'react';
import { withRouter } from 'react-router'
import axios from 'axios'
import { Accordion, Icon, Dropdown, Table, Radio, Select, Modal } from 'semantic-ui-react'
import { Paper } from '@material-ui/core'
import { Row, Col, Form, FormControl, Button } from 'react-bootstrap'
import './style.css';
import { Data } from '../../config'
import download from 'downloadjs';

let storageRef = null

class Mortgage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifLiability: false,
            enableBtn: false,
            tabOpen: false,
            radio: 'flexible',
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
            activeAllIndex : false,
            validation : {},
            validationError : false

        }

    }

    componentWillMount = () => {
        storageRef = this.props.storageRef
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
        let numberonlyreg = /^[0-9]{1,20}$/
        let assetvalue
        let validationError = false;
            if(!numberonlyreg.test(value)){
                assetvalue = false
                validationError = true;
            }else {
                assetvalue = true
            }
        this.setState({
            property: { ...this.state.property, assestValue: value },
            validation : {
                ...this.state.validation,
                assetValue : assetvalue
            },
            validationError
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
    async download(path, file) {
        // debugger
        storageRef.child(path+"/"+file.lastModified+file.name).getDownloadURL().then(function(url) {
            // `url` is the download URL for 'images/stars.jpg'
          
            // This can be downloaded directly:
            // console.log("data recieved", url);
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', url);
            xhr.send();
            xhr.onload = function(event) {
                var blob = xhr.response;
                // console.log("BLOB", blob)
                download(blob, file.name);
            };
          }).catch(function(error) {
                alert("Oops! Something went wrong");
          });
        // const res = await fetch(`${Data.url}/download?reqid=${reqId}&fileName=${fileName}`);
        // const blob = await res.blob();
        // download(blob, fileName);

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
        let validation = this.state.validation
        let nameregex = /^[a-zA-Z ]{1,30}$/
        let mobexp = /^[0-9]{10}$/
        let emailreg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        let panreg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
        let aadharreg = /^\d{12}$/
        let validationError = false;
        switch(e.target.name){
            case 'fname': if(!nameregex.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
            case 'lname':if(!nameregex.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
            case 'faName':if(!nameregex.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
            case 'mobileNo':if(!mobexp.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
            case 'emailId':if(!emailreg.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
            case 'panNo':if(!panreg.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
            case 'AadharNo':if(!aadharreg.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
            case 'company':if(!nameregex.test(e.target.value)){
                validation[e.target.name] = false
                validationError = true;
            }else{
                validation[e.target.name] = true
            }
                break;
        }
        this.setState({
            user: user,
            validation : {
                ...this.state.validation,
                ...validation
            },
            validationError
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
                            radio : res.data.expLoans.radio,
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
        if(this.state.validationError){
            alert("Fix all the error before submitting");
            return;
        }
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
            case ('PROPERTY'):
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
            radio: value
        })
    }
    handleCtAddress = (e) => {

        let addr = { ...this.state.address.currentAddress };
        console.log('Address : ', addr);
        addr[e.target.name] = e.target.value;
        let validationError = false;
        console.log('Address2 : ', addr)
        let nameregex = /^[a-zA-Z ]{1,30}$/
        switch(e.target.name){
            case 'landmark':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
            case 'city':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
            case 'state':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
            case 'country':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
        }


        this.setState({
            address: { ...this.state.address, currentAddress: addr },
            user: { ...this.state.user, Address: { ...this.state.address, currentAddress: addr } },
            validation : {
                ...this.state.validation,
                currentAddress : addr
            },
            validationError

        }, console.log('---', this.state.address, ">>>>>>>>", this.state.user))
    }
    handlePtAddress = (e) => {

        let addr = { ...this.state.address.permanentAddress };
        addr[e.target.name] = e.target.value;
        let validationError = false;
        let nameregex = /^[a-zA-Z ]{1,30}$/
        switch(e.target.name){
            case 'ptlandmark':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
            case 'ptcity':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
            case 'ptstate':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
            case 'ptcountry':if(!nameregex.test(e.target.value)){
                addr[e.target.name] = false
                validationError = true;
            }else{
                addr[e.target.name] = true
            }
                break;
        }

        this.setState({
            address: { ...this.state.address, permanentAddress: addr },
            user: { ...this.state.user, Address: { ...this.state.address, permanentAddress: addr } },
            validation : {
                ...this.state.validation,
                permanentAddress : addr
            },
            validationError

        }, console.log('---', this.state.address, ">>>>>>>>", this.state.user))



    }
    handleIncome = (e) => {
        let numberonlyreg = /^[0-9]{1,20}$/
        let income
        let validationError = false;
        if(!numberonlyreg.test(e.target.value)){
            income = false
            validationError = true;
        }else{
            income = true
        }
        this.setState({
            annualIncome: e.target.value,
            validation : {
                ...this.state.validation,
                annualIncome : income
            },
            validationError
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
        let validationError = false;
        console.log("........", e.target.value)
        let liability = { ...this.state.liability };
        console.log(liability, "///////////jjjjjj")
        liability[e.target.name] = e.target.value;
        let nameregex = /^[a-zA-Z ]{1,30}$/
        let numberonlyreg = /^[0-9]{1,20}$/
        switch(e.target.name) {
            case 'bankName':if(!nameregex.test(e.target.value)){
                liability[e.target.name] = false
                validationError = true;
            }else{
                liability[e.target.name] = true
            }
                break; 
            case 'AssetValue':if(!numberonlyreg.test(e.target.value)){
                liability[e.target.name] = false
                validationError = true;
            }else{
                liability[e.target.name] = true
            }
                break; 
            case 'AssetTenure':if(!numberonlyreg.test(e.target.value)){
                liability[e.target.name] = false
                validationError = true;
            }else{
                liability[e.target.name] = true
            }
                break; 
        }
        this.setState({
            liability: liability,
            validation : {
                ...this.state.validation,
                liability
            },
            validationError
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
        let validationError = false;
        let expLoan = this.state.expLoan
        expLoan[e.target.name] = e.target.value;
        let numberonlyreg = /^[0-9]{1,20}$/
        switch(e.target.name) {
            case 'principle':if(!numberonlyreg.test(e.target.value)){
                expLoan[e.target.name] = false
                validationError = true;
            }else{
                expLoan[e.target.name] = true
            }
                break; 
            case 'tenure':if(!numberonlyreg.test(e.target.value)){
                expLoan[e.target.name] = false
                validationError = true;
            }else{
                expLoan[e.target.name] = true
            }
                break; 
        }
        this.setState({
            expLoan: expLoan,
            validation : {
                ...this.state.validation,
                expLoan
            },
            validationError
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
        console.log("---File data", file1)
        if(file1.type !== "image/jpeg" && file1.type !== "image/png" && file1.type !== "application/pdf" ){
            alert("Unsupported file format. Please choose a correct file format.")
            return;
        }
        // name: "IMG_20180712_202710(1).jpg"
        // lastModified: 1533541984000
        // lastModifiedDate: Mon Aug 06 2018 13:23:04 GMT+0530 (India Standard Time) {}
        // webkitRelativePath: ""
        // size: 269929
        // type: "image/jpeg"
        // type: "application/pdf"

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
        let filename = file1.lastModified + file1.name
        var docref = storageRef.child('mortgage/'+filename);
        const self = this;
        docref.put(file1)
        .then(function(snapshot) {
            console.log('Uploaded a blob or file!');
            self.setState({
                property: { ...property, file1: file1 }
            })
        });

        
        // return res;
    }
    handleDoc1 = (e) => {
        let property = { ...this.state.property }
        let file1 = e.target.files[0]
        if(file1.type !== "image/jpeg" && file1.type !== "image/png" && file1.type !== "application/pdf" ){
            alert("Unsupported file format. Please choose a correct file format.")
            return;
        }
        let filename = file1.lastModified + file1.name
        var docref = storageRef.child('aadhar/'+filename);
        const self = this;
        docref.put(file1)
        .then(function(snapshot) {
            console.log('Uploaded a blob or file!');
            self.setState({
                property: { ...property, file2: file1 }
            })
        });
        // file2["name"] = e.target.files[0].name;
        // file2["size"] = e.target.files[0].size;
        // file2["type"] = e.target.files[0].type;
        
    }
    handleDoc2 = (e) => {
        let property = { ...this.state.property }
        let file1 = e.target.files[0]
        if(file1.type !== "image/jpeg" && file1.type !== "image/png" && file1.type !== "application/pdf" ){
            alert("Unsupported file format. Please choose a correct file format.")
            return;
        }
        let filename = file1.lastModified + file1.name
        var docref = storageRef.child('pan/'+filename);
        const self = this;
        docref.put(file1)
        .then(function(snapshot) {
            console.log('Uploaded a blob or file!');
            self.setState({
                property: { ...property, file3: file1 }
            })
        });
        // file3["name"] = e.target.files[0].name;
        // file3["size"] = e.target.files[0].size;
        // file3["type"] = e.target.files[0].type;
        
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
                key: 'Gold',
                text: 'Gold',
                value: 'Gold'
            },
            {
                key: 'Property',
                text: 'Property',
                value: 'Property'
            },


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
                            style={{ borderColor: this.state.validation.permanentAddress!=undefined?this.state.validation.permanentAddress.ptlandmark!=undefined?this.state.validation.permanentAddress.ptlandmark === false ? 'red' : '' :'':''}}
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
                            style={{ borderColor: this.state.validation.permanentAddress!=undefined?this.state.validation.permanentAddress.ptcity!=undefined?this.state.validation.permanentAddress.ptcity === false ? 'red' : '' :'':''}}
                                onChange={(e) => this.handlePtAddress(e)}
                                // defaultValue={(this.state.user.address && this.state.user.address.permanentAddress) ? this.state.user.address.permanentAddress.ptcity : ''}
                                placeholder="City" /></div>
                        </div>
                        <div className="name-space">
                            <div className="name-wd" >
                                State:
                            </div >
                            <div className="ui input"><input type="text"
                            style={{ borderColor: this.state.validation.permanentAddress!=undefined?this.state.validation.permanentAddress.ptstate!=undefined?this.state.validation.permanentAddress.ptstate === false ? 'red' : '' :'':''}}
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
                            style={{ borderColor: this.state.validation.permanentAddress!=undefined?this.state.validation.permanentAddress.ptcountry!=undefined?this.state.validation.permanentAddress.ptcountry === false ? 'red' : '' :'':''}}
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
                                    <div >MorgagedDoc : <a href="javascript:;" onClick={() => this.download("mortgage", (property.file1 ? property.file1: ''))}>{property.file1 ? property.file1.name : ' '} </a>
                                        {property.file1 && <Icon size="small" inverted name='delete' className="searchIcon" color='black' link onClick={() => this.deleteFile(i, { file1: undefined })} />}</div>
                                    <div >AadhaarCard : <a href="javascript:;" onClick={() => this.download("aadhar", (property.file2 ? property.file2 : ''))}>{property.file2 ? property.file2.name : ' '}</a>
                                        {property.file2 && <Icon size="small" inverted name='delete' className="searchIcon" color='black' link onClick={() => this.deleteFile(i, { file2: undefined })} />}</div>
                                    <div>PanCard : <a href="javascript:;" onClick={() => this.download("pan", (property.file3 ? property.file3 : ''))}>{property.file3 ? property.file3.name : ' '}
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
                    <div className="ui input" ><input type="text" style={{ height: '38px',borderColor: this.state.validation.liability!=undefined?this.state.validation.liability.AssetValue!=undefined?this.state.validation.liability.AssetValue === false ? 'red' : '' :'' :'' }}
                    
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
                    <div className="ui input" ><input type="text" style={{ height: '38px',borderColor: this.state.validation.liability!=undefined?this.state.validation.liability.AssetTenure!=undefined?this.state.validation.liability.AssetTenure === false ? 'red' : '' :'' :''}}
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
                                                style={{ borderColor: this.state.validation.fname!=undefined?this.state.validation.fname === false ? 'red' : '' :''}}
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
                                            <div className="ui input"><input type="text" style={{ borderColor: this.state.validation.lname!=undefined?this.state.validation.lname === false ? 'red' : '':'' }}
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
                                                style={{ borderColor: this.state.validation.faName!=undefined?this.state.validation.faName === false ? 'red' : '' :''}}
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
                                                 style={{ borderColor: this.state.validation.mobileNo!=undefined?this.state.validation.mobileNo === false ? 'red' : '' :''}}
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
                                             style={{ borderColor: this.state.validation.emailId!=undefined?this.state.validation.emailId === false ? 'red' : '' :''}}
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
                                             style={{ borderColor: this.state.validation.panNo!=undefined?this.state.validation.panNo === false ? 'red' : '' :''}}
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
                                             style={{ borderColor: this.state.validation.AadharNo!=undefined?this.state.validation.AadharNo === false ? 'red' : '' :''}}
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
                                            </div>
                                            <div className="ui input" ><input type="text"
                                             style={{ borderColor: this.state.validation.company!=undefined?this.state.validation.company === false ? 'red' : '' :''}}
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
                                                style={{ borderColor: this.state.validation.currentAddress!=undefined?this.state.validation.currentAddress.landmark!=undefined?this.state.validation.currentAddress.landmark === false ? 'red' : '' :'':''}}
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
                                                style={{ borderColor: this.state.validation.currentAddress!=undefined?this.state.validation.currentAddress.city!=undefined?this.state.validation.currentAddress.city === false ? 'red' : '' :'':''}}
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
                                                style={{ borderColor: this.state.validation.currentAddress!=undefined?this.state.validation.currentAddress.state!=undefined?this.state.validation.currentAddress.state === false ? 'red' : '' :'':''}}
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
                                                style={{ borderColor: this.state.validation.currentAddress!=undefined?this.state.validation.currentAddress.country!=undefined?this.state.validation.currentAddress.country === false ? 'red' : '' :'':''}}
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
                                            <div className="ui input"><input type="text" 
                                            style={{ borderColor: this.state.validation.annualIncome!=undefined?this.state.validation.annualIncome === false ? 'red' : '' :''}}
                                            placeholder="Annual Income"
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
                                                    style={{ borderColor: this.state.validation.liability!=undefined?this.state.validation.liability.bankName!=undefined?this.state.validation.liability.bankName === false ? 'red' : '' :'' :'' }}
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
                                                style={{ borderColor: this.state.validation.assetValue!=undefined?this.state.validation.assetValue === false ? 'red' : '' :''}}
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
                                            <div className="ui input"><input type="text" 
                                            placeholder="principal"
                                            style={{ borderColor: this.state.validation.expLoan!=undefined?this.state.validation.expLoan.principle!=undefined?this.state.validation.expLoan.principle === false ? 'red' : '' :'':''}}
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
                                            style={{ borderColor: this.state.validation.expLoan!=undefined?this.state.validation.expLoan.tenure!=undefined?this.state.validation.expLoan.tenure === false ? 'red' : '' :'':''}}
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
                                                onChange={(e) => { this.handleLoan(e) } } 
                                                disabled={true}
                                                // disabled={this.state.status === "Approved"?true:false}
                                                /></div>
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
                                                checked={this.state.radio === 'flexible'}
                                                onChange={this.handleRadio}
                                                className='radio-space name-wd '
                                                disabled={this.state.status === "Approved"?true:false}
                                                />
                                            <Radio
                                                label='Fixed'
                                                name='fixed'
                                                value='fixed'
                                                checked={this.state.radio === 'fixed'}
                                                onChange={this.handleRadio}
                                                className='radio-space name-wd '
                                                disabled={this.state.status === "Approved"?true:false}
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
                                <Button className="ml-auto" style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '250px' }} onClick={() => this.handleProceed(this.state.reqId)}>Update</Button>)}

                            {this.state.activeAllIndex == false && (<Button className="ml-auto" style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '250px' }} onClick={() => this.handleProceed()} disabled={!this.state.enableBtn}>Proceed</Button>)}
                        </Row>
                    </form>
                </Paper>
            </div>
        )
    }
}


export default withRouter(Mortgage);
