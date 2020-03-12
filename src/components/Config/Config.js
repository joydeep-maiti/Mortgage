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
        }
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
    }

    submitInterestConfig = () => {
        axios.put(`${Data.url}/property/1`,this.state.property)
        .then(res => {
            console.log("submitInterestConfig data", res);
            if(res.status === 200) {
                alert("Interest Rate submitted Successfully");
            }
            // this.setState({
            //     errorBorder: ''
            // })
            // return res.data

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
                        <Row >
                            <Col className="same-row">
                                <div className="configInput">
                                    <div className="configLevel" >
                                    </div >
                                    <div className="ui input" style={{marginRight:"50px",width: "179px", textAlign:"center"}}>
                                        <label style={{marginLeft:"auto", marginRight:"auto",fontSize:"18px"}}>Interest Rate</label>
                                    </div>
                                    {/* <div className="ui input"  style={{marginRight:"50px",width: "179px", textAlign:"center"}}>
                                        <label style={{marginLeft:"auto", marginRight:"auto",fontSize:"18px"}}>Role</label>
                                    </div>
                                    <div className="ui input"  style={{marginRight:"50px",width: "179px", textAlign:"center"}}>
                                        <label style={{marginLeft:"auto", marginRight:"auto",fontSize:"18px"}}>Acess</label>
                                    </div> */}
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="same-row">
                                <div className="configInput">
                                    <div className="configLevel" >
                                        Gold <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input" style={{marginRight:"50px"}}>
                                        <input type="text" name="lname" placeholder="Interest" required value={this.state.property.gold} onChange={(e)=>this.onChangeHandler(e,'GOLD')}/>
                                        {/* <input type="text"
                                        style={{ borderColor: this.state.errorBorder ? this.state.errorBorder : '' }}
                                        name="fname" onChange={(e) => this.handleOnChange(e)}
                                        placeholder="firstName"
                                        defaultValue={this.state.user.fname && this.state.user.fname} required /> */}
                                    </div>
                                    {/* <div className="ui input"  style={{marginRight:"50px",width: "179px"}}>
                                        <input type="text" name="lname" placeholder="Interest" required value={this.state.property.gold} onChange={(e)=>this.onChangeHandler(e,'GOLD')}/>
                                    </div>
                                    <div className="ui input"  style={{marginRight:"50px",width: "179px"}}>
                                        <input type="text" name="lname" placeholder="Interest" required value={this.state.property.gold} onChange={(e)=>this.onChangeHandler(e,'GOLD')}/>
                                    </div> */}
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="same-row">
                                <div className="configInput">
                                    <div className="configLevel">
                                        Car <sup style={{ color: 'red' }}>*</sup>:
                                    </div>
                                    <div className="ui input" style={{marginRight:"50px"}}>
                                        <input type="text" name="" placeholder="Interest" required value={this.state.property.car} onChange={(e)=>this.onChangeHandler(e,'CAR')}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="same-row">
                                <div className="configInput">
                                    <div className="configLevel">
                                    Property Against <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input">
                                        <input type="text" name="" placeholder="Interest" required value={this.state.property.propertyAgainst} onChange={(e)=>this.onChangeHandler(e,'PROPERTY AGAINST')}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="same-row">
                                <div className="configInput">
                                    <div className="configLevel">
                                    Others <sup style={{ color: 'red' }}>*</sup>:
                                    </div >
                                    <div className="ui input">
                                        <input type="text" name="" placeholder="Interest" required value={this.state.property.other} onChange={(e)=>this.onChangeHandler(e,'OTHER')}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        
                        <Row >
                            <Col className="same-row">
                                <div className="configInput" style={{marginTop:30}}>
                                    {/* <div className="name-wd"> */}
                                    <Button style={{ width: '115px', color: "white", backgroundColor: 'green' ,padding:'8px 18px'}} onClick={this.handleSubmit}> Submit</Button>
                                    {/* </div > */}
                                    {/* <div className="ui input">
                                        
                                    </div> */}
                                </div>
                                
                            </Col>
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