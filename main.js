import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './src/remcoboard/common/login';
import Home from './src/remcoboard/common/home';
import Register from './src/remcoboard/common/register';
import ForgetPassword from './src/remcoboard/common/forgetPassword';
import ForgetPasswordReset from './src/remcoboard/common/forgetPasswordReset';
import CommiViewUpdate from './src/remcoboard/common/components/commissionViewUpdate';

import UserDashboard from './src/remcoboard/user/userDashboard';
import UserTransaction from './src/remcoboard/user/transaction';
import KycUpload from './src/remcoboard/user/kycUpload';
import CreateToken from './src/remcoboard/user/createToken';
import ViewToken from './src/remcoboard/user/viewToken';

import AdminDashboard from './src/remcoboard/admin/adminDashboard';
import RemitCompany from './src/remcoboard/admin/remittanceCompany';
import SuperAdmin from './src/remcoboard/admin/superAdmin';
import Commission from './src/remcoboard/admin/commission';
import ManageAdmin from './src/remcoboard/admin/manageAdmin';
import ManageToken from './src/remcoboard/admin/manageToken';
import Investor from './src/remcoboard/admin/investor';
import InvestorsList from './src/remcoboard/admin/investorList';
import Transaction from './src/remcoboard/admin/Transaction';
import InvestorsDue from './src/remcoboard/admin/investorDue';
import TransFee from './src/remcoboard/admin/transFee';
import CommissionList from './src/remcoboard/admin/commissionList';
import EditCommission from './src/remcoboard/admin/editCommission';

render(<BrowserRouter>
  <Switch>
    <Redirect exact path="/" to="/home" />
    <Route path="/home" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/forgotpassword" component={ForgetPassword} />
    <Route path="/forgotpasswordreset" component={ForgetPasswordReset} />
    <Route path="/viewcommission" component={CommiViewUpdate} />

    <Route path="/userdashboard" component={UserDashboard} />
    <Route path="/usertransaction" component={UserTransaction} />
    <Route path="/kycupload" component={KycUpload} />
    <Route path="/createtoken" component={CreateToken} />
    <Route path="/viewtoken" component={ViewToken} />

    <Route path="/admindashboard" component={AdminDashboard} />
    <Route path="/superadmin" component={SuperAdmin} />
    <Route path="/commission" component={Commission} />
    <Route path="/manageadmin" component={ManageAdmin} />
    <Route path="/managetoken" component={ManageToken} />
    <Route path="/remittancedetails" component={RemitCompany} />
    <Route path="/transaction" component={Transaction} />
    <Route path="/investor" component={Investor} />
    <Route path="/investorslist" component={InvestorsList} />
    <Route path="/investorsdue" component={InvestorsDue} />
    <Route path="/transactionfees" component={TransFee} />
    <Route path="/commissionlist" component={CommissionList} />
    <Route path="/editcommission" component={EditCommission} />
  </Switch>
</BrowserRouter>, document.getElementById('app'));
