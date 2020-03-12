import React, { Component} from 'react'
import './style.css'
import { Icon,Dropdown } from 'semantic-ui-react'
import { Button} from 'react-bootstrap'
import axios from 'axios'
import { Data } from '../../config'
import Usertable from './UsersTable'

class UserManagament extends Component  {
    state= {
        username: "",
        userrole: 1,
        roles:[
            { key: "1", text: "User", value: 1},
            { key: "2", text: "Admin", value: 2},
            { key: "3", text: "Approver L1", value: 3},
            { key: "4", text: "Approver L2", value: 4},
            { key: "5", text: "Authorizer", value: 5}
        ],
        userArray:[],
        editDisable:{}
        // editDisable : true
    }

    componentWillMount = () => {
        axios.get(`${Data.url}/user`)
        .then(res => {
            console.log("gettingUserData data", res);
            if(res.status === 200){
                this.setState({
                    userArray: res.data.sort((a,b)=>b.id-a.id)
                })
            }
        })
        .catch(e => {
            window.alert("data not getting")
        });
    }

    handleOnChange = (e,data,sel) => {
        
        const val = e.target.value;
        let currentState = this.state;
        console.log("-------------------- EVENT",val,sel)
        switch(sel) {
            case "uname": currentState.username = val;
                            break;
            case "urole": currentState.userrole = data.value;
        }
        this.setState({
            currentState
        },
        ()=>console.log(this.state, currentState)
        )

    }

    onAddClick = () => {
        const state = this.state;
        if(state.username=="" || state.username==null ||state.userrole=="" || state.userrole==null ){
            alert("All Fields are required");
        }else {
            this.addUserWithRole();
        }
    }

    addUserWithRole = () => {
        const userdata = {
            username : this.state.username,
            userrole : this.state.roles[this.state.userrole-1].text 
        }
        const self = this;
        axios.post(`${Data.url}/user`, userdata)
        .then(res => {
            console.log("push User", res);
            if(res.status === 201){
                this.componentWillMount();
            }
        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
    }

    handleRoleEdit = (i) => {
        const editDisable = this.state.editDisable;
        editDisable[i] = false
        this.setState({
            editDisable : editDisable
        },
        ()=> console.log("------STATE", this.state)
        )
    }

    handleRoleUpdate = (i,userId,userData) => {
        // console.log("----Update Data", i,userId,userData)
        const editDisable = this.state.editDisable;
        axios.put(`${Data.url}/user/${userId}`, userData)
        .then(res => {
            console.log("-----Update User", res);
            if(res.status === 200){
                editDisable[i] = true
                this.setState({
                    editDisable : editDisable
                },
                ()=> this.componentWillMount()
                )
            }
        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
        
    }

    handleUserDelete = (userId) => {
        // console.log("----Update Data", i,userId,userData)
        const editDisable = this.state.editDisable;
        axios.delete(`${Data.url}/user/${userId}`)
        .then(res => {
            console.log("-----Delete User", res);
            if(res.status === 200){
                this.componentWillMount();
            }
        })
        .catch(e => {
            // throw new Error(e.response.data);
            window.alert("data not getting")
        });
        
    }

    render(){
        const stateOptions = this.state.roles
        return(
            <div>
                <h2 style={{textAlign:"center"}}>User Managament</h2>
                <br/>
                <h4 style={{marginLeft:"50px"}}>Add User</h4>
                <br/>

                <div className="userlevel2 ">
                    <div className="configLevel2 userlevel">
                    Username <sup style={{ color: 'red' }}>*</sup>:
                    </div >
                    <div className="ui input userlevel">
                        <input type="text" name="" placeholder="username" required onChange={(e,data) => this.handleOnChange(e,data,"uname")} value={this.state.username}/>
                    </div>
                </div>
                <div className="userlevel2">
                    <div className="configLevel2 userlevel">
                    Role <sup style={{ color: 'red' }}>*</sup>:
                    </div >
                    <div className="ui input userlevel" >
                        <Dropdown placeholder='role' search selection options={stateOptions} onChange={(e,data) => this.handleOnChange(e,data,"urole")} defaultValue={this.state.userrole} required/>
                    </div>
                </div>
                <div className="userlevel2">
                    <div className="configLevel2 userlevel">
                        <Button style={{ width: '60px', color: "white", backgroundColor: 'green',padding: '8px 10px', marginTop:"-3px" }} onClick={this.onAddClick}>Add</Button>
                    </div>
                </div>
                <br/><br/>
                <Usertable userArray={this.state.userArray} editDisable={this.state.editDisable} handleRoleEdit={(i)=>this.handleRoleEdit(i)} handleRoleUpdate={(i,userId,userData)=>this.handleRoleUpdate(i,userId,userData)} handleUserDelete={(userId)=>this.handleUserDelete(userId)}/>
                
            </div>
        )
    }
}

export default UserManagament;
