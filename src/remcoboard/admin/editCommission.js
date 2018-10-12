import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { notify } from 'react-notify-toast';
import _filter from 'lodash/filter';
import _max from 'lodash/max';
import _map from 'lodash/map';
import validateip from 'validate-ip';
import validator from 'validator';

import { base_url } from '../common/apiUrl';
import FeeDeatilsTable from '../common/components/commiEdit/FeeTable/tableHead';
import CommissionTableHead from '../common/components/commiEdit/CommissionSplitUpTable/commissionTableHead';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';

export default class EditCommission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      investorsList: [],
      page: 1,
      isLoading: false,
      isChecked: false,
      companyName: '',
      remitCommission: [],
      firstName: '',
      emailId: '',
      provider: '',
      phone: '',
      city: '',
      address: '',
      accessToken: '',
      accessKey: '',
      ipAddressList: '',
      transLimit: '',
      isProviderValid: true,
      isIpAddressListvalid: true,
      isTransLimitValid: true,
      formValid: true,
      errors: {},
      percentageDTO: [
        {
          percentageId: 0,
          fromAmount: '',
          toAmount: '',
          fixedAmountOfCommission: '',
          percentageOfCommission: ''
        }
      ],
      vTNCommissionDTO: [
        {
          investorPercentageId: 0,
          emailId: '',
          percentageOfInvestor: ''
        }
      ],
      percentageDTOId: 0,
      vTNCommissionDTOId: 0,
      prcentageDtoRmv: [],
      vTNCommissionDtoRmv: [],
      deletedPercentageDto: [],
      perOfInvestorError: [],
      perOfCommissionError: [],
      commissionEmailIdError: [],
      fixAmtError: [''],
      toAmtError: [''],
      fromAmtError: [''],
      isPerOfInvestorValid: true,
      isPerOfCommissionValid: true,
      isFixAmtValid: true,
      isToAmtValid: true,
      isFromAmtValid: true,
      isEmailIdValid: true,
      isToAmtArrValid: true,
      isFrmArrValid: true,
      role: '',
      token: '',
      pagePercentage: 1,
      commissionPage: 1
    };
    // Check athourized or not
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
    this.editCommission(commissionDetails);
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }
  handleCommissionPageChange = (commissionPage) => {
    this.setState({ commissionPage })
  }
  toggleEditUpdate = (commissionItem) => {
    sessionStorage.removeItem('commissionInfo');
    this.props.history.push('/commissionlist');
  }
  editCommission(commissionDetails) {
    this.setState({
      companyName: commissionDetails.companyName,
      firstName: commissionDetails.representativeName,
      emailId: commissionDetails.emailId,
      provider: commissionDetails.remittanceProvider,
      phone: commissionDetails.mobileNo,
      city: commissionDetails.city,
      address: commissionDetails.address,
      accessToken: commissionDetails.accessToken,
      accessKey: commissionDetails.accessKey,
      ipAddressList: commissionDetails.ipAddress,
      transLimit: commissionDetails.dailyTransactionLimit,
      percentageDTO: commissionDetails.percentageDTO,
      vTNCommissionDTO: commissionDetails.vTNCommissionDTO,
      isChecked: !this.state.isChecked,
      formValid: true
    }, () => {
      let idArr = [];
      _map(this.state.percentageDTO, (item, i) => {
        idArr.push(item.percentageId);
      })
      let editPercentId = _max(idArr);
      this.setState({ percentageDTOId: editPercentId });
      let idArrVtn = [];
      _map(this.state.vTNCommissionDTO, (item, i) => {
        idArrVtn.push(item.investorPercentageId);
      })
      let editPercentVtnId = _max(idArrVtn);
      this.setState({ vTNCommissionDTOId: editPercentVtnId });
    });
  }

  // Function for delete selected rows to percentageDTO in set commission
  handleRowDel() {
    if (this.state.prcentageDtoRmv.length !== this.state.percentageDTO.length) {
      let percentageDTO = [...this.state.percentageDTO];
      let fromAmtError = [...this.state.fromAmtError];
      let toAmtError = [...this.state.toAmtError];
      let prcentageDtoRmv = [...this.state.prcentageDtoRmv];
      for (let i = 0; i < percentageDTO.length; i++) {
        for (let j = 0; j < prcentageDtoRmv.length; j++) {
          if (percentageDTO[i].percentageId == prcentageDtoRmv[j]) {
            percentageDTO.splice(i, 1);
            toAmtError.splice(i, 1);
            fromAmtError.splice(i, 1);
            this.setState({ percentageDTO, toAmtError, fromAmtError }, () => () => this.amountValidation());
          }
        }
      }
      this.setState({ prcentageDtoRmv: [] });
    } else notify.show('You Are Not Allow To Delete All Rows', 'error');
  }

  // Function for add rows to percentageDTO in set commission
  handleAddEvent(evt) {
    var id = this.state.percentageDTOId + 1;
    var feeDetail = {
      percentageId: id,
      percentageOfCommission: '',
      toAmount: '',
      fromAmount: '',
      fixedAmountOfCommission: ''
    }
    this.state.percentageDTO.push(feeDetail);
    this.setState(this.state.percentageDTO);
    this.setState({ percentageDTOId: id });
    // let pageMv = Math.ceil(this.state.percentageDTO.length / 3);
    // this.setState({page: pageMv});
  }

  // Function for onChange to percentageDTO in set commission
  handleProductTable(evt) {
    if (evt.target.name === 'checkValue' && evt.target.checked === true) {
      let prcentageDtoRmv = [...this.state.prcentageDtoRmv];
      prcentageDtoRmv.push(evt.target.id);
      this.setState({ prcentageDtoRmv });
    } else if (evt.target.name === 'checkValue' && evt.target.checked === false) {
      let prcentageDtoRmv = [...this.state.prcentageDtoRmv];
      var index = prcentageDtoRmv.indexOf(evt.target.id);
      prcentageDtoRmv.splice(index, 1);
      this.setState({ prcentageDtoRmv });
    }
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var percentageDTO = this.state.percentageDTO.slice();
    var newProducts = percentageDTO.map(function (feeDetail, i) {
      for (var key in feeDetail) {
        if (key == item.name && feeDetail.percentageId == item.id) {
          const re = /^[0-9.]+$/;
          if (item.value === '' || re.test(item.value)) {
            feeDetail[key] = item.value;
          }
        }
      }
      return feeDetail;
    });
    this.setState({ percentageDTO: newProducts }, () => { this.validateField(item.name, item.value, item.id) });
  }

  // Function for delete selected commission splitup rows in set commission
  clickCommiSplitRowDel(commissionDetail) {
    if (this.state.vTNCommissionDtoRmv.length !== this.state.vTNCommissionDTO.length) {
      let vTNCommissionDTO = [...this.state.vTNCommissionDTO];
      let vTNCommissionDtoRmv = [...this.state.vTNCommissionDtoRmv];
      for (let i = 0; i < vTNCommissionDTO.length; i++) {
        for (let j = 0; j < vTNCommissionDtoRmv.length; j++) {
          if (vTNCommissionDTO[i].investorPercentageId == vTNCommissionDtoRmv[j]) {
            vTNCommissionDTO.splice(i, 1);
            this.setState({ vTNCommissionDTO });
          }
        }
      }
      this.setState({ vTNCommissionDtoRmv: [] });
    } else notify.show('You Are Not Allow To Delete All Rows', 'error');
  }

  // Function for add row to commission splitup in set commission
  clickCommiSplitAddRow(evt) {
    var id = this.state.vTNCommissionDTOId + 1;
    var commissionDetail = {
      investorPercentageId: id,
      percentageOfInvestor: '',
      emailId: ''
    }
    this.state.vTNCommissionDTO.push(commissionDetail);
    this.setState(this.state.vTNCommissionDTO);
    this.setState({ vTNCommissionDTOId: id });
    // let commiPageMv = Math.ceil(this.state.vTNCommissionDTOId.length / 3);
    // this.setState({commissionPage: commiPageMv});
  }

  // Function for onChnage to commission splitup in set commission
  clickCommiSplitValuesChange(evt) {
    if (evt.target.name === 'checkValue' && evt.target.checked === true) {
      let vTNCommissionDtoRmv = [...this.state.vTNCommissionDtoRmv];
      vTNCommissionDtoRmv.push(evt.target.id);
      this.setState({ vTNCommissionDtoRmv });
    } else if (evt.target.name === 'checkValue' && evt.target.checked === false) {
      let vTNCommissionDtoRmv = [...this.state.vTNCommissionDtoRmv];
      var index = vTNCommissionDtoRmv.indexOf(evt.target.id);
      vTNCommissionDtoRmv.splice(index, 1);
      this.setState({ vTNCommissionDtoRmv });
    }
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var vTNCommissionDTO = this.state.vTNCommissionDTO.slice();
    var newProducts = vTNCommissionDTO.map(function (commissionDetail) {
      for (var key in commissionDetail) {
        if (key == item.name && commissionDetail.investorPercentageId == item.id && item.name == 'percentageOfInvestor') {
          const re = /^[0-9.]+$/;
          if (item.value === '' || re.test(item.value)) {
            commissionDetail[key] = item.value;
          }
        } else if (key == item.name && commissionDetail.investorPercentageId == item.id) {
          commissionDetail[key] = item.value;
        }
      }
      return commissionDetail;
    });
    this.setState({ vTNCommissionDTO: newProducts });
    this.validateField(item.name, item.value, item.id)
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

  // Function for validate all the fields
  validateField(fieldName, value, i) {
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
      case 'provider':
        this.state.isProviderValid = !validator.isEmpty(value);
        fieldValidationErrors.provider = this.state.isProviderValid ? '' : 'Please enter remittance provider.';
        break;
      case 'transLimit':
        this.state.isTransLimitValid = !validator.isEmpty(value);
        fieldValidationErrors.transLimit = this.state.isTransLimitValid ? '' : 'Please enter daily transaction limit.';
        break;
      case 'ipAddressList':
        this.state.isIpAddressListvalid = validateip(value);
        fieldValidationErrors.ipAddressList = this.state.isIpAddressListvalid ? '' : 'Please enter valid IP address.';
        break;
      case 'percentageOfInvestor':
        this.state.isPerOfInvestorValid = !validator.isEmpty(value) && validator.isNumeric(value) && !(value > 100 || value < 0.1)
        this.state.perOfInvestorError[i] = this.state.isPerOfInvestorValid ? '' : 'Please enter valid percentage.';
        break;
      case 'emailId':
        this.state.isEmailIdValid = !validator.isEmpty(value) && value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        this.state.commissionEmailIdError[i] = this.state.isEmailIdValid ? '' : 'Please select email id.';
        break;
      case 'percentageOfCommission':
        this.state.isPerOfCommissionValid = !validator.isEmpty(value) && validator.isNumeric(value) && !(value > 100 || value < 0.1)
        this.state.perOfCommissionError[i] = this.state.isPerOfCommissionValid ? '' : 'Please enter valid percentage.';
        break;
      case 'fixedAmountOfCommission':
        this.state.isFixAmtValid = !validator.isEmpty(value) && validator.isNumeric(value);
        this.state.fixAmtError[i] = this.state.isFixAmtValid ? '' : 'Please enter fixed amount.';
        break;
      case 'fromAmount':
        this.amountValidation(value);
        this.state.isFromAmtValid = !validator.isEmpty(value) && validator.isNumeric(value);
        this.state.fromAmtError[i] = this.state.isFromAmtValid ? '' : 'Please enter from amount.';
        break;
      case 'toAmount':
        this.amountValidation(value);
        this.state.isToAmtValid = !validator.isEmpty(value) && validator.isNumeric(value);
        this.state.toAmtError[i] = this.state.isToAmtValid ? '' : 'Please enter to amount.';
        break;
      default:
        break;
    }

    let fromAmtError = [...this.state.fromAmtError];
    for (let i = 0; i < fromAmtError.length; i++) {
      if (fromAmtError[i] == 'Please Enter "From Amount"' || fromAmtError[i] == 'Invalid "From Amount"') {
        this.setState({ isFrmArrValid: false }, this.validateForm);
        break;
      } else this.setState({ isFrmArrValid: true }, this.validateForm);
    }

    let toAmtError = [...this.state.toAmtError];
    for (let i = 0; i < toAmtError.length; i++) {
      if (toAmtError[i] == 'Please Enter "To Amount"' || toAmtError[i] == 'Invalid "To Amount"' || toAmtError[i] == '"To Amount" value should be grater than "From Amount"') {
        this.setState({ isToAmtArrValid: false }, this.validateForm);
        break;
      } else this.setState({ isToAmtArrValid: true }, this.validateForm);
    }

    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }

  validateForm() {
    this.setState({
      formValid: this.state.isTransLimitValid &&
        this.state.isProviderValid &&
        this.state.isEmailIdValid &&
        this.state.isPerOfCommissionValid &&
        this.state.isFixAmtValid &&
        this.state.isToAmtValid &&
        this.state.isFromAmtValid &&
        this.state.isFrmArrValid &&
        this.state.isToAmtArrValid &&
        this.state.isPerOfInvestorValid
    })
  }

  // Function for validate from amount and to amount in percentageDTO table edit commission
  amountValidation = (value) => {
    let fromAmtError = [...this.state.fromAmtError];
    let toAmtError = [...this.state.toAmtError];
    for (let i = this.state.percentageDTO.length - 1; i >= 0; i--) {
      let percentageDTO = [...this.state.percentageDTO];
      if (percentageDTO[i].fromAmount == '' && percentageDTO[i].toAmount == '') {
        fromAmtError[i] = ' ';
        toAmtError[i] = ' ';
      } else if (percentageDTO[i].fromAmount != '' && percentageDTO[i].toAmount == '') {
        toAmtError[i] = 'Please Enter "To Amount"';
        try {
          if (fromAmtError[i].includes('Please Enter "From Amount"')) {
            fromAmtError[i] = ' ';
          }
        } catch (err) { }
        for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
          if (j != i) {
            if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
              try {
                if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                  fromAmtError[i] = 'Invalid "From Amount"';
                  break;
                } else if (fromAmtError[i].includes('Invalid "From Amount"')) {
                  fromAmtError[i] = ' ';
                }
              } catch (err) { }
            }
          }
        }
      } else if (percentageDTO[i].fromAmount == '' && percentageDTO[i].toAmount != '') {
        fromAmtError[i] = 'Please Enter "From Amount"';
        try {
          if (toAmtError[i].includes('"To Amount" value should be grater than "From Amount"')) {
            toAmtError[i] = ' ';
          }
        } catch (err) { }
        try {
          if (toAmtError[i].includes('Please Enter "To Amount"')) {
            toAmtError[i] = ' ';
          }
        } catch (err) { }
        for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
          try {
            if (j != i) {
              if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                  toAmtError[i] = 'Invalid "To Amount"';
                  break;
                } else if (toAmtError[i].includes('Invalid "To Amount"')) {
                  toAmtError[i] = ' ';
                }
              }
            }
          } catch (err) { }
        }
      } else if (percentageDTO[i].fromAmount != '' && percentageDTO[i].toAmount != '') {
        try {
          if (parseInt(percentageDTO[i].fromAmount) >= parseInt(percentageDTO[i].toAmount)) {
            toAmtError[i] = '"To Amount" value should be grater than "From Amount"';
          } else if ((parseInt(percentageDTO[i].fromAmount) < parseInt(percentageDTO[i].toAmount)) && (toAmtError[i].includes('"To Amount" value should be grater than "From Amount"'))) {
            toAmtError[i] = ' ';
          }
        } catch (err) { }
        try {
          if (fromAmtError[i].includes('Please Enter "From Amount"')) {
            fromAmtError[i] = ' ';
          }
        } catch (err) { }
        try {
          if (toAmtError[i].includes('Please Enter "To Amount"')) {
            toAmtError[i] = ' ';
          }
        } catch (err) { }
        try {
          if (fromAmtError[i].includes('Invalid "From Amount"')) {
            let percentageDTO = [...this.state.percentageDTO]
            let frAmtVal = percentageDTO[i].fromAmount;
            for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
              try {
                if (j != i) {
                  if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                    if (parseInt(frAmtVal) >= parseInt(percentageDTO[j].fromAmount) && parseInt(frAmtVal) <= parseInt(percentageDTO[j].toAmount)) {
                      fromAmtError[i] = 'Invalid "From Amount"';
                      break;
                    } else if (fromAmtError[i].includes('Invalid "From Amount"')) {
                      fromAmtError[i] = ' ';
                    }
                  }
                }
              } catch (err) { }
            }
          }
          //  TODO : check to amount conditions
          if (toAmtError[i].includes('Invalid "To Amount"')) {
            let percentageDTO = [...this.state.percentageDTO]
            let toAmtVal = percentageDTO[i].toAmount;
            for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
              try {
                if (j != i) {
                  if (percentageDTO[j].toAmount != '' && percentageDTO[j].fromAmount != '') {
                    if (parseInt(toAmtVal) >= parseInt(percentageDTO[j].fromAmount) && parseInt(toAmtVal) <= parseInt(percentageDTO[j].toAmount)) {
                      toAmtError[i] = 'Invalid "To Amount"';
                      break;
                    } else if (toAmtError[i].includes('Invalid "To Amount"')) {
                      toAmtError[i] = ' ';
                    }
                  }
                }
              } catch (err) { }
            }
          }
        } catch (err) { }
        if (parseInt(value) == parseInt(percentageDTO[i].fromAmount)) {
          for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
            try {
              if (j != i) {
                if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                  if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                    fromAmtError[i] = 'Invalid "From Amount"';
                    break;
                  } else if (fromAmtError[i].includes('Invalid "From Amount"')) {
                    fromAmtError[i] = ' ';
                  }
                }
              }
            } catch (err) { }
          }
        } else if (parseInt(value) == parseInt(percentageDTO[i].toAmount)) {
          for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
            try {
              if (j != i) {
                if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                  if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                    toAmtError[i] = 'Invalid "To Amount"';
                    break;
                  } else if (toAmtError[i].includes('Invalid "To Amount"')) {
                    toAmtError[i] = ' ';
                  }
                }
              }
            } catch (err) { }
          }
        } else {
          let percentageDTO = [...this.state.percentageDTO]
          let toAmtVal = percentageDTO[i].toAmount;
          let fromAmtVal = percentageDTO[i].fromAmount;
          for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
            try {
              if (j != i) {
                if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                  if (parseInt(fromAmtVal) >= parseInt(percentageDTO[j].fromAmount) && parseInt(fromAmtVal) <= parseInt(percentageDTO[j].toAmount)) {
                    fromAmtError[i] = 'Invalid "From Amount"';
                    break;
                  } else if (fromAmtError[i].includes('Invalid "From Amount"')) {
                    fromAmtError[i] = ' ';
                  }
                }
                if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                  if (parseInt(toAmtVal) >= parseInt(percentageDTO[j].fromAmount) && parseInt(toAmtVal) <= parseInt(percentageDTO[j].toAmount)) {
                    toAmtError[i] = 'Invalid "To Amount"';
                    break;
                  } else if (toAmtError[i].includes('Invalid "To Amount"')) {
                    toAmtError[i] = ' ';
                  }
                }
              }
            } catch (err) { }
          }
        }

      }
      if (fromAmtError[i] == '') {
        fromAmtError[i] = ' ';
      }
      if (toAmtError[i] == '') {
        toAmtError[i] = ' ';
      }
    }
    this.setState({ fromAmtError, toAmtError }, this.validateField);
  }

  commissionSelect = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value,
      remitCommission: _filter(this.state.remitCompList, { companyName: value })[0]
    }, () => { this.setCommissionDetails() });
  }

  setCommissionDetails = () => {
    if (this.state.remitCommission) {
      this.setState({
        firstName: this.state.remitCommission.firstName,
        emailId: this.state.remitCommission.emailId,
        phone: this.state.remitCommission.phone,
        city: this.state.remitCommission.city,
        address: this.state.remitCommission.address,
        accessToken: this.state.remitCommission.accessToken,
        ipAddressList: this.state.remitCommission.ipAddress,
        accessKey: this.state.remitCommission.accessKey
      });
    } else {
      this.setState({
        firstName: '',
        emailId: '',
        phone: '',
        city: '',
        address: '',
        accessToken: '',
        accessKey: ''
      });
    }
  }

  setCommision = () => {
    // API request for setting commission details
    const investorUrl = base_url + 'admin/set/remittance/details';
    this.setState({ isLoading: true });
    const payLoad = {
      'companyName': this.state.companyName,
      'emailId': this.state.emailId,
      'mobileNo': this.state.phone,
      'address': this.state.address,
      'status': 1,
      'dailyTransactionLimit': this.state.transLimit,
      'representativeName': this.state.firstName,
      'remittanceProvider': this.state.provider,
      'city': this.state.city,
      'accessToken': this.state.accessToken,
      'accessKey': this.state.accessKey,
      'ipAddress': this.state.ipAddressList,
      'percentageDTO': this.state.percentageDTO,
      'vTNCommissionDTO': this.state.vTNCommissionDTO
    }
    axios.post(investorUrl, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({
          investorsList: [],
          page: 1,
          isLoading: false,
          isChecked: false,
          companyName: '',
          remitCommission: [],
          firstName: '',
          emailId: '',
          provider: '',
          phone: '',
          city: '',
          address: '',
          accessToken: '',
          accessKey: '',
          ipAddressList: '',
          transLimit: '',
          isProviderValid: true,
          isIpAddressListvalid: true,
          isTransLimitValid: true,
          formValid: true,
          errors: {},
          percentageDTO: [
            {
              percentageId: 0,
              fromAmount: '',
              toAmount: '',
              fixedAmountOfCommission: '',
              percentageOfCommission: ''
            }
          ],
          vTNCommissionDTO: [
            {
              investorPercentageId: 0,
              emailId: '',
              percentageOfInvestor: ''
            }
          ],
          percentageDTOId: 0,
          vTNCommissionDTOId: 0,
          prcentageDtoRmv: [],
          vTNCommissionDtoRmv: [],
          deletedPercentageDto: [],
          perOfInvestorError: [],
          perOfCommissionError: [],
          commissionEmailIdError: [],
          fixAmtError: [''],
          toAmtError: [''],
          fromAmtError: [''],
          isPerOfInvestorValid: true,
          isPerOfCommissionValid: true,
          isFixAmtValid: true,
          isToAmtValid: true,
          isFromAmtValid: true,
          isEmailIdValid: true,
          isToAmtArrValid: true,
          isFrmArrValid: true,
          role: '',
          token: '',
          pagePercentage: 1,
          commissionPage: 1
        });
        this.toggleEditUpdate();
        notify.show(response.data.message, 'success');
      } else if (response.status === 206 && response.data.message === 'Page Session has expired. Please login again') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
        notify.show(response.data.message, 'error');
      } else if (response.status === 206) {
        notify.show(response.data.message, 'error');
      }
    }).catch(error => {
      this.setState({ isLoading: false });
      if (error.response.status == 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      } else if (error.response.status == 409) {
        notify.show('Please enter all fields', 'error')
      } else {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      }
    });
  }

  render() {
    const { isChecked, companyName, errors, firstName, address, formValid, role, page,
      perOfInvestorError, emailId, provider, phone, city, accessKey, accessToken, ipAddressList, commissionPage,
      transLimit, commissionEmailIdError, fixAmtError, perOfCommissionError, toAmtError, fromAmtError } = this.state;
    return (
      <Fragment>
        {
          <div className="cbp-spmenu-push">
            <SideMenu propsRole={role} />
            <HeaderCommon propsPush={this.props} />
            <div id="page-wrapper" className="sdf">
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
                                  <input type="text" placeholder="Company Name" name='companyName' value={companyName} readOnly />
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Representative Name
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Representative Name" value={firstName || ''} name='firstName' readOnly />
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Remittance Provider Email Address
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Email Address" value={emailId || ''} readOnly />
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Remittance Provider
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Remittance Provider" name='provider' value={provider} onChange={this.handleChange} />
                                  <span className="error erropos">{errors.provider}</span>
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Phone Number
                                    <sup>*</sup>
                                  </label>
                                  <input type="number" placeholder="Phone Number" value={phone || ''} readOnly />
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>City
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="City" value={city || ''} readOnly />
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Remittance Provider Address
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Remittance Provider Address" value={address || ''} readOnly />
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Access Token
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Access Token" value={accessToken || ''} readOnly />
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Access Key
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Access Token" value={accessKey || ''} readOnly />
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
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>IP Address White List
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Company Name" name='ipAddressList' value={ipAddressList} />
                                  {/* <p> Note: <span> Enter multiple ip seperated by comma.</span></p> */}
                                  {/* <span className="error erropos">{errors.ipAddressList}</span> */}
                                </div>
                              </div>
                              <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                                <div className="form-group">
                                  <label>Daily Transaction Limit
                                    <sup>*</sup>
                                  </label>
                                  <input type="text" placeholder="Daily Transaction Limit" name='transLimit' value={transLimit} onChange={this.numChange} />
                                  <span className="error erropos">{errors.transLimit}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className="feeicon">Fee Details</h1>
                          <div className="persional-info-form">
                            <div className="fee-checkbox">
                              <div className="inputGroup">
                                <input id="option1" name="option1" type="checkbox" checked={isChecked} onChange={() => this.setState({ isChecked: !this.state.isChecked })} />
                                <label htmlFor="option1">Is Fee Allowed</label>
                              </div>
                            </div>
                            {isChecked && <FeeDeatilsTable isEdit onProductTableUpdate={this.handleProductTable.bind(this)}
                              onRowAdd={this.handleAddEvent.bind(this)} perOfCommissionError={perOfCommissionError} fixAmtError={fixAmtError}
                              onRowDel={this.handleRowDel.bind(this)} percentageDTO={this.state.percentageDTO} handlePageChange={this.handlePageChange}
                              toAmtError={toAmtError} fromAmtError={fromAmtError} page={page} perPage={3} />}
                            <div className="clearfix"></div>
                          </div>

                          {isChecked && <Fragment> <h1 className="commissionIcon">Commission Percentage</h1>
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
                              <CommissionTableHead perOfInvestorError={perOfInvestorError} commissionEmailIdError={commissionEmailIdError} isEdit
                                handlePageChange={this.handleCommissionPageChange} onProductTableUpdate={this.clickCommiSplitValuesChange.bind(this)}
                                onRowAdd={this.clickCommiSplitAddRow.bind(this)} onRowDel={this.clickCommiSplitRowDel.bind(this)}
                                vTNCommissionDTO={this.state.vTNCommissionDTO} page={commissionPage} perPage={3} />
                              <div className="clearfix"></div>
                            </div> </Fragment>}
                          <div className="commissionbtn">
                            <button type="button" onClick={this.toggleEditUpdate} className="cancelbtn">Back</button>
                            <button type="button" disabled={!(formValid && companyName != '')} onClick={this.setCommision} className="commission-submit">Submit</button>
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
        }
      </Fragment>
    )
  }
}
