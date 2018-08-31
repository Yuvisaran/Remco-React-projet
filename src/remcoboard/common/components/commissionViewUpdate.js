import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _remove from 'lodash/remove';
import validateip from 'validate-ip';
import validator from 'validator';

import SideMenu from '../sideMenu';
import HeaderCommon from '../header';
import { base_url } from '../apiUrl';
import FeeDeatilsTable from '../components/FeeTable/tableHead';
import CommissionTableHead from '../components/CommissionSplitUpTable/commissionTableHead';

export default class CommiViewUpdate extends React.Component {
  render() {
    const { commissionDetails, toggleViewUpdate, handlePageChange, page,
      handleCommissionPageChange, commissionPage } = this.props;
    console.log('this.prop', this.props);
    return (
      <div className="cbp-spmenu-push">
        <HeaderCommon propsPush={this.props} />
        <div id="page-wrapper">
          <div className="main-page">
            <div className="dashboard-title">
              <h1>Commission</h1>
            </div>
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
                              <input type="text" placeholder="Company Name" name='companyName' value={commissionDetails.companyName} onChange={this.commissionSelect} />
                              {/* <datalist id="remitlist">
                                {_map(remitCompList,
                                  (items, i) => (
                                    <option key={i} value={items.companyName} />
                                  ))}
                              </datalist> */}
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Representative Name
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Representative Name" value={commissionDetails.representativeName || ''} name='firstName' readOnly />
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Remittance Provider Email Address
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Email Address" value={commissionDetails.emailId || ''} readOnly />
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Remittance Provider
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Remittance Provider" name='provider' readOnly value={commissionDetails.remittanceProvider} onChange={this.handleChange} />
                              {/* <span className="error">{errors.provider}</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Phone Number
                              <sup>*</sup>
                              </label>
                              <input type="number" placeholder="Phone Number" value={commissionDetails.mobileNo || ''} readOnly />
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>City
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="City" value={commissionDetails.city || ''} readOnly />
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Remittance Provider Address
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Remittance Provider Address" value={commissionDetails.address || ''} readOnly />
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Access Token
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Access Token" value={commissionDetails.accessToken || ''} readOnly />
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Access Key
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Access Token" value={commissionDetails.accessKey || ''} readOnly />
                              {/* <span className="error">This value is required</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Is Active
                              <sup>*</sup>
                              </label>
                              <div className="currency pos-relative">
                                <select>
                                  <option value="active">Active</option>
                                  {/* <option value="inactive">InActive</option> */}
                                </select>
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>IP Address White List
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Company Name" name='ipAddressList' value={commissionDetails.ipAddress} onChange={this.handleChange} readOnly />
                              {/* <span className="error">{errors.ipAddressList}</span> */}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                            <div className="form-group">
                              <label>Daily Transaction Limit
                              <sup>*</sup>
                              </label>
                              <input type="text" placeholder="Daily Transaction Limit" name='transLimit' value={commissionDetails.dailyTransactionLimit} readOnly onChange={this.handleChange} />
                              {/* <span className="error">{errors.transLimit}</span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <h1 className="feeicon">Fee Details</h1>
                      <div className="persional-info-form">
                        <div className="fee-checkbox">
                          <div className="inputGroup">
                            <input id="option1" name="option1" type="checkbox" checked />
                            <label htmlFor="option1">Is Fee Allowed</label>
                          </div>
                        </div>
                        <FeeDeatilsTable handlePageChange={handlePageChange} page={page} perPage={1} percentageDTO={commissionDetails.percentageDTO} />
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
                        <CommissionTableHead vTNCommissionDTO={commissionDetails.vTNCommissionDTO} handlePageChange={handleCommissionPageChange}
                        page={commissionPage} perPage={1}/>
                        <div className="clearfix"></div>
                      </div>
                      <div className="commissionbtn">
                        <button type="button" onClick={toggleViewUpdate} className="commission-submit">Close</button>
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