import React, {
  Fragment
} from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import Landing from './components/landing/Landing'
import MyNavbar from './components/landing/Navbar'
import Mortgage from './components/mortgage/Mortgage'
import Preview from './components/mortgage/Preview'
import PaymentLoan from './components/payments/PaymentLoan'
import PaymentScheduler from './components/payments/PaymentScheduler'
import { history } from "../src/components/helpers/history"
import Config from './components/Config/Config'


const App = () => {
  return (

    <Router history={history}>
      <Fragment>
        <Switch>
          <Route exact path='/' render={() => <MyNavbar > <Landing /></MyNavbar>} />
          <Route exact path='/mortgage' render={() => <MyNavbar > <Mortgage /></MyNavbar>} />
          <Route exact path='/Preview' render={() => <MyNavbar > <Preview /></MyNavbar>} />
          <Route exact path='/paymentLoan' render={() => <MyNavbar > <PaymentLoan /></MyNavbar>} />
          <Route exact path='/paymentScheduler' render={() => <MyNavbar > <PaymentScheduler /></MyNavbar>} />
          <Route exact path='/config' render={() => <MyNavbar > <Config /></MyNavbar>} />
        </Switch>
      </Fragment>
    </Router>


  )

}



export default App;