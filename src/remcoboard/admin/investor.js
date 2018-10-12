import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';

export default class Investor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      page: 1,
      firstName: '',
      lastName: '',
      phone: '',
      country: '',
      region: '',
      emailId: '',
      state: '',
      address: '',
      city: '',
      zipCode: '',
      share: '',
      errorCity: '   ', // need multiple space initally for validation purpose
      errorRegion: '   ', // need multiple space initally for validation purpose
      errors: {
        companyName: '',
        ownerName: '',
        mobileNo: '',
        emailId: '',
        password: '',
        confirmPassword: ''
      },
      isFirstNameValid: false,
      isLastNameValid: false,
      isAddressValid: false,
      isCityValid: false,
      isZipCodeValid: false,
      isShareValid: false,
      emailIdvalid: false,
      formValid: false,
      loading: false,
      role: '',
      token: ''
    };
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
  }

  numChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const re = /^[0-9.]+$/;
    if (value === '' || re.test(value)) {
      this.setState({ [name]: value }, () => { this.validateField(name, value) });
    }
  }

  handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(name, value) {
    let fieldValidationErrors = this.state.errors;
    switch (name) {
      case 'firstName':
        this.state.isFirstNameValid = !validator.isEmpty(value);
        fieldValidationErrors.firstName = this.state.isFirstNameValid ? '' : 'Please enter first name.';
        break;
      case 'lastName':
        this.state.isLastNameValid = !validator.isEmpty(value);
        fieldValidationErrors.lastName = this.state.isLastNameValid ? '' : 'Please enter last name.';
        break;
      case 'phone':
        this.state.isPhoneValid = validator.isNumeric(value) && validator.isLength(value, 5, 20);
        fieldValidationErrors.phone = this.state.isPhoneValid ? '' : 'Valid international mobile number length is 5 to 20.';
        break;
      case 'emailId':
        this.state.emailIdvalid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.emailId = this.state.emailIdvalid ? '' : 'Please enter valid email.';
        break;
      case 'address':
        this.state.isAddressValid = !validator.isEmpty(value);
        fieldValidationErrors.address = this.state.isAddressValid ? '' : 'Please enter address.';
        break;
      case 'city':
        this.state.isCityValid = !validator.isEmpty(value) && value.match(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/);
        fieldValidationErrors.city = this.state.isCityValid ? '' : 'Please enter valid city name.';
        break;
      case 'zipCode':
        this.state.isZipCodeValid = !validator.isEmpty(value) && value.match(/^[a-z\d\-_\s]+$/i);
        fieldValidationErrors.zipCode = this.state.isZipCodeValid ? '' : 'Please enter zip code.';
        break;
      case 'share':
        this.state.isShareValid = !validator.isEmpty(value) && !(value > 100 || value < 0.1) && !((this.state.share.match(/\./g) || []).length > 1);
        fieldValidationErrors.share = this.state.isShareValid ? '' : 'Please enter Percentage share.';
        break;
      default:
        break;
    }
    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }

  validateForm() {
    this.setState({
      formValid: this.state.isFirstNameValid &&
        this.state.isAddressValid &&
        this.state.emailIdvalid &&
        this.state.isShareValid &&
        this.state.isCityValid &&
        this.state.isZipCodeValid &&
        this.state.isPhoneValid &&
        this.state.isLastNameValid
    })
  }

  // Function for country city validation
  selectCountry(val) {
    if (val === '') {
      this.setState({ errorCity: 'please select country' })
    } else {
      this.setState({ errorCity: '' })
    }
    this.setState({ country: val });
    this.setState({ errorRegion: 'please select state' });
  }

  selectRegion(val) {
    if (val === '') {
      this.setState({ errorRegion: 'please select state' });
    } else {
      this.setState({ errorRegion: '' });
    }
    this.setState({ region: val });
  }

  createInvestor = () => {
    // API request for create investor
    const api_url = base_url + 'admin/create/investor';
    const payLoad = {
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'emailId': this.state.emailId,
      'address': this.state.address,
      'city': this.state.city,
      'country': this.state.country,
      'state': this.state.region,
      'zipCode': this.state.zipCode,
      'phoneNumber': this.state.phone,
      'percentageOfShare': this.state.share
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
        this.setState({
          isLoading: false,
          page: 1,
          firstName: '',
          lastName: '',
          phone: '',
          country: '',
          region: '',
          emailId: '',
          state: '',
          address: '',
          city: '',
          zipCode: '',
          share: '',
          errorCity: '   ', // need multiple space initally for validation purpose
          errorRegion: '   ', // need multiple space initally for validation purpose
          errors: {
            companyName: '',
            ownerName: '',
            mobileNo: '',
            emailId: '',
            password: '',
            confirmPassword: ''
          },
          isFirstNameValid: false,
          isLastNameValid: false,
          isAddressValid: false,
          isCityValid: false,
          isZipCodeValid: false,
          isShareValid: false,
          emailIdvalid: false,
          formValid: false,
          loading: false,
          role: '',
          token: ''
        });
        const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
        this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
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

  render() {
    const { firstName, lastName, formValid, errors, share, role,
      address, city, zipCode, phone, country, region, errorCity, errorRegion } = this.state;
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
                        <h1>Investor Master</h1>
                        <div className="persional-info-form">
                          <div className="row">

                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>First Name
                                  <sup>*</sup>
                                </label>
                                <input type="text" value={firstName} onChange={this.handleChange} name='firstName' />
                                <span className="error erropos">{errors.firstName}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Last Name
                                  <sup>*</sup>
                                </label>
                                <input type="text" value={lastName} onChange={this.handleChange} name='lastName' />
                                <span className="error erropos">{errors.lastName}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Email Address
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Email Address" name='emailId' value={this.state.emailId} onChange={this.handleChange} />
                                <span className="error erropos">{errors.emailId}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Phone Number
                                  <sup>*</sup>
                                </label>
                                <input type="text" name='phone' value={phone} onChange={this.numChange} />
                                <span className="error erropos">{errors.phone}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Address
                                  <sup>*</sup>
                                </label>
                                <input type="text" value={address} name='address' onChange={this.handleChange} />
                                <span className="error erropos">{errors.address}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>City
                                  <sup>*</sup>
                                </label>
                                <input type="text" value={city} name='city' onChange={this.handleChange} />
                                <span className="error erropos">{errors.city}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>State
                                  <sup>*</sup>
                                </label>
                                <div className="currency pos-relative">
                                  <RegionDropdown
                                    country={country}
                                    value={region}
                                    onChange={(val) => this.selectRegion(val)} /></div>
                                <span className="error erropos">{errorRegion}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Zip Code

                                </label>
                                <input type="text" value={zipCode} name='zipCode' onChange={this.handleChange} />
                                <span className="error erropos">{errors.zipCode}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Country
                                  <sup>*</sup>
                                </label>
                                <div className="currency pos-relative">
                                  <CountryDropdown
                                    value={country}
                                    onChange={(val) => this.selectCountry(val)} />
                                  <span className="error erropos">{errorCity}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Percentage Share
                                </label>
                                <input type="text" placeholder="Percentage Share" name='share' value={share} onChange={this.numChange} />
                                <span className="error erropos">{errors.share}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="commissionbtn">
                          <button type="button" className="commission-submit" onClick={this.createInvestor} disabled={!(formValid && (errorCity === '' && errorRegion === ''))} >Submit</button>
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
