import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import Currency from '../common/custCurrency';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';
import CustTable from '../common/custTable';

export default class CreateToken extends Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    console.log(sessionInfo.loginInfo)
    this.state = {
      token: sessionInfo.loginInfo.token,
      role: sessionInfo.loginInfo.role,
      currencyValue: '',
      tokenValue: '',
      isTokenValueValid: false,
      isNoOfTokenValid: false,
      isLoading: false,
      currencyValueError: '',
      noOfToken: '',
      tokenList: '',
      page: 1,
      // searchString: '',
      errors: {}
    }
  }

  onCurrencyTypeCHange = (currencyValue) => {
    if (currencyValue === '') {
      this.setState({ currencyValue, currencyValueError: 'Please select currency type' });
    } else this.setState({ currencyValue, currencyValueError: '' });
  }
  handleChange = (e) => {
    console.log('val', e.target.value)
    console.log('name', e.target.name)
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    console.log(value, 'value')
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
      case 'tokenValue':
        this.state.isTokenValueValid = !validator.isEmpty(value) && validator.isNumeric(value);
        fieldValidationErrors.tokenValue = this.state.isTokenValueValid ? '' : 'Please enter valid token value.';
        break;
      case 'noOfToken':
        this.state.isNoOfTokenValid = !validator.isEmpty(value) && validator.isNumeric(value);
        fieldValidationErrors.noOfToken = this.state.isNoOfTokenValid ? '' : 'Please enter valid no of tokens.';
        break;
      default:
        break;
    }
    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }

  validateForm() {
    this.setState({
      formValid: this.state.isNoOfTokenValid &&
        this.state.isTokenValueValid
    })
  }

  handlePageChange = (page) => {
    console.log('pageno', page)
    this.setState({ page })
  }

  createToken = () => {
    const api_url = base_url + 'user/create/token';
    const payLoad = {
      'numberOfTokens': this.state.noOfToken,
      'tokenCurrency': this.state.currencyValue,
      'tokenValue': this.state.tokenValue
    }
    this.setState({ isLoading: true });
    console.log('payload', payLoad)
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        notify.show(response.data.message, 'success');
        this.setState({ tokenValue: '', noOfToken: '', currencyValue: '', tokenList: response.data.tokenDTO });
      } else if (response.status === 206 && response.data.message === 'Session expired') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
        notify.show(response.data.message, 'error');
      } else if (response.status === 206) {
        notify.show(response.data.message, 'error');
      }
    }).catch(error => {
      console.log('error props', this.props);
      if (error.response.status == 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, "error")
      }
    });
  }

  tableHead = ['Controll No', 'Token Number', 'Serial Number', 'Token Address', 'Currency Type', 'Token Value'];

  render() {
    console.log('createtoken state', this.state);
    const { tokenValue, noOfToken, role, formValid, errors, currencyValue, currencyValueError, tokenList, searchString, page } = this.state;
    return (
      <div>
        {
          this.state.isLoading && <div className="loaderBg">
            <div className="loaderimg">
              <SyncLoader
                color={'#0f99dd'}
                loading={this.state.isLoading}
              /></div>
          </div>
        }
        <Notifications />
        <div className="cbp-spmenu-push">
          <SideMenu propsRole={role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="commission-form mtop0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12 col-xs-12 mobilepadd">
                    <div className="commission-body">
                      <form>
                        <h1 className="tokenCreationIcon">Token Creation</h1>
                        <div className="persional-info-form">
                          <div className="tokencreationrow">
                            <div className="row">
                              <div className="remco-lg-3 mobilepadd">
                                <div className="form-group">
                                  <label>Currency Type
                                    <sup>*</sup>
                                  </label>
                                  <div className="currency pos-relative">
                                    <Currency currencyValue={this.state.currencyValue} onChange={this.onCurrencyTypeCHange} />
                                    <span className="error">{currencyValueError}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="remco-lg-3 mobilepadd">
                                <div className="form-group">
                                  <label>Token Value
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="100" name='tokenValue' onChange={this.handleChange} value={tokenValue} />
                                  <span className="error">{errors.tokenValue}</span>
                                </div>
                              </div>
                              <div className="remco-lg-3 mobilepadd">
                                <div className="form-group">
                                  <label>Number Of Tokens
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="100" name='noOfToken' onChange={this.handleChange} value={noOfToken} />
                                  <span className="error">{errors.noOfToken}</span>
                                </div>
                              </div>
                              <div className="remco-smal-3 mobilepadd">
                                <div className="form-group">
                                  <button type="button" className="creattoken" onClick={this.createToken} disabled={!(formValid && currencyValue !== '')}>Create</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h1 className="exporttable">Exportable Table</h1>
                        <div className="persional-info-form">
                          <div className="export-search">
                            {!(tokenList === '') && <div className="export-button">
                              <ReactHTMLTableToExcel
                                id="excelExportBtn"
                                className="excel-btn"
                                table="remcoExport"
                                filename="Token Details"
                                sheet="Token Details"
                                buttonText="Export As Excel" />
                            </div>}
                            <CustSearch tokenList={tokenList} tableHead={this.tableHead}
                              page={page} perPage={2} isCreateToken handlePageChange={this.handlePageChange} />
                            <div className="clearfix"></div>
                          </div>
                        </div>
                      </form>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
