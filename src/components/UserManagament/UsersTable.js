import React from 'react';
import { Icon, Dropdown, Table, Modal } from 'semantic-ui-react'

import './table.css'

const usersTable = (props)=> {
    console.log("-----PROPS", props.editDisable);
    const users = props.userArray;
    const roles = [
        
        { key: "1", text: "User", value: "User"},
        { key: "2", text: "Admin", value: "Admin"},
        { key: "3", text: "Approver L1", value: "Approver L1"},
        { key: "4", text: "Approver L2", value: "Approver L2"},
        { key: "5", text: "Authorizer", value: "Authorizer"}
    ]

    let changedUsers = []
    const handleRoleChange = (user, data) => {
        // console.log("---", user, data);
      let userdata = user;
      userdata.userrole = data.value;
      changedUsers[userdata.id] = userdata;
        // console.log("------changedUsers", changedUsers);
    }

    const handleRoleEdit = (index) => {
      props.handleRoleEdit(index);
    }

    const handleRoleUpdate = (index, userId) => {
      props.handleRoleUpdate(index, userId,changedUsers[userId]);
    }

    const handleUserDelete = (userId) => {
      props.handleUserDelete(userId);
    }

    return (
        <Table striped >
          <Table.Header>
            <Table.Row >
              <Table.HeaderCell width={50}>#</Table.HeaderCell>
              {/* <Table.HeaderCell>UserId</Table.HeaderCell> */}
              <Table.HeaderCell width={150}>Username</Table.HeaderCell>
              <Table.HeaderCell width={100}>Role</Table.HeaderCell>
              <Table.HeaderCell width={50}>Update</Table.HeaderCell>
              <Table.HeaderCell width={50}>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body >
            {users && users.map((user, i) => {
              console.log("---In table", props.editDisable[i]);
              return <Table.Row key={i} >
                <Table.Cell width={200}>{i + 1}</Table.Cell>
                {/* <Table.Cell>{user.id}</Table.Cell> */}
                <Table.Cell width={250}>{user.username}</Table.Cell>
                <Table.Cell width={280}>
                  <Dropdown search key={i}
                    style={{lineHeight:"1.3rem", padding:"2px 5px", minHeight: 0}}
                    onChange={(e, data) => handleRoleChange(user,data)}
                    options={roles}
                    placeholder= "Role"
                    selection={true}
                    defaultValue={user.userrole}
                    disabled={props.editDisable[i] === false ? false : true}
                    // disabled={props.editDisable}
                    />
                    {/* <Dropdown placeholder='role' search selection options={stateOptions} onChange={(e,data) => this.handleOnChange(e,data,"urole")} defaultValue={this.state.userrole} required/> */}
                </Table.Cell>
                <Table.Cell width={220}>
                  {props.editDisable[i] === false ?<button onClick={()=>handleRoleUpdate(i,user.id)}>Update</button>:<button onClick={()=>handleRoleEdit(i)}>Edit</button>}
                </Table.Cell>
                <Table.Cell width={220}>
                  <button onClick={()=>handleUserDelete(user.id)}>Delete</button>
                </Table.Cell>
              </Table.Row>

            })}

          </Table.Body>
        </Table>
    )
}

export default usersTable;