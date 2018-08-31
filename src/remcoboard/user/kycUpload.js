import React from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Select from 'react-select';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import validateip from 'validate-ip';
import _map from 'lodash/map';
// import IntlTelInput from 'react-intl-tel-input';
// import 'file?name=libphonenumber.js!../../../node_modules/react-intl-tel-input/dist/libphonenumber.js';
// import '../../../node_modules/react-intl-tel-input/dist/main.css';

import countries from '../common/countryList';
import { base_url } from '../common/apiUrl';
import HeaderCommon from '../common/header';

const options = countries;
class KycUpload extends React.Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    this.state = {
      emailId: sessionInfo.loginInfo.emailId,
      companyName: sessionInfo.loginInfo.companyName,
      firstName: '',
      lastName: '',
      phone: '',
      country: '',
      region: '',
      state: '',
      address: '',
      city: '',
      zipCode: '',
      devIp: '',
      liveIp: '',
      juris: '',
      countryTarget: '',
      values: [],
      jurisValues: [],
      licValues: [],
      valuesLiveIp: [],
      isFirstNameValid: false,
      isLastNameValid: false,
      isAddressValid: false,
      isCityValid: false,
      isZipCodeValid: false,
      isIpAddressvalid: false,
      isLiveIpAddressvalid: false,
      isDynamicIpAddressvalid: false,
      isDynamicLiveIpAddressvalid: false,
      isJurisValid: false,
      formValid: false,
      selectedOption: [],
      errors: {
      },
      devIpErrors: [],
      liveIpErrors: [],
      jurisErrors: [],
      token: sessionInfo.loginInfo.token,
      role: sessionInfo.loginInfo.role,
      photoId: '',
      bussinessId: '',
      licenseId: '',
      isPhoneValid: false,
      errorCity: '',
      errorRegion: ''
    }
    this.selectCountryTarget = this.selectCountryTarget.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.selectRegion = this.selectRegion.bind(this);
    this.uploadKycDetails = this.uploadKycDetails.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleChangeLicFieldsFile = this.handleChangeLicFieldsFile.bind(this);
    this.mobileNoHandler = this.mobileNoHandler.bind(this);
    this.handleChangeLicFieldsJuris = this.handleChangeLicFieldsJuris.bind(this);
  }

  selectCountryTarget(val) {
    this.setState({ countryTarget: val });
  }

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

  createUI() {
    console.log('createui values', this.state.values)
    return this.state.values.map((items, i) =>
      <div key={i}>
        <div className="serverip-div">
          <div className="iptxtinput">
            <input type="text" value={items || ''} onChange={this.handleChangeField.bind(this, i)} />
            <a onClick={this.removeClick.bind(this, i)}>
              <img src="src/public/image/minus.png" alt="remove" />
            </a>
            <span className="error">{this.state.devIpErrors[i]}</span>
          </div>
        </div>
      </div>
    )
  }
  createUILiveServer() {
    console.log('yuviliveip called')
    return this.state.valuesLiveIp.map((items, i) =>
      <div key={i}>
        <div className="serverip-div">
          <div className="iptxtinput">
            <input type="text" value={items || ''} onChange={this.handleChangeFieldLiveServer.bind(this, i)} />
            <a onClick={this.removeClickLiveIp.bind(this, i)}>
              <img src="src/public/image/minus.png" alt="remove" />
            </a>
            <span className="error">{this.state.liveIpErrors[i]}</span>
          </div>
        </div>
      </div>
    )
  }
  createLicenseFields() {
    console.log('yuvilicfield called', this.state.jurisValues)
    return this.state.licValues.map((items, i) => {
      console.log('item..', items)
      return <div key={i}>
        <div className="remitance-form-div">
          <form>
            <div className="col-lg-12 col-sm-12">
              <div className="uploadLicense">
                <div className="form-group">
                  {/* <label>License Upload</label> */}
                  <div className="form-group">
                    <input type="file" className="file" defaultValue={items.name} onChange={this.handleChangeLicFieldsFile.bind(this, i)} required />
                    <div className="input-group col-xs-12">
                      <input type="text" className="form-control" placeholder="No File Choose" disabled />
                      <span className="input-group-btn">
                        <button className="browse btn btnupload" type="button">
                          Browse</button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="uploadLicense">
                <div className="form-group">
                  {/* <label>Jurisdiction</label> */}
                  <input type="text" name='juris' value={this.state.jurisValues[i]} onChange={this.handleChangeLicFieldsJuris.bind(this, i)} />
                  <span className="error">{this.state.errors.juris}</span>
                </div>
              </div>
              <a onClick={this.removeClickLicField.bind(this, i)}>
                <img src="src/public/image/minus.png" alt="Remove" />
              </a>
            </div>
          </form>
          {/* {this.createLicenseFields()} */}
        </div>
      </div>
    }
    )
  }
  handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    console.log(value, 'value')
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
      case 'firstName':
        this.state.isFirstNameValid = !validator.isEmpty(value);
        console.log('isFirstNameValid', this.state.isFirstNameValid);
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
      case 'address':
        this.state.isAddressValid = !validator.isEmpty(value);
        fieldValidationErrors.address = this.state.isAddressValid ? '' : 'Please enter address.';
        break;
      case 'city':
        this.state.isCityValid = !validator.isEmpty(value);
        fieldValidationErrors.city = this.state.isCityValid ? '' : 'Please enter city.';
        break;
      case 'zipCode':
        this.state.isZipCodeValid = !validator.isEmpty(value);
        fieldValidationErrors.zipCode = this.state.isZipCodeValid ? '' : 'Please enter zip code.';
        break;
      case 'devIp':
        this.state.isIpAddressvalid = validateip(value);
        fieldValidationErrors.devIp = this.state.isIpAddressvalid ? '' : 'Please enter valid IP address.';
        break;
      case 'liveIp':
        this.state.isLiveIpAddressvalid = validateip(value);
        fieldValidationErrors.liveIp = this.state.isLiveIpAddressvalid ? '' : 'Please enter valid IP address.';
        break;
      case 'juris':
        this.state.isJurisValid = !validator.isEmpty(value);
        fieldValidationErrors.juris = this.state.isJurisValid ? '' : 'Please enter jurisdiction.';
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
        this.state.isCityValid &&
        this.state.isZipCodeValid &&
        this.state.isIpAddressvalid &&
        this.state.isLiveIpAddressvalid &&
        this.state.isJurisValid &&
        this.state.isPhoneValid &&
        this.state.isLastNameValid
    })
  }

  handleChangeField(i, event) {
    console.log('change i', i)
    console.log('change event', event)
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
    console.log('values.i', values[i])
    this.state.isDynamicIpAddressvalid = validateip(values[i]);
    let devIpErrors = [...this.state.devIpErrors];
    devIpErrors[i] = this.state.isDynamicIpAddressvalid ? '' : 'Please enter valid IP address.';
    this.setState({ devIpErrors });
  }

  addClick() {
    this.setState(prevState => ({ values: [...prevState.values, ''] }))
    console.log(' add value', this.state.values);
  }

  removeClick(i) {
    console.log('remove i', i)
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
    console.log('remove value', this.state.values);
  }

  handleChangeFieldLiveServer(i, event) {
    console.log('change i', i)
    console.log('change event', event)
    let valuesLiveIp = [...this.state.valuesLiveIp];
    valuesLiveIp[i] = event.target.value;
    this.setState({ valuesLiveIp });
    console.log('valuesLiveIp.i', valuesLiveIp[i])
    this.state.isDynamicLiveIpAddressvalid = validateip(valuesLiveIp[i]);
    let liveIpErrors = [...this.state.liveIpErrors];
    liveIpErrors[i] = this.state.isDynamicLiveIpAddressvalid ? '' : 'Please enter valid IP address.';
    this.setState({ liveIpErrors });
  }
  handleChangeLicFieldsFile(i, event) {
    console.log('change i', i)
    console.log('change event', event)
    const licValues = [...this.state.licValues];
    licValues[i] = event.target.files[0];
    this.setState({ licValues });
  }
  handleChangeLicFieldsJuris(i, event) {
    console.log('change ivaluejuris', i)
    console.log('change ieventjuris', event)
    const jurisValues = [...this.state.jurisValues];
    jurisValues[i] = event.target.value;
    this.setState({ jurisValues });
  }
  addClickLiveIp() {
    this.setState(prevState => ({ valuesLiveIp: [...prevState.valuesLiveIp, ''] }))
    console.log(' add valueliveip', this.state.valuesLiveIp);
  }
  addLicFields() {
    this.setState(prevState => ({ jurisValues: [...prevState.jurisValues, ''] }))
    this.setState(prevState => ({ licValues: [...prevState.licValues, ''] }))
    console.log(' add value juris', this.state.jurisValues);
  }
  removeClickLiveIp(i) {
    console.log('remove i', i)
    let valuesLiveIp = [...this.state.valuesLiveIp];
    valuesLiveIp.splice(i, 1);
    this.setState({ valuesLiveIp });
    console.log('remove value', this.state.valuesLiveIp);
  }
  removeClickLicField(i) {
    console.log('remove i', i)
    let jurisValues = [...this.state.jurisValues];
    jurisValues.splice(i, 1);
    let licValues = [...this.state.licValues];
    licValues.splice(i, 1);
    this.setState({ licValues, jurisValues }, () => {
      console.log('remove jurisvalue', this.state.jurisValues);
      console.log('remove licValues', this.state.licValues);
    });
  }
  changeTargetMarket(selectedOption) {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }

  handleChangeFile(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.files[0] });
  }

  mobileNoHandler(status, value, countryData, number, id) {
    this.setState({
      phone: number,
      isPhoneValid: status
    });
    if (status === false) {
      this.state.errors.phone = 'Please enter valid phone number';
    } else if (status === true) {
      this.state.errors.phone = '';
    }
  }
  uploadKycDetails() {
    // let sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    const details = {
      'companyName': this.state.companyName,
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'address': this.state.address,
      'phone': this.state.phone,
      'country': this.state.country,
      'zipCode': this.state.zipCode,
      'state': this.state.region,
      'emailId': this.state.emailId,
      'city': this.state.city
    }
    const targetMarket = _map(this.state.selectedOption, 'label');
    const developmentServerIPs = this.state.devIp.concat(',').concat(this.state.values);
    const liveServerIPs = this.state.liveIp.concat(',').concat(this.state.valuesLiveIp);
    const jurisdiction = this.state.juris.concat(',').concat(this.state.jurisValues);
    const formData = new FormData();
    formData.append('userInfo', JSON.stringify(details));
    formData.append('targetMarket', JSON.stringify(targetMarket));
    formData.append('developmentServerIPs', JSON.stringify(developmentServerIPs));
    formData.append('liveServerIPs', JSON.stringify(liveServerIPs));
    formData.append('photoId', this.state.photoId);
    formData.append('businessRegistration', this.state.bussinessId);
    formData.append('jurisdiction', JSON.stringify(jurisdiction));
    formData.append('licenses', this.state.licenseId);
    {
      this.state.licValues.map((each, i) => {
        console.log('license', each, each.length)
        return (
          formData.append('licenses', each)
        )
      })
    }
    const uploadKycUrl = base_url + 'user/kyc/upload';
    this.setState({ loading: true });
    axios.post(uploadKycUrl,
      formData,
      {
        'headers': {
          'authToken': this.state.token,
          'ownerType': this.state.role
        }
      })
      .then(response => {
        this.setState({ loading: false });
        if (response.status === 200) {
          // sessionStorage.setItem('kycInfo', JSON.stringify(response.data.kycInfo));
          // this.props.history.push('/userdashboard');
          notify.show(response.data.message, 'success');
        } else if (response.status === 206) {
          notify.show(response.data.message, 'error');
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

  render() {
    const { emailId, companyName, firstName, lastName, formValid, errors, juris, isJurisValid,
      address, city, zipCode, devIp, liveIp, isIpAddressvalid, isLiveIpAddressvalid, phone,
      country, region, selectedOption, errorCity, errorRegion } = this.state;
    console.log(this.state, 'this')
    // console.log('disabled@@@@@@', !formValid || (selectedOption == '' && errorCity == '' && errorRegion == '' && devIpErrors == [] && liveIpErrors == []))
    return (
      <div>
        <Notifications />
        <div className="remittance-register">
          <HeaderCommon propsPush={this.props} />
          {
            this.state.loading && <div className="loaderBg">
              <div className="loaderimg">
                <SyncLoader
                  color={'#0f99dd'}
                  loading={this.state.loading}
                /></div>
            </div>
          }
          <div className="remco-logo">
            <div className="remit-logo"></div>
          </div>
          <div className="remittance-body">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <div className="remittance-form">
                    <div className="remittance-title">
                      <h1>Remittance Company Registration</h1>
                    </div>
                    <div className="remitance-form-div">
                      <form>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Name of Company
                            </label>
                            <input type="text" value={companyName} readOnly />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Email
                            </label>
                            <input type="text" value={emailId} readOnly />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>First Name
                            </label>
                            <input type="text" value={firstName} onChange={this.handleChange} name='firstName' />
                            <span className="error">{errors.firstName}</span>
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Last Name
                            </label>
                            <input type="text" value={lastName} onChange={this.handleChange} name='lastName' />
                            <span className="error">{errors.lastName}</span>
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group pos-relative">
                            <label>Target Market
                            </label>
                            <div className="selectoption">
                              <Select
                                onChange={this.changeTargetMarket.bind(this)}
                                isMulti
                                options={options}
                              />
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
                            <label>Phone
                            </label>
                            {/* <IntlTelInput
                                                            name='phone'
                                                            value={phone}
                                                            onChange={this.handleChange}
                                                            onPhoneNumberChange={this.mobileNoHandler}
                                                            onPhoneNumberBlur={this.mobileNoHandler}
                                                            css={['intl-tel-input', 'form-control']}
                                                            utilsScript={'libphonenumber.js'}
                                                            required
                                                        /> */}
                            <input type="text" name='phone' value={phone} onChange={this.handleChange} />
                            <span className="error">{errors.phone}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Address
                            </label>
                            <input type="text" value={address} name='address' onChange={this.handleChange} />
                            <span className="error">{errors.address}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>City
                            </label>
                            <input type="text" value={city} name='city' onChange={this.handleChange} />
                            <span className="error">{errors.city}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group pos-relative">
                            <label>Country
                            </label>
                            <div className="selectoption">
                              <CountryDropdown
                                value={country}
                                onChange={(val) => this.selectCountry(val)} />
                            </div>
                            <span className="error">{errorCity}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>State
                            </label>  <div className="selectoption">
                              <RegionDropdown
                                country={country}
                                value={region}
                                onChange={(val) => this.selectRegion(val)} /></div>
                            <span className="error">{errorRegion}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Zip / Post-Code
                            </label>
                            <input type="text" value={zipCode} name='zipCode' onChange={this.handleChange} />
                            <span className="error">{errors.zipCode}</span>
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
                                <input type="text" name='devIp' value={devIp} onChange={this.handleChange} />
                                {isIpAddressvalid && <a onClick={this.addClick.bind(this)}>
                                  <img src="src/public/image/add.png" alt="addicon" />
                                </a>}
                                <span className="error">{errors.devIp}</span>
                              </div>
                              {this.createUI()}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                          <div className="ipaddress-select">
                            <label>Live Server IP Address</label>
                            <div className="serverip-div">
                              <div className="iptxtinput">
                                <input type="text" name='liveIp' value={liveIp} onChange={this.handleChange} />
                                {isLiveIpAddressvalid && <a onClick={this.addClickLiveIp.bind(this)}>
                                  <img src="src/public/image/add.png" alt="addicon" />
                                </a>}
                                <span className="error">{errors.liveIp}</span>
                              </div>
                              {this.createUILiveServer()}
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
                              <input type="file" className="file" onChange={this.handleChangeFile} ref={(ref) => { this.file = ref }} name="photoId" required />
                              <div className="input-group col-xs-12">
                                <input type="text" className="form-control" disabled placeholder="No File Choose" />
                                <span className="input-group-btn">
                                  <button className="browse btn btnupload" type="button">
                                    Browse</button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Business Registration
                            </label>
                            <div className="form-group">
                              <input type="file" className="file" onChange={this.handleChangeFile} ref={(ref) => { this.file = ref }} name="bussinessId" required />
                              <div className="input-group col-xs-12">
                                <input type="text" className="form-control" disabled placeholder="No File Choose" />
                                <span className="input-group-btn">
                                  <button className="browse btn btnupload" type="button">
                                    Browse</button>
                                </span>
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
                    <div className="remitance-form-div">
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
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="uploadLicense">
                            <div className="form-group">
                              <label>Jurisdiction
                              </label>
                              <input type="text" name='juris' value={juris} onChange={this.handleChange} />
                              <span className="error">{errors.juris}</span>
                            </div>
                          </div>
                          {isJurisValid && <a onClick={this.addLicFields.bind(this)}>
                            <img src="src/public/image/add.png" alt="addicon" />
                          </a>}
                        </div>
                      </form>
                      {this.createLicenseFields()}
                    </div>
                    <div className="down-arrow">
                      <div className="down-icon">
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div className="remitance-form-div text-center">
                      <button type="button" onClick={this.uploadKycDetails} disabled={!formValid || (selectedOption === '' && errorCity === '' &&
                        errorRegion === '' && !this.state.isDynamicIpAddressvalid && !this.state.isDynamicLiveIpAddressvalid)} className="sub-info">
                        Submit Information</button>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}
export default KycUpload;
