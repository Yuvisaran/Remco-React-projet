import React from 'react';

import FeeDeatilsTable from '../components/FeeTable/tableHead';
import CommissionTableHead from '../components/CommissionSplitUpTable/commissionTableHead';
import SideMenu from '../sideMenu';
import HeaderCommon from '../header';

export default class CommiViewUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commissionDetails: '',
      page: 1,
      commissionPage: 1,
      role: '',
      token: ''
    }
    // Check authorised or not
    if (sessionStorage.getItem('loginInfo') == null) {
      props.history.push('/login');
    }
  }
  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
    }
    const commissionDetails = JSON.parse(sessionStorage.getItem('commissionInfo'));
    this.setState({ commissionDetails });
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }
  handleCommissionPageChange = (commissionPage) => {
    this.setState({ commissionPage })
  }
  toggleViewUpdate = () => {
    sessionStorage.removeItem('commissionInfo');
    this.props.history.push('/commissionlist');
  }
  render() {
    const { commissionDetails, page, commissionPage, role } = this.state;
    return (
      <div className="cbp-spmenu-push">
        <SideMenu propsRole={role} />
        <HeaderCommon propsPush={this.props} />
        <div id="page-wrapper">
          <div className="main-page">
            <div className="commission-form">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12 mobilepadd">
                  <div className="commission-body">
                    <form>
                      <h1>Personal Info</h1>
                      <div className="persional-info-form">
                        <div className="row">
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Company Name
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Company Name" name='companyName' value={commissionDetails.companyName} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Representative Name
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Representative Name" value={commissionDetails.representativeName || ''} name='firstName' readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Remittance Provider Email Address
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Email Address" value={commissionDetails.emailId || ''} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Remittance Provider
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Remittance Provider" name='provider' readOnly value={commissionDetails.remittanceProvider} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Phone Number
                                <sup>*</sup>
                              </label>
                              <input type="number" placeholder="Phone Number" value={commissionDetails.mobileNo || ''} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>City
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="City" value={commissionDetails.city || ''} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Remittance Provider Address
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Remittance Provider Address" value={commissionDetails.address || ''} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Access Token
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Access Token" value={commissionDetails.accessToken || ''} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Access Key
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Access Token" value={commissionDetails.accessKey || ''} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Is Active
                                <sup>*</sup>
                              </label>
                              <div className="currency pos-relative">
                                <select>
                                  <option>Active</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>IP Address White List
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Company Name" name='ipAddressList' value={commissionDetails.ipAddress} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Daily Transaction Limit
                                <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Daily Transaction Limit" name='transLimit' value={commissionDetails.dailyTransactionLimit} readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                      <h1 className="feeicon">Fee Details</h1>
                      <div className="persional-info-form">
                        <div className="fee-checkbox">
                          <div className="inputGroup">
                            <input id="option1" name="option1" type="checkbox" defaultChecked />
                            <label htmlFor="option1">Is Fee Allowed</label>
                          </div>
                        </div>
                        <FeeDeatilsTable isView handlePageChange={this.handlePageChange} page={page} perPage={3} percentageDTO={commissionDetails.percentageDTO} />
                        <div className="clearfix"></div>
                      </div>

                      <h1 className="commissionIcon">Commission Percentage</h1>
                      <div className="persional-info-form">
                        <div className="row">
                          <div className="col-lg-6 col-sm-6 col-xs-12">
                            <div className="form-group">
                              <label>VTN Percent (%)
                              </label>
                              <input type="text" defaultValue="100%" readOnly />
                            </div>
                          </div>
                        </div>
                        <div className="clearfix"></div>
                      </div>
                      <h1 className="commissionIcon">VTN Commission Split Up</h1>
                      <div className="persional-info-form">
                        <CommissionTableHead isView vTNCommissionDTO={commissionDetails.vTNCommissionDTO} handlePageChange={this.handleCommissionPageChange}
                          page={commissionPage} perPage={3} />
                        <div className="clearfix"></div>
                      </div>
                      <div className="commissionbtn">
                        <button type="button" onClick={this.toggleViewUpdate} className="commission-submit">Back</button>
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
    )
  }
}
