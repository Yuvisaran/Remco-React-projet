import React, { Component } from 'react';
import axios from 'axios';
import Notifications, { notify } from 'react-notify-toast';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _flattenDepth from 'lodash/flattenDepth';
import { SyncLoader } from 'react-spinners';
import validator from 'validator';

import CustSearch from '../common/custSearch';
import { base_url } from '../common/apiUrl';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';

export default class RemitCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      role: '',
      remitCompList: [],
      remitViewList: [],
      page: 1,
      isRemitCompListView: false,
      isLoading: false,
      isReject: false,
      Rejected: '',
      RejectedValid: false,
      errors: []
    }
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
    this.getKycList();
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }

  viewRemitCompany = (items) => {
    this.setState({ isRemitCompListView: true, remitViewList: items })
  }

  getKycList = () => {
    // API request for remittence registration list
    const api_url = base_url + 'admin/list/AllUserDetails';
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      if (response.status === 200) {
        let remitCompList = [];
        let penList = _filter(response.data.kycList, { 'kycStatus': 'Pending' });
        remitCompList.push(penList);
        let approveList = _filter(response.data.kycList, { 'kycStatus': 'Approved' });
        remitCompList.push(approveList);
        let rejeList = _filter(response.data.kycList, { 'kycStatus': 'Rejected' });
        remitCompList.push(rejeList);
        let yetapplyList = _filter(response.data.kycList, { 'status': 'Yet to Apply' });
        remitCompList.push(yetapplyList);
        let sortedList = _flattenDepth(remitCompList, 4);
        this.setState({ remitCompList: sortedList });
      } else if (response.data.message === 'Page Session has expired. Please login again') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
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

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
      case 'Rejected':
        this.state.RejectedValid = !validator.isEmpty(value);
        fieldValidationErrors.Rejected = this.state.RejectedValid ? '' : 'Please enter valid reason.';
        break;
      default:
        break;
    }
    this.setState({ errors: fieldValidationErrors });
  }

  statusColor = (status) => {
    switch (status) {
      case ('Pending'):
        return 'btn-pend pending';
      case ('Approved'):
        return 'btn-pend approved';
      case ('Rejected'):
        return 'btn-pend rejected';
    }
  }

  clickRemitStatus = (e, id) => {
    // API request for change remittence registration status
    const api_url = base_url + 'admin/update/kycstatus';
    const payLoad = {
      'id': id,
      'kycStatus': e.target.name,
      'reasonMessage': this.state.Rejected
    }
    this.setState({ isLoading: true });
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        notify.show(response.data.message, 'success');
        this.getKycList();
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

  tableHead = ['Remittancy Company', 'Name of Person', 'Phone', 'Email', 'Status', 'Action'];

  render() {
    const { remitCompList, role, isRemitCompListView, remitViewList, isLoading, page, isReject } = this.state;
    return (
      <div className="cbp-spmenu-push">
        <Notifications />
        <SideMenu propsRole={role} />
        <HeaderCommon propsPush={this.props} />
        {
          isLoading && <div className="loaderBg">
            <div className="loaderimg">
              <SyncLoader
                color={'#0f99dd'}
                loading={isLoading}
              /></div>
          </div>
        }
        <div id="page-wrapper">
          <div className="main-page">
            <div className="dashboard-title">
              <h1>Remittance Companies</h1>
            </div>
            <CustSearch tableHead={this.tableHead} handlePageChange={this.handlePageChange} statusColor={this.statusColor}
              tokenList={remitCompList} page={page} perPage={10} isManageRemitCompany viewRemitCompany={this.viewRemitCompany} />
          </div>
        </div>
        {isRemitCompListView && <div className="bgbloack"><div className="remittancebody"><div className="remittance-body">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12">
                <div className="remittance-form">
                  <div className="remittance-title">
                    <h1>Remittance Company Details</h1>
                    <button type="button" className="clsebtn close" onClick={() => this.setState({ isRemitCompListView: false })} >×</button>
                  </div>
                  <div className="remitance-form-div">
                    <form>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Name of Company
                          </label>
                          <input type="text" defaultValue={remitViewList.companyName} readOnly />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Email
                          </label>
                          <input type="text" defaultValue={remitViewList.emailId} readOnly />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>First Name
                          </label>
                          <input type="text" defaultValue={remitViewList.firstName} readOnly />

                        </div>
                      </div>

                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Last Name
                          </label>
                          <input type="text" defaultValue={remitViewList.lastName} readOnly />

                        </div>
                      </div>

                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group pos-relative">
                          <label>Target Market</label>
                          <label>{_map(remitViewList.targetMarket, (tkMkt, i) => {
                            return (
                              <div className="tarketbottom" key={i}>
                                <input defaultValue={tkMkt} readOnly />
                              </div>
                            )
                          })}</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="down-arrow">
                    <div className="down-icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="remitance-form-div">
                    <form>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Phone
                          </label>
                          <input type="text" defaultValue={remitViewList.phone} readOnly />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Address
                          </label>
                          <input type="text" defaultValue={remitViewList.address} readOnly />

                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>City
                          </label>
                          <input type="text" defaultValue={remitViewList.city} readOnly />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group pos-relative">
                          <label>Country
                          </label>
                          <div className="seletcountryoption">
                            <span>{remitViewList.country}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>State
                          </label>  <div className="seletcountryoption">
                            <span>{remitViewList.state}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Zip / Post-Code
                          </label>
                          <input type="text" defaultValue={remitViewList.zipCode} readOnly />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="down-arrow">
                    <div className="down-icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="remitance-form-div">
                    <form>
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <div className="ipaddress-select">
                          <label>Development Server IP Address</label>
                          <div className="serverip-div">
                            <div className="iptxtinput">
                              {_map(remitViewList.developmentServerIPs, (items, i) => {
                                return (
                                  <div className="tarketbottom" key={i}>
                                    <input type="text" defaultValue={items} readOnly /> <br />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-xs-12">
                        <div className="ipaddress-select">
                          <label>Live Server IP Address</label>
                          <div className="serverip-div">
                            <div className="iptxtinput">
                              {_map(remitViewList.liveServerIPs, (items, i) => {
                                return (
                                  <div className="tarketbottom" key={i}>
                                    <input type="text" defaultValue={items} readOnly /><br />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="down-arrow">
                    <div className="down-icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="remitance-form-div">
                    <form>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Photo ID
                          </label>
                          <div className="form-group">
                            <input type="file" className="file" />
                            <div className="pos-relative">
                              <input type="text" className="form-control" disabled placeholder="No File Choose" />
                              <span className="browsePhoto">
                              </span>
                              <a href={remitViewList.photoIDPath} rel='noopener noreferrer' target="_blank" className="viewPhoto">View PhotoId </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>Business Registration
                          </label>
                          <div className="form-group">
                            <input type="file" className="file" />
                            <div className="pos-relative">
                              <input type="text" className="form-control" disabled placeholder="No File Choose" />
                              <span className="browsePhoto">
                              </span>
                              <a href={remitViewList.businessRegistrationPath} rel='noopener noreferrer' target="_blank" className="viewPhoto">View Business Registration Id </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="down-arrow">
                    <div className="down-icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                  </div>
                  <h1 className="license-title titlelicense">License Details</h1>
                  {_map(remitViewList.licencePaths, (items, i) => {
                    return (
                      <div key={i} className="remitance-form-div changespace">
                        <form>
                          <div className="col-lg-12 col-sm-12">
                            <div className="uploadLicense mspace">
                              <div className="form-group">
                                <label>License Upload
                                </label>
                                <div className="form-group">
                                  <input type="file" className="file" onChange={this.handleChangeFile} ref={(ref) => { this.file = ref }} name="licenseId" required />
                                  <div className="pos-relative">
                                    <input type="text" className="form-control" placeholder="No File Choose" disabled />
                                    <span className="browsePhoto">
                                    </span>
                                    <a href={items.licencePaths} rel='noopener noreferrer' target="_blank" className="viewPhoto">View License </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="uploadLicense">
                              <div className="form-group">
                                <label>Jurisdiction
                                </label>
                                <input type="text" name='juris' defaultValue={items.jurisdiction} readOnly />

                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )
                  })}
                  <div className="down-arrow">
                    <div className="down-icon">
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="remitance-form-div apprejtbtn text-center">
                    <button type="button" className="btnn approvebtn" name='Approved' onClick={(event) => {
                      this.clickRemitStatus(event, remitViewList.id);
                      this.setState({ isRemitCompListView: false })
                    }}>Approve</button>
                    <button className="btnn rejectbtn" type="button" name='Rejected' onClick={(event) => {
                      this.setState({ isReject: true, isRemitCompListView: false });
                    }}>Reject</button>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div></div></div>}
        {isReject && <div className="fa-code-section approvpopup">
          <div className="fa-code-div">
            <div className="remittance-title"><h1>Reason</h1><button type="button" className="clsebtn close" onClick={() => {
              this.setState({ isReject: false, Rejected: '' });
            }
            } data-dismiss="modal">×</button></div>
            <div className="fa-code-content">
              <form>
                <textarea name="Rejected" value={this.state.Rejected} onChange={this.handleChange} placeholder="Enter reason for rejection" required="" ></textarea>
              </form>
              <button type="button" name="Rejected" onClick={(event) => {
                this.clickRemitStatus(event, remitViewList.id);
                this.setState({ isReject: false, Rejected: '' });
              }
              } disabled={!this.state.RejectedValid} className="btn-verfy">Send</button>
            </div>
          </div>
        </div>}
      </div>
    )
  }
}
