import React, { Component } from 'react';
import axios from 'axios';
import Notifications, { notify } from 'react-notify-toast';
import _map from 'lodash/map';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { SyncLoader } from 'react-spinners';
import Pagination from 'react-js-pagination';

import CustSearch from '../common/custSearch';
import { base_url } from '../common/apiUrl';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';

export default class RemitCompany extends Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    this.state = {
      token: sessionInfo.loginInfo.token,
      role: sessionInfo.loginInfo.role,
      remitCompList: [],
      remitViewList: [],
      page: 1,
      isRemitCompListView: false,
      isLoading: false
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
    const api_url = base_url + 'admin/list/kyc';
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      console.log('listKyc', response.data.kycList);
      if (response.status === 200) {
        this.setState({ remitCompList: response.data.kycList })
      } else if (response.data.message === 'Session Expired') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
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

  clickRemitStatus = (e, id) => {
    console.log('jjjj', e, id)
    const api_url = base_url + 'admin/update/kycstatus';
    const payLoad = {
      'id': id,
      'kycStatus': e.target.name
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
        this.getKycList();
      } else if (response.status === 206 && response.data.message === 'Session Expired') {
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

  tableHead = ['Remittancy Company', 'Name of Person', 'Phone', 'Email', 'Status', 'Action'];
  render() {
    const { remitCompList, token, role, isRemitCompListView, remitViewList, isLoading, page, perPage } = this.state;
    console.log('this state', this.state);
    return (
      <div className="cbp-spmenu-push">
        <Notifications />
        <SideMenu propsRole={this.state.role} />
        <HeaderCommon token={token} role={role} />
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
            <CustSearch tableHead={this.tableHead} handlePageChange={this.handlePageChange}
              tokenList={remitCompList} page={page} perPage={2} isManageRemitCompany viewRemitCompany={this.viewRemitCompany} />
            {/* <div className="remittance-tabledetails">
                <div className="table-details table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Remittancy Company</th>
                        <th>Name of Person</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {_map(remitCompList, (items, i) => {
                        console.log('hi', items)
                        return (
                          page * perPage > i &&
                                                (page - 1) * perPage <= i &&
                                                <tr key={i}>
                                                  <td>{items.companyName}</td>
                                                  <td>{items.firstName}</td>
                                                  <td>{items.phone}</td>
                                                  <td>{items.emailId}</td>
                                                  <td className="text-center">
                                                    <button type="button" className="btn-pend pending">{items.kycStatus}</button>
                                                  </td>
                                                  <td className="text-center">
                                                    <button type="button" className="btn-pend viewbtn" onClick={() =>
                                                      this.setState({ isRemitCompListView: true, remitViewList: items })
                                                    }>View</button>
                                                  </td>
                                                </tr>
                        )
                      })
                      }
                    </tbody>
                  </table>
                </div>
                <div className="datatable-pagination">
                  {remitCompList.length > 0 &&
                                    <Pagination
                                      prevPageText='Previous'
                                      nextPageText='Next'
                                      hideFirstLastPages
                                      activePage={page}
                                      itemsCountPerPage={perPage}
                                      totalItemsCount={remitCompList.length}
                                      onChange={this.handlePageChange} />
                  }
                </div>
              </div> */}
          </div>
        </div>
        {isRemitCompListView && <div className="remittance-body">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12">
                <div className="remittance-form">
                  <div className="remittance-title">
                    <h1>Remittance Company Details</h1>
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
                            console.log('tkmt_mapppp', tkMkt)
                            return (
                              <div key={i}>
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
                          {/* <IntlTelInput
                              name='phone'
                              defaultValue={remitViewList.phone}

                              onPhoneNumberChange={this.mobileNoHandler}
                              onPhoneNumberBlur={this.mobileNoHandler}
                              css={['intl-tel-input', 'form-control']}
                              utilsScript={'libphonenumber.js'}
                              required
                            /> */}
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
                          <div className="selectoption">
                            <CountryDropdown
                              value={remitViewList.country}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-xs-12">
                        <div className="form-group">
                          <label>State
                          </label>  <div className="selectoption">
                            <RegionDropdown
                              country={remitViewList.country}
                              value={remitViewList.state}
                              readOnly
                            /></div>
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
                                  <div key={i}>
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
                                  <div key={i}>
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
                            <div className="input-group col-xs-12">
                              <input type="text" className="form-control" disabled placeholder="No File Choose" />
                              <span className="input-group-btn">
                                <button className="browse btn btnupload" type="button">
                                  Browse</button>
                              </span>
                              <a href={remitViewList.photoIDPath} rel='noopener noreferrer' target="_blank">View PhotoId </a>
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
                            <div className="input-group col-xs-12">
                              <input type="text" className="form-control" disabled placeholder="No File Choose" />
                              <span className="input-group-btn">
                                <button className="browse btn btnupload" type="button">
                                  Browse</button>
                              </span>
                              <a href={remitViewList.businessRegistrationPath} rel='noopener noreferrer' target="_blank">View Business Registration Id </a>
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
                  <h1 className="license-title">License Details</h1>
                  {_map(remitViewList.licencePaths, (items, i) => {
                    return (
                      <div key={i} className="remitance-form-div">
                        <form>
                          <div className="col-lg-12 col-sm-12">
                            <div className="uploadLicense">
                              <div className="form-group">
                                <label>License Upload
                                </label>
                                <div className="form-group">
                                  <input type="file" className="file" onChange={this.handleChangeFile} ref={(ref) => { this.file = ref }} name="licenseId" required />
                                  <div className="input-group col-xs-12">
                                    <input type="text" className="form-control" placeholder="No File Choose" disabled />
                                    <span className="input-group-btn">
                                      <button className="browse btn btnupload" type="button">
                                        Browse</button>
                                    </span>
                                    <a href={items.licencePaths} rel='noopener noreferrer' target="_blank">View License </a>
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
                  <div className="remitance-form-div text-center">
                    <button type="button" name='Approved' onClick={(event) => {
                      this.clickRemitStatus(event, remitViewList.id);
                      this.setState({ isRemitCompListView: false })
                    }}>Approve</button>
                  </div>
                  <div className="remitance-form-div text-center">
                    <button type="button" name='Rejected' onClick={(event) => {
                      this.clickRemitStatus(event, remitViewList.id);
                      this.setState({ isRemitCompListView: false })
                    }}>Reject</button>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
    )
  }
}
