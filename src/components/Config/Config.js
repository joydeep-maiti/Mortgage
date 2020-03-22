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
            id: 3
        },
        penalty: {
            gold: 8.5,
            car: 9,
            propertyAgainst : 10.5,
            other: 11,
            id: 3
        },
    } 

    handleSubmit = () => {
        // submit data
        this.submitInterestConfig();
    }

    componentWillMount = () => {
        axios.get(`${Data.url}/property/1`)
        .then(res => {
            console.log("submitInterestConfig data", res);
            this.setState({
                property: res.data
            })

        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
        axios.get(`${Data.url}/penalty/1`)
        .then(res => {
            console.log("submitInterestConfig data", res);
            this.setState({
                penalty: res.data
            })

        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
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

    submitPenaltyConfig = () => {
        axios.put(`${Data.url}/penalty/1`,this.state.penalty)
        .then(res => {
            console.log("submitpenaltyConfig data", res);
            if(res.status === 200) {
                alert("Penalty Rate submitted Successfully");
            }
        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
    }

    onChangeHandler = (e,prop) => {
        let property =  this.state.property
        
        switch(prop){
            case 'GOLD': property.gold = e.target.value;
                            break;
            case 'CAR': property.car = e.target.value;
                            break;
            case 'PROPERTY AGAINST': property.propertyAgainst = e.target.value;
                            break;
            case 'OTHER': property.other = e.target.value;
                            break;
        }

        this.setState({
            property
        })
    }

    onChangeHandler2 = (e,prop) => {
        let penalty =  this.state.penalty
        
        switch(prop){
            case 'GOLD': penalty.gold = e.target.value;
                            break;
            case 'CAR': penalty.car = e.target.value;
                            break;
            case 'PROPERTY AGAINST': penalty.propertyAgainst = e.target.value;
                            break;
            case 'OTHER': penalty.other = e.target.value;
                            break;
        }

        this.setState({
            penalty
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
                    <Paper className='mortgage-banner-front paper-info' zDepth={2} style={{ marginRight: '0px', padding: '20px', width: '100%', height: "fit-content", marginBottom: '10px' }}>
                    <h2 style={{textAlign:"center"}}>Interest Rate</h2>
                        <Row >
                            
                                <div className="configInput">
                                    <div className="configLevel" >
                                        Gold <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="lname" placeholder="Interest" required value={this.state.property.gold} onChange={(e)=>this.onChangeHandler(e,'GOLD')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                        Car <sup style={{ color: 'red' }}>*</sup>:
                                    </div>
                                    <div className="ui input myinputDiv" >
                                        <input type="text" name="" placeholder="Interest" required value={this.state.property.car} onChange={(e)=>this.onChangeHandler(e,'CAR')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                    Property <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="" placeholder="Interest" required value={this.state.property.propertyAgainst} onChange={(e)=>this.onChangeHandler(e,'PROPERTY AGAINST')}/>
                                    </div>
                                </div>
                            
                                <div className="configInput">
                                    <div className="configLevel">
                                    Others <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input myinputDiv">
                                        <input type="text" name="" placeholder="Interest" required value={this.state.property.other} onChange={(e)=>this.onChangeHandler(e,'OTHER')}/>
                                    </div>
                                </div>
                                <div style={{marginTop:'auto'}}>
                                    <Button style={{ width: '80px', color: "white", backgroundColor: 'green' ,padding:'8px 18px'}} onClick={this.handleSubmit}> Submit</Button>
                                </div>
                            
                        </Row>
                    </Paper>
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }} >
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
            </Row>
            <Row style={{ marginTop: '20px' }} >
                <Col className="col-first" style={{ margin: "5px 34px" }} >
                    <Paper className='mortgage-banner-front paper-info' zDepth={2} style={{ marginRight: '0px', padding: '20px', width: '100%', height: "fit-content", marginBottom: '10px' }}>
                        <UserManagament/>
                    </Paper>
                </Col>
            </Row>
            </div>
        )
    }
}

export default Config;