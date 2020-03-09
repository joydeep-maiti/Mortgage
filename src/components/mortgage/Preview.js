import React,{Component} from 'react'
import { Paper } from '@material-ui/core'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { Data } from '../../config'




    class Preview extends React.Component{
        constructor(props){
            super();
this.state={
    user:{}
}
        }


        async componentWillMount() {
            let id =localStorage.getItem("ReqId");
            console.log(this.state.reqId,"khjkhj.kdjhskdhcskhcskdhjkk")
                const res = await axios.get(`${Data.url}/users/${id}`, )
                    .then(res => {
                        console.log(res.data, "datakdhjskdjhsdjkhsdhjk")
                        this.setState({
                            user:res.data
                        },()=>console.log(this.state.user,"-------------------"))
         
                       
        
                    })
                    .catch(e => {
                        throw new Error(e.response.data);
                    });
        
                
        
               
               localStorage.removeItem("ReqId");
            return res;
        }
        render(){
            console.log(this.state.reqId,"khjkhjk")
            return (
                <div style={{ backgroundColor: '#f5f6fa', paddingBottom: '75px', paddingTop: '25px',marginTop: '0px' }}>
        
                    <Paper style={{ marginRight: '0px', padding: '15px', width: '97%', height: "fit-content", marginBottom: '10px', marginLeft: '18px' }}>
                        <h2>Preview Loan</h2>
                        <div style={{ backgroundColor: "white", width: "94.5%", margin: "30px" }}>
                            <div style={{ display: "flex", flexDirection: "column", width: '100%' }}>
                                <p className='my-financials-preview'> Your Online Agreement in Principle(AIP) </p>
                                {/* <p className="my-financials-subtitle">Valid until 17 November 2019</p> */}
                                <div className="my-financials-container">
                                    <div className="my-financials-first" style={{ marginTop: "1%" }}>
                                        <p className="my-financials-paragraph">Your reference number is <span style={{ color: "black", fontWeight: "bold", fontSize: "20px", paddingLeft: "1%" }}>{this.state.user.id}</span></p>
                                        <p className="my-financials-bold">It looks like we could help</p>
                                        <p className="my-financials-paragraph" style={{ marginTop: "0px" }}>Based on the selected Asset for Collateral, you could borrow upto <span style={{ paddingLeft: "1%" }} className="my-financials-eligible"> 65000</span></p>
                                        {/* <p className="my-financials-eligible" ></p> */}
                                        <div>
                                            <p className="my-financials-paragraph" style={{ marginTop: "10px" }}> Based on the total Asset, you could borrow up to <span style={{ fontSize: "25px", color: "black", paddingLeft: "1%" }}>85000</span></p>
                                            <p className="my-financials-paragraph">This Agreement in Principle is based on a maximum term of <span style={{ color: "black" }}>10 years</span></p>
                                        </div>
        
                                    </div>
                                    <div className="my-financials-second">
        
                                        <p className="my-financials-paragraph">With a shorter term,you may pay more monthly and less interest overall</p>
                                        <p className="my-financials-paragraph">When you're ready to apply,one of our mortgage advisors will recommend a mortgage thats right for you.</p>
                                        {/* <hr></hr>
                     <p style={{marginTop:'13%',fontSize:'14px'}}>A copy of your Agreement in Principle has been sent to your email </p> */}
        
                                    </div>
        
        
                                </div>
                                <div className="my-financials-container" style={{ display: "block" }}>
                                    <div><p className="my-financials-bold"> How would you like to continue?</p></div>
                                    <div id="my-financials-paragraph" className="my-financials-paragraph" >
        
                                        <div className="accordian card" style={{ margin: "1%", height: "max-content" }}>
                                            <div className="cardHeader" >
                                                <div id="accordians">
                                                    <p className="online" style={{ padding: "10px" }}>Branch</p>
        
        
                                                </div>
        
                                                <div className="card-body" style={{ padding: '0 2% 3% 2%' }}>
                                                    <p>Continue your application in branch with one of our mortgage advisers, who will be able to recommend a suitable mortgage, term and interest rate.You can book appointment using the  button below or by visiting us in branch.
                                                    </p>
                                                </div>
                                            </div>
        
        
                                        </div>
                                        <div className="accordian card" style={{ margin: "1%", height: "max-content" }}>
                                            <div className="cardHeader" >
                                                <div id="accordians">
                                                    <p className="online" style={{ padding: "10px" }}>By Phone</p>
        
        
                                                </div>
        
                                                <div className="card-body" style={{ padding: '0 2% 3% 2%' }}>
                                                    <p>Continue your application by phone with one of our mortgage advisers, who will be able to recommend a suitable mortgage, term and interest rate.
        
                                      Call us on 0800 783 3534
                                      Monday to Friday 8am-8pm, and Saturday 9am-2pm.
        </p>
        
        
                                                </div>
                                            </div>
        
        
                                        </div>
        
        
                                    </div>
        
        
        
        
                                </div>
                            </div>
                        </div>
                    </Paper>
                    <div>
                        <Button style={{ float: 'right', marginRight: '35px', backgroundColor: 'green', borderColor: 'green' }} href='/' >Back to Home</Button>
                    </div>
        
                </div>
            )
        }
   
}

export default Preview;