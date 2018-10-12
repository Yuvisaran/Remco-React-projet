import React from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Select from 'react-select';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import validateip from 'validate-ip';
import _map from 'lodash/map';

import { base_url } from '../common/apiUrl';
import HeaderCommon from '../common/header';

const options = [
  {
    'value': 'Afghanistan',
    'label': 'Afghanistan'
  },
  {
    'value': 'Albania',
    'label': 'Albania'
  },
  {
    'value': 'Algeria',
    'label': 'Algeria'
  },
  {
    'value': 'Andorra',
    'label': 'Andorra'
  },
  {
    'value': 'Angola',
    'label': 'Angola'
  },
  {
    'value': 'Anguilla',
    'label': 'Anguilla'
  },
  {
    'value': 'Antigua & Barbuda',
    'label': 'Antigua & Barbuda'
  },
  {
    'value': 'Argentina',
    'label': 'Argentina'
  },
  {
    'value': 'Armenia',
    'label': 'Armenia'
  },
  {
    'value': 'Australia',
    'label': 'Australia'
  },
  {
    'value': 'Austria',
    'label': 'Austria'
  },
  {
    'value': 'Azerbaijan',
    'label': 'Azerbaijan'
  },
  {
    'value': 'Bahamas',
    'label': 'Bahamas'
  },
  {
    'value': 'Bahrain',
    'label': 'Bahrain'
  },
  {
    'value': 'Bangladesh',
    'label': 'Bangladesh'
  },
  {
    'value': 'Barbados',
    'label': 'Barbados'
  },
  {
    'value': 'Belarus',
    'label': 'Belarus'
  },
  {
    'value': 'Belgium',
    'label': 'Belgium'
  },
  {
    'value': 'Belize',
    'label': 'Belize'
  },
  {
    'value': 'Benin',
    'label': 'Benin'
  },
  {
    'value': 'Bermuda',
    'label': 'Bermuda'
  },
  {
    'value': 'Bhutan',
    'label': 'Bhutan'
  },
  {
    'value': 'Bolivia',
    'label': 'Bolivia'
  },
  {
    'value': 'Bosnia & Herzegovina',
    'label': 'Bosnia & Herzegovina'
  },
  {
    'value': 'Botswana',
    'label': 'Botswana'
  },
  {
    'value': 'Brazil',
    'label': 'Brazil'
  },
  {
    'value': 'Brunei Darussalam',
    'label': 'Brunei Darussalam'
  },
  {
    'value': 'Bulgaria',
    'label': 'Bulgaria'
  },
  {
    'value': 'Burkina Faso',
    'label': 'Burkina Faso'
  },
  {
    'value': 'Myanmar/Burma',
    'label': 'Myanmar/Burma'
  },
  {
    'value': 'Burundi',
    'label': 'Burundi'
  },
  {
    'value': 'Cambodia',
    'label': 'Cambodia'
  },
  {
    'value': 'Cameroon',
    'label': 'Cameroon'
  },
  {
    'value': 'Canada',
    'label': 'Canada'
  },
  {
    'value': 'Cape Verde',
    'label': 'Cape Verde'
  },
  {
    'value': 'Cayman Islands',
    'label': 'Cayman Islands'
  },
  {
    'value': 'Central African Republic',
    'label': 'Central African Republic'
  },
  {
    'value': 'Chad',
    'label': 'Chad'
  },
  {
    'value': 'Chile',
    'label': 'Chile'
  },
  {
    'value': 'China',
    'label': 'China'
  },
  {
    'value': 'Colombia',
    'label': 'Colombia'
  },
  {
    'value': 'Comoros',
    'label': 'Comoros'
  },
  {
    'value': 'Congo',
    'label': 'Congo'
  },
  {
    'value': 'Costa Rica',
    'label': 'Costa Rica'
  },
  {
    'value': 'Croatia',
    'label': 'Croatia'
  },
  {
    'value': 'Cuba',
    'label': 'Cuba'
  },
  {
    'value': 'Cyprus',
    'label': 'Cyprus'
  },
  {
    'value': 'Czech Republic',
    'label': 'Czech Republic'
  },
  {
    'value': 'Democratic Republic of the Congo',
    'label': 'Democratic Republic of the Congo'
  },
  {
    'value': 'Denmark',
    'label': 'Denmark'
  },
  {
    'value': 'Djibouti',
    'label': 'Djibouti'
  },
  {
    'value': 'Dominica',
    'label': 'Dominica'
  },
  {
    'value': 'Dominican Republic',
    'label': 'Dominican Republic'
  },
  {
    'value': 'Ecuador',
    'label': 'Ecuador'
  },
  {
    'value': 'Egypt',
    'label': 'Egypt'
  },
  {
    'value': 'El Salvador',
    'label': 'El Salvador'
  },
  {
    'value': 'Equatorial Guinea',
    'label': 'Equatorial Guinea'
  },
  {
    'value': 'Eritrea',
    'label': 'Eritrea'
  },
  {
    'value': 'Estonia',
    'label': 'Estonia'
  },
  {
    'value': 'Ethiopia',
    'label': 'Ethiopia'
  },
  {
    'value': 'Fiji',
    'label': 'Fiji'
  },
  {
    'value': 'Finland',
    'label': 'Finland'
  },
  {
    'value': 'France',
    'label': 'France'
  },
  {
    'value': 'French Guiana',
    'label': 'French Guiana'
  },
  {
    'value': 'Gabon',
    'label': 'Gabon'
  },
  {
    'value': 'Gambia',
    'label': 'Gambia'
  },
  {
    'value': 'Georgia',
    'label': 'Georgia'
  },
  {
    'value': 'Germany',
    'label': 'Germany'
  },
  {
    'value': 'Ghana',
    'label': 'Ghana'
  },
  {
    'value': 'Great Britain',
    'label': 'Great Britain'
  },
  {
    'value': 'Greece',
    'label': 'Greece'
  },
  {
    'value': 'Grenada',
    'label': 'Grenada'
  },
  {
    'value': 'Guadeloupe',
    'label': 'Guadeloupe'
  },
  {
    'value': 'Guatemala',
    'label': 'Guatemala'
  },
  {
    'value': 'Guinea',
    'label': 'Guinea'
  },
  {
    'value': 'Guinea-Bissau',
    'label': 'Guinea-Bissau'
  },
  {
    'value': 'Guyana',
    'label': 'Guyana'
  },
  {
    'value': 'Haiti',
    'label': 'Haiti'
  },
  {
    'value': 'Honduras',
    'label': 'Honduras'
  },
  {
    'value': 'Hungary',
    'label': 'Hungary'
  },
  {
    'value': 'Iceland',
    'label': 'Iceland'
  },
  {
    'value': 'India',
    'label': 'India'
  },
  {
    'value': 'Indonesia',
    'label': 'Indonesia'
  },
  {
    'value': 'Iran',
    'label': 'Iran'
  },
  {
    'value': 'Iraq',
    'label': 'Iraq'
  },
  {
    'value': 'Israel and the Occupied Territories',
    'label': 'Israel and the Occupied Territories'
  },
  {
    'value': 'Italy',
    'label': 'Italy'
  },
  {
    'value': "Ivory Coast (Cote d'Ivoire)",
    'label': "Ivory Coast (Cote d'Ivoire)"
  },
  {
    'value': 'Jamaica',
    'label': 'Jamaica'
  },
  {
    'value': 'Japan',
    'label': 'Japan'
  },
  {
    'value': 'Jordan',
    'label': 'Jordan'
  },
  {
    'value': 'Kazakhstan',
    'label': 'Kazakhstan'
  },
  {
    'value': 'Kenya',
    'label': 'Kenya'
  },
  {
    'value': 'Kosovo',
    'label': 'Kosovo'
  },
  {
    'value': 'Kuwait',
    'label': 'Kuwait'
  },
  {
    'value': 'Kyrgyz Republic (Kyrgyzstan)',
    'label': 'Kyrgyz Republic (Kyrgyzstan)'
  },
  {
    'value': 'Laos',
    'label': 'Laos'
  },
  {
    'value': 'Latvia',
    'label': 'Latvia'
  },
  {
    'value': 'Lebanon',
    'label': 'Lebanon'
  },
  {
    'value': 'Lesotho',
    'label': 'Lesotho'
  },
  {
    'value': 'Liberia',
    'label': 'Liberia'
  },
  {
    'value': 'Libya',
    'label': 'Libya'
  },
  {
    'value': 'Liechtenstein',
    'label': 'Liechtenstein'
  },
  {
    'value': 'Lithuania',
    'label': 'Lithuania'
  },
  {
    'value': 'Luxembourg',
    'label': 'Luxembourg'
  },
  {
    'value': 'Republic of Macedonia',
    'label': 'Republic of Macedonia'
  },
  {
    'value': 'Madagascar',
    'label': 'Madagascar'
  },
  {
    'value': 'Malawi',
    'label': 'Malawi'
  },
  {
    'value': 'Malaysia',
    'label': 'Malaysia'
  },
  {
    'value': 'Maldives',
    'label': 'Maldives'
  },
  {
    'value': 'Mali',
    'label': 'Mali'
  },
  {
    'value': 'Malta',
    'label': 'Malta'
  },
  {
    'value': 'Martinique',
    'label': 'Martinique'
  },
  {
    'value': 'Mauritania',
    'label': 'Mauritania'
  },
  {
    'value': 'Mauritius',
    'label': 'Mauritius'
  },
  {
    'value': 'Mayotte',
    'label': 'Mayotte'
  },
  {
    'value': 'Mexico',
    'label': 'Mexico'
  },
  {
    'value': 'Moldova, Republic of',
    'label': 'Moldova, Republic of'
  },
  {
    'value': 'Monaco',
    'label': 'Monaco'
  },
  {
    'value': 'Mongolia',
    'label': 'Mongolia'
  },
  {
    'value': 'Montenegro',
    'label': 'Montenegro'
  },
  {
    'value': 'Montserrat',
    'label': 'Montserrat'
  },
  {
    'value': 'Morocco',
    'label': 'Morocco'
  },
  {
    'value': 'Mozambique',
    'label': 'Mozambique'
  },
  {
    'value': 'Namibia',
    'label': 'Namibia'
  },
  {
    'value': 'Nepal',
    'label': 'Nepal'
  },
  {
    'value': 'Netherlands',
    'label': 'Netherlands'
  },
  {
    'value': 'New Zealand',
    'label': 'New Zealand'
  },
  {
    'value': 'Nicaragua',
    'label': 'Nicaragua'
  },
  {
    'value': 'Niger',
    'label': 'Niger'
  },
  {
    'value': 'Nigeria',
    'label': 'Nigeria'
  },
  {
    'value': 'Korea, Democratic Republic of (North Korea)',
    'label': 'Korea, Democratic Republic of (North Korea)'
  },
  {
    'value': 'Norway',
    'label': 'Norway'
  },
  {
    'value': 'Oman',
    'label': 'Oman'
  },
  {
    'value': 'Pacific Islands',
    'label': 'Pacific Islands'
  },
  {
    'value': 'Pakistan',
    'label': 'Pakistan'
  },
  {
    'value': 'Panama',
    'label': 'Panama'
  },
  {
    'value': 'Papua New Guinea',
    'label': 'Papua New Guinea'
  },
  {
    'value': 'Paraguay',
    'label': 'Paraguay'
  },
  {
    'value': 'Peru',
    'label': 'Peru'
  },
  {
    'value': 'Philippines',
    'label': 'Philippines'
  },
  {
    'value': 'Poland',
    'label': 'Poland'
  },
  {
    'value': 'Portugal',
    'label': 'Portugal'
  },
  {
    'value': 'Puerto Rico',
    'label': 'Puerto Rico'
  },
  {
    'value': 'Qatar',
    'label': 'Qatar'
  },
  {
    'value': 'Reunion',
    'label': 'Reunion'
  },
  {
    'value': 'Romania',
    'label': 'Romania'
  },
  {
    'value': 'Russian Federation',
    'label': 'Russian Federation'
  },
  {
    'value': 'Rwanda',
    'label': 'Rwanda'
  },
  {
    'value': 'Saint Kitts and Nevis',
    'label': 'Saint Kitts and Nevis'
  },
  {
    'value': 'Saint Lucia',
    'label': 'Saint Lucia'
  },
  {
    'value': "Saint Vincent's & Grenadines",
    'label': "Saint Vincent's & Grenadines"
  },
  {
    'value': 'Samoa',
    'label': 'Samoa'
  },
  {
    'value': 'Sao Tome and Principe',
    'label': 'Sao Tome and Principe'
  },
  {
    'value': 'Saudi Arabia',
    'label': 'Saudi Arabia'
  },
  {
    'value': 'Senegal',
    'label': 'Senegal'
  },
  {
    'value': 'Serbia',
    'label': 'Serbia'
  },
  {
    'value': 'Seychelles',
    'label': 'Seychelles'
  },
  {
    'value': 'Sierra Leone',
    'label': 'Sierra Leone'
  },
  {
    'value': 'Singapore',
    'label': 'Singapore'
  },
  {
    'value': 'Slovak Republic (Slovakia)',
    'label': 'Slovak Republic (Slovakia)'
  },
  {
    'value': 'Slovenia',
    'label': 'Slovenia'
  },
  {
    'value': 'Solomon Islands',
    'label': 'Solomon Islands'
  },
  {
    'value': 'Somalia',
    'label': 'Somalia'
  },
  {
    'value': 'South Africa',
    'label': 'South Africa'
  },
  {
    'value': 'Korea, Republic of (South Korea)',
    'label': 'Korea, Republic of (South Korea)'
  },
  {
    'value': 'South Sudan',
    'label': 'South Sudan'
  },
  {
    'value': 'Spain',
    'label': 'Spain'
  },
  {
    'value': 'Sri Lanka',
    'label': 'Sri Lanka'
  },
  {
    'value': 'Sudan',
    'label': 'Sudan'
  },
  {
    'value': 'Suriname',
    'label': 'Suriname'
  },
  {
    'value': 'Swaziland',
    'label': 'Swaziland'
  },
  {
    'value': 'Sweden',
    'label': 'Sweden'
  },
  {
    'value': 'Switzerland',
    'label': 'Switzerland'
  },
  {
    'value': 'Syria',
    'label': 'Syria'
  },
  {
    'value': 'Tajikistan',
    'label': 'Tajikistan'
  },
  {
    'value': 'Tanzania',
    'label': 'Tanzania'
  },
  {
    'value': 'Thailand',
    'label': 'Thailand'
  },
  {
    'value': 'Timor Leste',
    'label': 'Timor Leste'
  },
  {
    'value': 'Togo',
    'label': 'Togo'
  },
  {
    'value': 'Trinidad & Tobago',
    'label': 'Trinidad & Tobago'
  },
  {
    'value': 'Tunisia',
    'label': 'Tunisia'
  },
  {
    'value': 'Turkey',
    'label': 'Turkey'
  },
  {
    'value': 'Turkmenistan',
    'label': 'Turkmenistan'
  },
  {
    'value': 'Turks & Caicos Islands',
    'label': 'Turks & Caicos Islands'
  },
  {
    'value': 'Uganda',
    'label': 'Uganda'
  },
  {
    'value': 'Ukraine',
    'label': 'Ukraine'
  },
  {
    'value': 'United Arab Emirates',
    'label': 'United Arab Emirates'
  },
  {
    'value': 'United States of America (USA)',
    'label': 'United States of America (USA)'
  },
  {
    'value': 'Uruguay',
    'label': 'Uruguay'
  },
  {
    'value': 'Uzbekistan',
    'label': 'Uzbekistan'
  },
  {
    'value': 'Venezuela',
    'label': 'Venezuela'
  },
  {
    'value': 'Vietnam',
    'label': 'Vietnam'
  },
  {
    'value': 'Virgin Islands (UK)',
    'label': 'Virgin Islands (UK)'
  },
  {
    'value': 'Virgin Islands (US)',
    'label': 'Virgin Islands (US)'
  },
  {
    'value': 'Yemen',
    'label': 'Yemen'
  },
  {
    'value': 'Zambia',
    'label': 'Zambia'
  },
  {
    'value': 'Zimbabwe',
    'label': 'Zimbabwe'
  }
];
class KycUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: '',
      companyName: '',
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
      isCountryValid: false,
      isStateValid: false,
      isFilePhotoIdValid: false,
      isFileBussinessIdValid: false,
      isFileLicenseValid: false,
      formValid: false,
      selectedOption: [],
      errors: {
      },
      devIpErrors: [],
      liveIpErrors: [],
      jurisErrors: [],
      photoId: '',
      bussinessId: {},
      licenseId: '',
      isPhoneValid: false,
      errorCity: '',
      errorRegion: '',
      role: '',
      token: ''
    }

    if (sessionStorage.getItem('loginInfo') == null) {
      props.history.push('/login');
    } else if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      if (sessionInfo.loginInfo.role != 'User' || sessionInfo.loginInfo.kycStatus != 'Rejected') {
        sessionStorage.removeItem('loginInfo');
        props.history.push('/login');
      }
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
  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({
        role: sessionInfo.loginInfo.role,
        token: sessionInfo.loginInfo.token,
        emailId: sessionInfo.loginInfo.emailId,
        companyName: sessionInfo.loginInfo.companyName
      });
    }
  }

  selectCountryTarget(val) {
    this.setState({ countryTarget: val });
  }

  selectCountry(val) {
    if (val === '') {
      this.setState({ errorCity: 'please select country', isCountryValid: false })
    } else {
      this.setState({ errorCity: '', isCountryValid: true })
    }
    this.setState({ country: val });
    this.setState({ errorRegion: 'please select state', isStateValid: false }, this.validateForm);
  }

  selectRegion(val) {
    if (val === '') {
      this.setState({ errorRegion: 'please select state', isStateValid: false });
    } else {
      this.setState({ errorRegion: '', isStateValid: true });
    }
    this.setState({ region: val }, this.validateForm);
  }

  // Function for dynamic development ip input box creation
  createUI() {
    return this.state.values.map((items, i) =>
      <div key={i}>
        <div className="serverip-div">
          <div className="iptxtinput">
            <input type="text" value={items || ''} onChange={this.handleChangeField.bind(this, i)} />
            <a onClick={this.removeClick.bind(this, i)}>
              <img src="src/public/image/minus.png" alt="remove" />
            </a>
            <span className="error erropos">{this.state.devIpErrors[i]}</span>
          </div>
        </div>
      </div>
    )
  }

  // Function for dynamic live server ip input box creation
  createUILiveServer() {
    return this.state.valuesLiveIp.map((items, i) =>
      <div key={i}>
        <div className="serverip-div">
          <div className="iptxtinput">
            <input type="text" value={items || ''} onChange={this.handleChangeFieldLiveServer.bind(this, i)} />
            <a onClick={this.removeClickLiveIp.bind(this, i)}>
              <img src="src/public/image/minus.png" alt="remove" />
            </a>
            <span className="error erropos">{this.state.liveIpErrors[i]}</span>
          </div>
        </div>
      </div>
    )
  }

  // Function for dynamic licence upload input box creation
  createLicenseFields() {
    return this.state.licValues.map((items, i) => {
      return <div key={i}>
        <div className="remitance-form-div">
          <form>
            <div className="">
              <div className="uploadLicense">
                <div className="form-group">
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
                  <input type="text" name='juris' value={this.state.jurisValues[i]} onChange={this.handleChangeLicFieldsJuris.bind(this, i)} />
                  <span className="error erropos">{this.state.errors.juris}</span>
                </div>
              </div>
              <a className="rightminus" onClick={this.removeClickLicField.bind(this, i)}>
                <img src="src/public/image/minus.png" alt="Remove" />
              </a>
            </div>
          </form>
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
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
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
        this.state.isStateValid &&
        this.state.isCountryValid &&
        this.state.isFilePhotoIdValid &&
        this.state.isFileBussinessIdValid &&
        this.state.isFileLicenseValid &&
        this.state.isLastNameValid
    })
  }

  // onChange function for dynamic development server ip with validation
  handleChangeField(i, event) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
    this.state.isDynamicIpAddressvalid = validateip(values[i]);
    let devIpErrors = [...this.state.devIpErrors];
    devIpErrors[i] = this.state.isDynamicIpAddressvalid ? '' : 'Please enter valid IP address.';
    this.setState({ devIpErrors });
  }

  addClick() {
    this.setState(prevState => ({ values: [...prevState.values, ''] }))
  }

  // Function for remove dynamic created development ip inputbox
  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  // onChange function for dynamic created live server ip with validation
  handleChangeFieldLiveServer(i, event) {
    let valuesLiveIp = [...this.state.valuesLiveIp];
    valuesLiveIp[i] = event.target.value;
    this.setState({ valuesLiveIp });
    this.state.isDynamicLiveIpAddressvalid = validateip(valuesLiveIp[i]);
    let liveIpErrors = [...this.state.liveIpErrors];
    liveIpErrors[i] = this.state.isDynamicLiveIpAddressvalid ? '' : 'Please enter valid IP address.';
    this.setState({ liveIpErrors });
  }

  // onChange function for dynamic license upload input with validation
  handleChangeLicFieldsFile(i, event) {
    const licValues = [...this.state.licValues];
    licValues[i] = event.target.files[0];
    this.setState({ licValues });
  }

  handleChangeLicFieldsJuris(i, event) {
    const jurisValues = [...this.state.jurisValues];
    jurisValues[i] = event.target.value;
    this.setState({ jurisValues });
  }

  addClickLiveIp() {
    this.setState(prevState => ({ valuesLiveIp: [...prevState.valuesLiveIp, ''] }))
  }

  addLicFields() {
    this.setState(prevState => ({ jurisValues: [...prevState.jurisValues, ''] }))
    this.setState(prevState => ({ licValues: [...prevState.licValues, ''] }))
  }

  // Function for remove live server ip input box
  removeClickLiveIp(i) {
    let valuesLiveIp = [...this.state.valuesLiveIp];
    valuesLiveIp.splice(i, 1);
    this.setState({ valuesLiveIp });
  }

  removeClickLicField(i) {
    let jurisValues = [...this.state.jurisValues];
    jurisValues.splice(i, 1);
    let licValues = [...this.state.licValues];
    licValues.splice(i, 1);
    this.setState({ licValues, jurisValues });
  }

  changeTargetMarket(selectedOption) {
    this.setState({ selectedOption });
  }

  handleChangeFile(event) {
    event.preventDefault();
    if (event.target.files.length == 0) {
      this.setState({ [event.target.name]: event.target.files[0], isFilePhotoIdValid: false }, this.validateForm);
    } else { this.setState({ [event.target.name]: event.target.files[0], isFilePhotoIdValid: true }, this.validateForm); }
  }

  handleChangeFileBussiness = (event) => {
    event.preventDefault();
    if (event.target.files.length == 0) {
      this.setState({ [event.target.name]: event.target.files[0], isFileBussinessIdValid: false }, this.validateForm);
    } else { this.setState({ [event.target.name]: event.target.files[0], isFileBussinessIdValid: true }, this.validateForm); }
  }
  handleChangeFileLicence = (event) => {
    event.preventDefault();
    if (event.target.files.length == 0) {
      this.setState({ [event.target.name]: event.target.files[0], isFileLicenseValid: false }, this.validateForm);
    } else { this.setState({ [event.target.name]: event.target.files[0], isFileLicenseValid: true }, this.validateForm); }
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
    // API reuest for upload files and remittense registration
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
    const jurisdiction = this.state.jurisValues.length != 0 ? this.state.juris.concat(',').concat(this.state.jurisValues) : this.state.juris;
    const formData = new FormData();
    formData.append('userInfo', JSON.stringify(details));
    formData.append('targetMarket', targetMarket);
    formData.append('developmentServerIPs', developmentServerIPs);
    formData.append('liveServerIPs', liveServerIPs);
    formData.append('photoId', this.state.photoId);
    formData.append('businessRegistration', this.state.bussinessId);
    formData.append('jurisdiction', jurisdiction);
    formData.append('licenses', this.state.licenseId);
    {
      this.state.licValues.map((each, i) => {
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
          this.props.history.push('/userdashboard');
          notify.show(response.data.message, 'success');
        } else if (response.status === 206) {
          notify.show(response.data.message, 'error');
        } else if (response.data.message === 'Page Session has expired. Please login again') {
          sessionStorage.removeItem('loginInfo');
          this.props.history.push('/login')
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
    const { emailId, companyName, firstName, lastName, formValid, errors, juris, isJurisValid,
      address, city, zipCode, devIp, liveIp, isIpAddressvalid, isLiveIpAddressvalid, phone,
      country, region, selectedOption, errorCity, errorRegion } = this.state;
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
          {/* <div className="remit-logo"></div> */}
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
                            <span className="error erropos">{errors.firstName}</span>
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Last Name
                            </label>
                            <input type="text" value={lastName} onChange={this.handleChange} name='lastName' />
                            <span className="error erropos">{errors.lastName}</span>
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
                            <input type="text" name='phone' value={phone} onChange={this.handleChange} />
                            <span className="error  erropos">{errors.phone}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Address
                            </label>
                            <input type="text" value={address} name='address' onChange={this.handleChange} />
                            <span className="error erropos">{errors.address}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>City
                            </label>
                            <input type="text" value={city} name='city' onChange={this.handleChange} />
                            <span className="error erropos">{errors.city}</span>
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
                            <span className="error erropos">{errorCity}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group pos-relative">
                            <label>State
                            </label>  <div className="slectstateoption">
                              <RegionDropdown
                                country={country}
                                value={region}
                                onChange={(val) => this.selectRegion(val)} /></div>
                            <span className="error erropos">{errorRegion}</span>
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <label>Zip / Post-Code
                            </label>
                            <input type="text" value={zipCode} name='zipCode' onChange={this.handleChange} />
                            <span className="error erropos">{errors.zipCode}</span>
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
                                <span className="error erropos">{errors.devIp}</span>
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
                                <span className="error erropos">{errors.liveIp}</span>
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
                              <input type="file" className='file' onChange={this.handleChangeFile} ref={(ref) => { this.file = ref }} name="photoId" required />
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
                              <input type="file" className='file' onChange={this.handleChangeFileBussiness} ref={(ref) => { this.file = ref }} name="bussinessId" required />
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
                    <div className="remitance-form-div">
                      <form>
                        <div className="col-lg-12 col-sm-12">
                          <div className="uploadLicense">
                            <div className="form-group">
                              <label>License Upload
                              </label>
                              <div className="form-group">
                                <input type="file" className="file" onChange={this.handleChangeFileLicence} ref={(ref) => { this.file = ref }} name="licenseId" required />
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
                              <span className="error erropos">{errors.juris}</span>
                            </div>
                          </div>
                          {isJurisValid && <a className="rightadd" onClick={this.addLicFields.bind(this)}>
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
                      <button type="button" onClick={this.uploadKycDetails} disabled={!formValid || selectedOption == ''}
                        className="sub-info">Submit Information</button>
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
