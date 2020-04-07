import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Paper } from '@material-ui/core'
import { Dropdown } from 'semantic-ui-react'
import './style.css'
import axios from 'axios'
import { Data } from '../../config'
import UserManagament from '../UserManagament/UserManagament'

class Config extends React.Component {
    state = {
        property: {
            gold: 8.5,
            car: 9,
            propertyAgainst : 10.5,
            other: 11,
            penalty: 7.7,
            id: 1
        },
        validation: {
            gold: true,
            car: true,
            propertyAgainst : true,
            other: true,
            penalty: true,
        },
        validationError: false

    } 

    handleSubmit = () => {
        if(this.state.validationError){
            alert("Fix all the error before submitting");
            return;
        }
        this.submitInterestConfig();
    }

    componentWillMount = () => {
        axios.get(`${Data.url}/property/1`)
        .then(res => {
            console.log("getInterestConfig data", res);
            this.setState({
                property: res.data
            })

        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("Couldn't fetch data ")
        });
    }

    submitInterestConfig = () => {
        axios.put(`${Data.url}/property/1`,this.state.property)
        .then(res => {
            console.log("submitInterestConfig data", res);
            if(res.status === 200) {
                alert("Interest Rate submitted Successfully");
            }
        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
    }

    onChangeHandler = (e,prop) => {
        let property =  this.state.property
        let regex =/^\s*(?=.*[1-9])\d{1,2}(?:\.\d{1,2})?\s*$/ 
        let validation = this.state.validation
        let validationError = false;

        switch(prop){
            case 'GOLD': property.gold = e.target.value;
            if(!regex.test(e.target.value)){
                validation['gold'] = false
                validationError = true;
            }else{
                validation['gold'] = true
            }
                            break;
            case 'CAR': property.car = e.target.value;
            if(!regex.test(e.target.value)){
                validation['car'] = false
                validationError = true;
            }else{
                validation['car'] = true
            }
                            break;
            case 'PROPERTY AGAINST': property.propertyAgainst = e.target.value;
            if(!regex.test(e.target.value)){
                validation['propertyAgainst'] = false
                validationError = true;
            }else{
                validation['propertyAgainst'] = true
            }
                            break;
            case 'OTHER': property.other = e.target.value;
            if(!regex.test(e.target.value)){
                validation['other'] = false
                validationError = true;
            }else{
                validation['other'] = true
            }
                            break;
            case 'PENALTY': property.penalty = e.target.value;
            if(!regex.test(e.target.value)){
                validation['penalty'] = false
                validationError = true;
            }else{
                validation['penalty'] = true
            }
                            break;
        }

        this.setState({
            property,
            validationError
        })
    }



    render() {
        const stateOptions = [
            { key: "1", text: "Paid Emi", value: 1},
            { key: "2", text: "UnPaid Emi", value: 2},
        ]
        return(
            <div>
            <Row style={{ marginTop: '20px' }} >
                <Col className="col-first" style={{ margin: "5px 34px" }} >
                    <Paper className='mortgage-banner-front paper-info' zDepth={2} style={{ marginRight: '0px', padding: '20px', width: '100%', height: "200px", marginBottom: '10px' }}>
                    <h2 style={{textAlign:"center"}}>Interest Rate</h2>
                        <Row style={{marginTop:'45px'}}>
                            
                                <div className="configInput">
                                    <div className="configLevel" >
                                        Gold <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="lname" 
                                        style={{ borderColor: this.state.validation.gold!=undefined?this.state.validation.gold === false ? 'red' : '' :''}}
                                        placeholder="Interest" required value={this.state.property.gold} onChange={(e)=>this.onChangeHandler(e,'GOLD')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                        Car <sup style={{ color: 'red' }}>*</sup>:
                                    </div>
                                    <div className="ui input myinputDiv" >
                                        <input type="text" name=""
                                        style={{ borderColor: this.state.validation.car!=undefined?this.state.validation.car === false ? 'red' : '' :''}} 
                                        placeholder="Interest" required value={this.state.property.car} onChange={(e)=>this.onChangeHandler(e,'CAR')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                    Property <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="" 
                                        style={{ borderColor: this.state.validation.propertyAgainst!=undefined?this.state.validation.propertyAgainst === false ? 'red' : '' :''}}
                                        placeholder="Interest" required value={this.state.property.propertyAgainst} onChange={(e)=>this.onChangeHandler(e,'PROPERTY AGAINST')}/>
                                    </div>
                                </div>
                                <div className="configInput">
                                    <div className="configLevel">
                                    Penalty <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="" 
                                        style={{ borderColor: this.state.validation.penalty!=undefined?this.state.validation.penalty === false ? 'red' : '' :''}}
                                        placeholder="Interest" required value={this.state.property.penalty} onChange={(e)=>this.onChangeHandler(e,'PENALTY')}/>
                                    </div>
                                </div>
                                <div className="configInput">
                                    <div className="configLevel">
                                    Others <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="" 
                                        style={{ borderColor: this.state.validation.fname!=undefined?this.state.validation.fname === false ? 'red' : '' :''}}
                                        placeholder="Interest" required value={this.state.property.other} onChange={(e)=>this.onChangeHandler(e,'OTHER')}/>
                                    </div>
                                </div>
                                <div style={{marginTop:'auto'}}>
                                    <Button style={{ width: '80px', color: "white", backgroundColor: 'green' ,padding:'8px 18px'}} onClick={this.handleSubmit}> Submit</Button>
                                </div>
                            
                        </Row>
                    </Paper>
                </Col>
            </Row>
            {/* <Row style={{ marginTop: '20px' }} >
                <Col className="col-first" style={{ margin: "5px 34px" }} >
                    <Paper className='mortgage-banner-front paper-info' zDepth={2} style={{ marginRight: '0px', padding: '20px', width: '100%', height: "fit-content", marginBottom: '10px' }}>
                    <h2 style={{textAlign:"center"}}>Penalty Rate</h2>
                        <Row >
                            
                                <div className="configInput">
                                    <div className="configLevel" >
                                        Gold <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="lname" placeholder="Interest" required value={this.state.penalty.gold} onChange={(e)=>this.onChangeHandler2(e,'GOLD')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                        Car <sup style={{ color: 'red' }}>*</sup>:
                                    </div>
                                    <div className="ui input myinputDiv" >
                                        <input type="text" name="" placeholder="Interest" required value={this.state.penalty.car} onChange={(e)=>this.onChangeHandler2(e,'CAR')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                    Property <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="" placeholder="Interest" required value={this.state.penalty.propertyAgainst} onChange={(e)=>this.onChangeHandler2(e,'PROPERTY AGAINST')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                    Others <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="" placeholder="Interest" required value={this.state.penalty.other} onChange={(e)=>this.onChangeHandler2(e,'OTHER')}/>
                                    </div>
                                </div>
                                <div style={{marginTop:'auto'}}>
                                    <Button style={{ width: '80px', color: "white", backgroundColor: 'green' ,padding:'8px 18px'}} onClick={this.submitPenaltyConfig}> Submit</Button>
                                </div>
                            
                        </Row>
                    </Paper>
                </Col>
            </Row> */}
            </div>
        )
    }
}

export default Config;