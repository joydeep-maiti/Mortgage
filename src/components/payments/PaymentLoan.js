import React, { Component } from 'react'
import axios from 'axios'
import { Icon, Dropdown, Table, Modal } from 'semantic-ui-react'
import {Form, FormControl} from 'react-bootstrap'
import { Data } from '../../config'
import download from 'downloadjs';
class PaymentLoan extends React.Component {
  constructor() {
    super();
    this.state = {
      status: '',
      user: [],
      filteredApplication :[],
      open: false,
      currentData: []
    }
  }

  componentWillMount() {
    // debugger
    // console.log(this.state.reqId, "khjkhj.kdjhskdhcskhcskdhjkk")
    axios.get(`${Data.url}/users/`, )
      .then(res => {
        console.log("------------------Applications",res.data)
        if(res.status === 200){
          this.setState({
            user: res.data,
            filteredApplication: res.data
          })
        }
      })
      .catch(e => {
        throw new Error(e.response.data);
      });
  }

  searchKey = (e) => {
    console.log("hello", e.target.value)
    let val = e.target.value
    if(val == ""){
      this.setState({
        search: val,
        filteredApplication : this.state.user
    })
    }
    this.setState({
        search: val
    },
    ()=>this.fetchKey()
    )

  }

  handleKeyPress = (event) => {
    console.log("---------------In Key press", event)
    if (event.key == 'Enter') {
        event.preventDefault();
        console.log("----------")
        this.fetchKey();
    }
  }

  fetchKey = ()=> {
    console.log("------STATE", this.state)
    if (this.state.search !== '') {

        if (this.state.user !== undefined) {
            let id = `Req${('000000' + this.state.search).slice(-5)}`;
            let filteredApplication = []
            this.state.user.map((el, i)=> {
              console.log("-------App",el,el.id)
              if(el.id === id){
                filteredApplication.push(el);
              }
            })
            console.log("------filteredApplication",filteredApplication)
            this.setState({
              filteredApplication
            })
        }
    }
  }

  async componentWillReceiveProps(userUpdate) {
    let id = userUpdate.id
    let body = userUpdate;
    const res = await axios.patch(`${Data.url}/users/${id}`, body)
      .then(res => {
        console.log(res.data, "patched")

        // this.setState({
        //   status:
        // })

      })
      .catch(e => {
        throw new Error(e.response.data);
      });




    return res;

  }
  close = () => this.setState({ open: false })
  handleStatus = (value, i, user) => {
    // debugger
    console.log(value, i, user)
    let userUpdate = { ...this.state.user[i], status: value }
    console.log(userUpdate, "uhiuhh")
    this.setState({
      status: value,
      open: true,
      currentData: { ...user }


    }, () => console.log(this.state.status, "ttttt"))

    this.componentWillReceiveProps(userUpdate)

  }
  async download(reqId, fileName) {
    debugger
    const res = await fetch(`${Data.url}/download?reqid=${reqId}&fileName=${fileName}`);
    const blob = await res.blob();
    download(blob, fileName);

  }

  render() {
    console.log(this.state.status)
    const { open } = this.state;
    const status = [
      {
        key: 'Pending',
        text: 'Pending',
        value: 'Pending'
      },
      {
        key: 'Approved',
        text: 'Approved',
        value: 'Approved'
      },
      {
        key: 'Other',
        text: 'Other',
        value: 'Other'
      },
    ]
    let modal = (
      <div >
        <Modal size='tiny' open={open} onClose={this.close} closeOnDimmerClick={false} className="modalEdit" style={{ marginTop: '150px', marginLeft: '30%' }} closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}>
          <Modal.Header>are you sure want to Approve ?</Modal.Header>
          <Modal.Content>
            <div className="name-space">
              <div className="name-wd" >
                Intrest Rate :
              </div >
            </div>
            <div className="name-space">
              <div className="name-wd" >
                Principal :
              </div >
            </div>
            <div className="name-space">
              <div className="name-wd" >
                Tenure:
              </div >
            </div>
          </Modal.Content>
          <Modal.Actions>
          </Modal.Actions>
        </Modal>
      </div>
    )
    return (
      <div className="head-m" style={{ backgroundColor: '#f5f6fa', paddingBottom: '45px', marginTop: '0px' }}>
        {/* <div style={{textAlign:"center"}}> */}
          <h2 style={{textAlign:"center", padding:"20px"}}>Loan Applications</h2>
          <Form inline  style={{ float: 'right', marginRight:"20px", marginBottom:"20px"}}>
                Search:
                  <FormControl type="text" placeholder="Request Number...." className="mr-sm-2" ref={el => this.search = el} style={{ marginLeft: '20px'}}
                  onChange={(e) => this.searchKey(e)} value={this.state.search} onKeyPress={this.handleKeyPress} />
              {/* <Icon size="large" inverted name='search' className="searchIcon" color='black' link onClick={() => this.fetchKey()} /> */}
          </Form>
        {/* </div> */}
        <br/>
        <Table striped >
          <Table.Header>
            <Table.Row >
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>ReqId</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>PropertyType</Table.HeaderCell>
              <Table.HeaderCell>Princiapl</Table.HeaderCell>
              <Table.HeaderCell>Tenure</Table.HeaderCell>
              <Table.HeaderCell>Intrest</Table.HeaderCell>
              <Table.HeaderCell>Start Date</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Documents</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body >
            {this.state.filteredApplication && this.state.filteredApplication.map((user, i) => {
              return <Table.Row key={i} >
                <Table.Cell>{i + 1}</Table.Cell>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell>{user.user.fname}</Table.Cell>
                <Table.Cell>{user.expLoans.propertyType}</Table.Cell>
                <Table.Cell>{user.expLoans.principle}</Table.Cell>
                <Table.Cell>{user.expLoans.tenure}</Table.Cell>
                <Table.Cell>{user.expLoans.intrest}</Table.Cell>
                <Table.Cell>{user.expLoans.startDate}</Table.Cell>
                {/* <Table.Cell>{user.status}</Table.Cell> */}
                <Table.Cell>

                  <Dropdown search key={i}
                    onChange={(e, data) => { this.handleStatus(data.value, i, user) } }
                    options={status}
                    placeholder='select'
                    selection={true}
                    defaultValue={user.status ? user.status : ''}
                    disabled={user.status == 'Approved'}
                    />
                </Table.Cell>
                <Table.Cell>
                  {
                    user.totalProperty.map((total, key) => {
                      return (<div>
                        <p key={key}>
                          <a href="javascript:;" onClick={() => this.download(user.id, (total.file1 ? total.file1.name : ''))}>{total.file1 ? total.file1.name : ''}</a> ,

                      </p>
                        <p>
                          <a href="javascript:;" onClick={() => this.download(user.id, (total.file2 ? total.file2.name : ''))}>{total.file2 ? total.file2.name : ''}</a>,
                      </p>
                        <p>
                          <a href="javascript:;" onClick={() => this.download(user.id, (total.file3 ? total.file3.name : ''))}>{total.file3 ? total.file3.name : ''}</a>
                        </p>
                      </div>
                      )
                    })
                  }
                </Table.Cell>
                {/* {console.log(user.totalProperty.map(property => { property }), "tpotal property ......")} */}
              </Table.Row>

            })}

          </Table.Body>
        </Table>
        {modal}
      </div >

    )
  }

}

export default PaymentLoan;