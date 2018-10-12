import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';
import _map from 'lodash/map';
import validator from 'validator';
import moment from 'moment';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustTable from '../common/custTable';

export default class InvestorsDue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      investorsList: [],
      investors: [],
      investorName: '',
      fromDate: '',
      toDate: '',
      page: 1,
      errors: {},
      isInvestorNameValid: false,
      isFromDateValid: false,
      isToDateValid: false,
      isFormValid: false,
      role: '',
      token: ''
    };
    // Check authorized or not
    if (sessionStorage.getItem('loginInfo') == null) {
      props.history.push('/login');
    }
  }
  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
    }
  }
  componentDidMount() {
    // API request for investor list
    const api_url = base_url + 'admin/list/investor';
    this.setState({ isLoading: true });
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ investors: response.data.investorList });
      } else if (response.status === 206 && response.data.message === 'Page Session has expired. Please login again') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
        notify.show(response.data.message, 'error');
      } else if (response.status === 206) {
        notify.show(response.data.message, 'error');
      }
    }).catch(error => {
      if (error.response.status === 401 && error.response.data.message === 'Auth token wrong') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
      } else if (error.response.status === 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      } else {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      }
    });
  }

  getInvestorsDue = () => {
    // API request for investorDue amount list between selected date
    const api_url = base_url + 'admin/investor/percentage/list';
    this.setState({ isLoading: true });
    const payLoad = {
      'investorName': this.state.investorName,
      'fromDate': moment(this.state.fromDate).format('L'),
      'toDate': moment(this.state.toDate).format('L')
    }
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ investorsList: response.data.investorDTO });
      } else if (response.status === 206 && response.data.message === 'Page Session has expired. Please login again') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
        notify.show(response.data.message, 'error');
      } else if (response.status === 206) {
        notify.show(response.data.message, 'error');
      }
    }).catch(error => {
      if (error.response.status == 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      } else {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      }
    });
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
      case 'investorName':
        this.state.isInvestorNameValid = !validator.isEmpty(value);
        fieldValidationErrors.investorName = this.state.isInvestorNameValid ? '' : 'Please select valid investor name.';
        break;
      case 'fromDate':
        this.state.isFromDateValid = !validator.isEmpty(value);
        fieldValidationErrors.fromDate = this.state.isFromDateValid ? '' : 'Please select valid from date.';
        this.state.isToDateValid = !validator.isEmpty(this.state.toDate) && (new Date(value).getTime() < new Date(this.state.toDate).getTime());
        fieldValidationErrors.toDate = this.state.isToDateValid ? '' : 'Please select valid to date.';
        break;
      case 'toDate':
        this.state.isToDateValid = !validator.isEmpty(value) && (new Date(this.state.fromDate).getTime() < new Date(value).getTime());
        fieldValidationErrors.toDate = this.state.isToDateValid ? '' : 'Please select valid to date.';
        break;
      default:
        break;
    }
    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }

  validateForm() {
    this.setState({
      isFormValid:
        this.state.isInvestorNameValid &&
        this.state.isFromDateValid &&
        this.state.isToDateValid
    })
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }

  tableHead = ['S.No', 'Date', 'Token Number', 'Remittance Company', 'City', 'IP Address', 'Total Fees Amount',
    'Commistion Percentage', 'Amount'];

  render() {
    const { isLoading, investorsList, investors, page, isFormValid, errors, toDate, fromDate, role } = this.state;
    return (
      <div>
        {
          isLoading && <div className="loaderBg">
            <div className="loaderimg">
              <SyncLoader
                color={'#0f99dd'}
                loading={isLoading}
              /></div>
          </div>
        }
        <Notifications />
        <div className="cbp-spmenu-push">
          <SideMenu propsRole={role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="dashboard-title">
                <h1>Investors Due Amount</h1>
              </div>
              <div className="investorAmout">
                <div className="selectInvestor">
                  <div className="selecbox-due">
                    <label>Select From Investor List</label>
                    <div className="slctbox">
                      <select value={this.state.investorName} name='investorName' onChange={this.handleChange}>
                        <option value="">--Select Investor--</option>
                        {_map(investors,
                          (items, i) => (
                            <Fragment key={i}>
                              <option value={items.emailId}>{items.emailId} </option>
                            </Fragment>
                          ))}
                      </select>
                      <span className="error">{errors.investorName}</span>
                    </div>
                  </div>
                </div>
                <div className="investor-datepick">
                  <div className="datepicker-right">
                    <div className="date-pick pos-relative">
                      <div className="form-group">
                        <label>From Date</label>
                        <input type="date" name='fromDate' value={fromDate} max="9999-12-31" placeholder="18-07-2018" onChange={this.handleChange} />
                        <span className="error">{errors.fromDate}</span>
                      </div>
                    </div>
                    <div className="date-pick pos-relative">
                      <div className="form-group">
                        <label>End Date</label>
                        <input type="date" name='toDate' value={toDate} max="9999-12-31" placeholder="18-07-2018" onChange={this.handleChange} />
                        <span className="error">{errors.toDate}</span>
                      </div>
                    </div>
                    <div className="date-pick1 pos-relative mright0">
                      <button type="button" className="investorSubmit" disabled={!isFormValid} onClick={this.getInvestorsDue}>Submit</button>
                    </div>
                  </div>
                </div>
              </div>
              <CustTable tokenList={investorsList} tableHead={this.tableHead}
                page={page} perPage={10} isInvestorsDue handlePageChange={this.handlePageChange} />
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
