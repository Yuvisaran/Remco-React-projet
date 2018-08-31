import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _remove from 'lodash/remove';
import validateip from 'validate-ip';
import validator from 'validator';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import FeeDeatilsTable from '../common/components/commiEdit/FeeTable/tableHead';
import CommissionTableHead from '../common/components/commiEdit/CommissionSplitUpTable/commissionTableHead';

export default class Commission extends Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    this.state = {
      investorsList: [],
      page: 1,
      isLoading: false,
      role: sessionInfo.loginInfo.role,
      token: sessionInfo.loginInfo.token,
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
      isProviderValid: false,
      isIpAddressListvalid: false,
      isTransLimitValid: false,
      formValid: false,
      errors: {},
      percentageDTO: [
        {
          id: 0,
          fromAmount: '',
          toAmount: '',
          fixedAmountOfCommission: '',
          percentageOfCommission: ''
        }
      ],
      vTNCommissionDTO: [
        {
          id: 0,
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
      fixAmtError: [],
      toAmtError: [],
      fromAmtError: [],
      isPerOfInvestorValid: false,
      isPerOfCommissionValid: false,
      isFixAmtValid: false,
      isToAmtValid: false,
      isFromAmtValid: false,
      isEmailIdValid: false
    };
  }
  // componentWillMount() {
  //   if (this.props.location.state != null) {
  //     this.editCommission();
  //   }
  // }
  componentDidMount() {
    const api_url = base_url + 'admin/list/kyc';
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      console.log('listKyc', response.data.kycList);
      if (response.status === 200) {
        this.setState({ remitCompList: _filter(response.data.kycList, { kycStatus: 'Approved' }) })
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
  componentWillReceiveProps(nextProps) {
    console.log('will recieve props called');
    if (nextProps !== this.props.location.state) {
      console.log('will recieve props printed', this.props, nextProps);
      this.setState({
        companyName: this.props.companyName,
        firstName: this.props.representativeName,
        emailId: this.props.emailId,
        provider: this.props.remittanceProvider,
        phone: this.props.mobileNo,
        city: this.props.city,
        address: this.props.address,
        accessToken: this.props.accessToken,
        accessKey: this.props.accessKey,
        ipAddressList: this.props.ipAddress,
        transLimit: this.props.dailyTransactionLimit,
        percentageDTO: this.props.percentageDTO,
        vTNCommissionDTO: this.props.vTNCommissionDTO
      });
    }
  }
  // editCommission = () => {
  //   console.log('calledsetcommi')
  //   this.setState({
  //     companyName: this.props.companyName,
  //     firstName: this.props.representativeName,
  //     emailId: this.props.emailId,
  //     provider: this.props.remittanceProvider,
  //     phone: this.props.mobileNo,
  //     city: this.props.city,
  //     address: this.props.address,
  //     accessToken: this.props.accessToken,
  //     accessKey: this.props.accessKey,
  //     ipAddressList: this.props.ipAddress,
  //     transLimit: this.props.dailyTransactionLimit,
  //     percentageDTO: this.props.percentageDTO,
  //     vTNCommissionDTO: this.props.vTNCommissionDTO
  //   });
  // }
  handleRowDel() {
    if (this.state.prcentageDtoRmv.length !== this.state.percentageDTO.length) {
      console.log('delete')
      let percentageDTO = [...this.state.percentageDTO];
      let prcentageDtoRmv = [...this.state.prcentageDtoRmv];
      console.log('deleted progress', percentageDTO)
      for (let i = 0; i < percentageDTO.length; i++) {
        for (let j = 0; j < prcentageDtoRmv.length; j++) {
          // console.log('fdgdgdfg', prcentageDtoRmv[j], percentageDTO[i].id)
          if (percentageDTO[i].id == prcentageDtoRmv[j]) {
            // if (prcentageDtoRmv[j] == percentageDTO[i].id) {
            percentageDTO.splice(i, 1);
            this.setState({ percentageDTO });
            console.log('pppppppppppp', this.state.percentageDTO)
          }
        }
      }
      this.setState({ prcentageDtoRmv: [] });
      console.log('deleted', this.state.percentageDTO, this.state.prcentageDtoRmv)
    } else notify.show('You Are Not Allow To Delete All Rows', 'error');
  }
  handleAddEvent(evt) {
    var id = this.state.percentageDTOId + 1;
    var feeDetail = {
      id: id,
      percentageOfCommission: '',
      toAmount: '',
      fromAmount: '',
      fixedAmountOfCommission: ''
    }
    this.state.percentageDTO.push(feeDetail);
    this.setState(this.state.percentageDTO);
    this.setState({ percentageDTOId: id });
  }

  handleProductTable(evt) {
    console.log('evevve', evt.target.id)
    console.log('evevve', evt.target.checked)
    console.log('evevve', evt.target.name)
    if (evt.target.name === 'checkValue' && evt.target.checked === true) {
      console.log('yuvi')
      let prcentageDtoRmv = [...this.state.prcentageDtoRmv];
      prcentageDtoRmv.push(evt.target.id);
      this.setState({ prcentageDtoRmv }, () => console.log('thisprsetremovAdd ids', this.state.prcentageDtoRmv));
    } else if (evt.target.name === 'checkValue' && evt.target.checked === false) {
      console.log('yuvi else part')
      let prcentageDtoRmv = [...this.state.prcentageDtoRmv];
      var index = prcentageDtoRmv.indexOf(evt.target.id);
      prcentageDtoRmv.splice(index, 1);
      this.setState({ prcentageDtoRmv }, () => console.log('thisprsetremoveDelete ids', this.state.prcentageDtoRmv));
    }
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    // console.log('evet table ', this.state.percentageDTO.indexOf(evt.target.id))
    var percentageDTO = this.state.percentageDTO.slice();
    var newProducts = percentageDTO.map(function (feeDetail) {
      for (var key in feeDetail) {
        if (key == item.name && feeDetail.id == item.id) {
          const re = /^[0-9\b]+$/;
          if (item.value === '' || re.test(item.value)) {
            feeDetail[key] = item.value;
          }
        }
      }
      return feeDetail;
    });
    this.setState({ percentageDTO: newProducts });
    this.validateField(item.name, item.value, item.id);
    //  console.log(this.state.percentageDTO);
  }
  clickCommiSplitRowDel(commissionDetail) {
    if (this.state.vTNCommissionDtoRmv.length !== this.state.vTNCommissionDTO.length) {
      console.log('delete')
      let vTNCommissionDTO = [...this.state.vTNCommissionDTO];
      let vTNCommissionDtoRmv = [...this.state.vTNCommissionDtoRmv];
      console.log('deleted progress', vTNCommissionDTO)
      for (let i = 0; i < vTNCommissionDTO.length; i++) {
        for (let j = 0; j < vTNCommissionDtoRmv.length; j++) {
          console.log('fdgdgdfg', vTNCommissionDtoRmv[j], vTNCommissionDTO[i].id)
          if (vTNCommissionDTO[i].id == vTNCommissionDtoRmv[j]) {
            vTNCommissionDTO.splice(i, 1);
            this.setState({ vTNCommissionDTO });
            console.log('pppppppppppp', this.state.vTNCommissionDTO)
          }
        }
      }
      this.setState({ vTNCommissionDtoRmv: [] });
      console.log('deleted', this.state.vTNCommissionDTO, this.state.vTNCommissionDtoRmv)
    } else notify.show('You Are Not Allow To Delete All Rows', 'error');
    // var index = this.state.vTNCommissionDTO.indexOf(commissionDetail);
    // this.state.vTNCommissionDTO.splice(index, 1);
    // this.setState(this.state.vTNCommissionDTO);
  }

  clickCommiSplitAddRow(evt) {
    var id = this.state.vTNCommissionDTOId + 1;
    var commissionDetail = {
      id: id,
      percentageOfInvestor: '',
      emailId: ''
    }
    this.state.vTNCommissionDTO.push(commissionDetail);
    this.setState(this.state.vTNCommissionDTO);
    this.setState({ vTNCommissionDTOId: id });
  }

  clickCommiSplitValuesChange(evt) {
    if (evt.target.name === 'checkValue' && evt.target.checked === true) {
      console.log('yuvi')
      let vTNCommissionDtoRmv = [...this.state.vTNCommissionDtoRmv];
      vTNCommissionDtoRmv.push(evt.target.id);
      this.setState({ vTNCommissionDtoRmv }, () => console.log('thisprsetremovAdd ids', this.state.vTNCommissionDtoRmv));
    } else if (evt.target.name === 'checkValue' && evt.target.checked === false) {
      console.log('yuvi else part')
      let vTNCommissionDtoRmv = [...this.state.vTNCommissionDtoRmv];
      var index = vTNCommissionDtoRmv.indexOf(evt.target.id);
      vTNCommissionDtoRmv.splice(index, 1);
      this.setState({ vTNCommissionDtoRmv }, () => console.log('thisprsetremoveDelete ids', this.state.vTNCommissionDtoRmv));
    }
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var vTNCommissionDTO = this.state.vTNCommissionDTO.slice();
    var newProducts = vTNCommissionDTO.map(function (commissionDetail) {
      for (var key in commissionDetail) {
        if (key == item.name && commissionDetail.id == item.id && item.name == 'percentageOfInvestor') {
          const re = /^[0-9\b]+$/;
          if (item.value === '' || re.test(item.value)) {
            commissionDetail[key] = item.value;
          }
        } else if (key == item.name && commissionDetail.id == item.id) {
          commissionDetail[key] = item.value;
        }
      }
      return commissionDetail;
    });
    this.setState({ vTNCommissionDTO: newProducts });
    this.validateField(item.name, item.value, item.id)
    //  console.log(this.state.vTNCommissionDTO);
  }
  handleChange = (e) => {
    console.log('evet', e.target.name, e.target.value)
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(fieldName, value, i) {
    console.log(value, 'value')
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
        this.state.isPerOfInvestorValid = !(value > 100 || value < 1);
        this.state.perOfInvestorError[i] = this.state.isPerOfInvestorValid ? '' : 'Please enter valid percentage.';
        break;
      case 'emailId':
        this.state.isEmailIdValid = !validator.isEmpty(value) && value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        this.state.commissionEmailIdError[i] = this.state.isEmailIdValid ? '' : 'Please select email id.';
        break;
      case 'percentageOfCommission':
        this.state.isPerOfCommissionValid = !(value > 100 || value < 1);
        this.state.perOfCommissionError[i] = this.state.isPerOfCommissionValid ? '' : 'Please enter valid percentage.';
        break;
      case 'fixedAmountOfCommission':
        this.state.isFixAmtValid = !validator.isEmpty(value);
        this.state.fixAmtError[i] = this.state.isFixAmtValid ? '' : 'Please enter fixed amount.';
        break;
      case 'fromAmount':
        this.amountValidation(value, i);
        this.state.isFromAmtValid = !validator.isEmpty(value);
        this.state.fromAmtError[i] = this.state.isFromAmtValid ? '' : 'Please enter from amount.';
        break;
      case 'toAmount':
        this.amountValidation(value, i)
        this.state.isToAmtValid = !validator.isEmpty(value);
        this.state.toAmtError[i] = this.state.isToAmtValid ? '' : 'Please enter to amount.';
        break;
      default:
        break;
    }
    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }

  validateForm() {
    this.setState({
      formValid: this.state.isIpAddressListvalid &&
        this.state.isTransLimitValid &&
        this.state.isProviderValid &&
        this.state.isEmailIdValid &&
        this.state.isPerOfCommissionValid &&
        this.state.isFixAmtValid &&
        this.state.isToAmtValid &&
        this.state.isFromAmtValid &&
        this.state.isPerOfInvestorValid
    })
  }
  amountValidation = (value, c_index) => {
    // let fromAmtError = [];
    // let toAmtError = [];
    let fromAmtError = [...this.state.fromAmtError];
    let toAmtError = [...this.state.toAmtError];
    // this.setState((state) => ({fromAmtError, toAmtError}));
    for (let i = this.state.percentageDTO.length - 1; i >= 0; i--) {
      //    let i=this.state.percentageDTO.length-1;  
      console.log('lenths:', this.state.percentageDTO.length, 'to err:', this.state.toAmtError, 'fr err:', this.state.fromAmtError)
      // console.log('')
      let percentageDTO = [...this.state.percentageDTO];
      //"From Amount" value should be less than "To Amount"
      if (percentageDTO[i].fromAmount == '' && percentageDTO[i].toAmount == '') {

        fromAmtError[i] = 'Nil';
        toAmtError[i] = 'Nil';
      } else if (percentageDTO[i].fromAmount != '' && percentageDTO[i].toAmount == '') {
        toAmtError[i] = 'Please Enter "To Amount"';
        //    this.setState((state) => ({toAmtError}));
        //  let fromAmtError = [...this.state.fromAmtError];
        console.log('tyupe', typeof (fromAmtError), fromAmtError);
        try {
          if (fromAmtError[i].includes('Please Enter "From Amount"')) {
            fromAmtError[i] = 'Nil';
            ////     this.setState((state) => ({fromAmtError}));
          }
        }
        catch (err) {
        }
        for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
          //      let fromAmtError = [...this.state.fromAmtError];
          if (j != i) {
            if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
              if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                fromAmtError[i] = 'Invalid "From Amount"';
                //        this.setState((state) => ({fromAmtError}));
                break;
              }
              else if (fromAmtError[i].includes('Invalid "From Amount"')) {
                fromAmtError[i] = 'Nil';
              }
            }
          }
        }
      } else if (percentageDTO[i].fromAmount == '' && percentageDTO[i].toAmount != '') {
        //   let fromAmtError = [...this.state.fromAmtError];
        fromAmtError[i] = 'Please Enter "From Amount"';
        ////this.setState((state) => ({fromAmtError}));
        // let toAmtError = [...this.state.toAmtError];
        try {
          console.log('toAmtError[i] ', toAmtError[i]);
          if (toAmtError[i].includes('"From Amount" value should be less than "To Amount"')) {
            toAmtError[i] = 'Nil';
            //       this.setState((state) => ({toAmtError}));
          }

        }
        catch (err) {
        }

        try {
          if (toAmtError[i].includes('Please Enter "To Amount"')) {
            toAmtError[i] = 'Nil';
            //      this.setState((state) => ({toAmtError}));
          }
        }
        catch (err) { }
        for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
          //       let toAmtError = [...this.state.toAmtError];
          if (j != i) {
            if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
              if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                toAmtError[i] = 'Invalid "To Amount"';
                //         this.setState((state) => ({toAmtError}));
                break;
              }
              else if (toAmtError[i].includes('Invalid "To Amount"')) {
                toAmtError[i] = 'Nil';
              }
            }
          }
        }

      } else if (percentageDTO[i].fromAmount != '' && percentageDTO[i].toAmount != '') {
        //     let toAmtError = [...this.state.toAmtError];
        if (parseInt(percentageDTO[i].fromAmount) >= parseInt(percentageDTO[i].toAmount)) {
          toAmtError[i] = '"From Amount" value should be less than "To Amount"';
          //       this.setState((state) => ({toAmtError}));
        }
        else if ((parseInt(percentageDTO[i].fromAmount) < parseInt(percentageDTO[i].toAmount)) && (toAmtError[i].includes('"From Amount" value should be less than "To Amount"'))) {
          toAmtError[i] = 'Nil';
        }

        try {
          //      let fromAmtError = [...this.state.fromAmtError];
          if (fromAmtError[i].includes('Please Enter "From Amount"')) {
            fromAmtError[i] = 'Nil';
            //       this.setState((state) => ({fromAmtError}));
            //     let toAmtError = [...this.state.toAmtError];
            //this.setState((state) => ({toAmtError}));

          }
        }
        catch (err) {
        }
        try {
          if (toAmtError[i].includes('Please Enter "To Amount"')) {
            toAmtError[i] = 'Nil';
          }
        }
        catch (err) { }
        if (parseInt(value) == parseInt(percentageDTO[i].fromAmount)) {
          for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
            if (j != i) {
              if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                  //       let fromAmtError = [...this.state.fromAmtError];
                  fromAmtError[i] = 'Invalid "From Amount"';
                  //           this.setState((state) => ({fromAmtError}));
                  break;
                }
                else if (fromAmtError[i].includes('Invalid "From Amount"')) {
                  fromAmtError[i] = 'Nil';
                }
              }
            }
          }
        }
        else if (parseInt(value) == parseInt(percentageDTO[i].toAmount)) {
          for (let j = 0; j <= this.state.percentageDTO.length - 1; j++) {
            if (j != i) {
              if (percentageDTO[j].fromAmount != '' && percentageDTO[j].toAmount != '') {
                if (parseInt(value) >= parseInt(percentageDTO[j].fromAmount) && parseInt(value) <= parseInt(percentageDTO[j].toAmount)) {
                  //         let toAmtError = [...this.state.toAmtError];
                  toAmtError[i] = 'Invalid "To Amount"';
                  //              this.setState((state) => ({toAmtError}));
                  break;
                }
                else if (toAmtError[i].includes('Invalid "To Amount"')) {
                  toAmtError[i] = 'Nil';
                }
              }
            }
          }
        }
      }
      console.log("FROM AMOUNT : ", fromAmtError);
      console.log("TO AMOUNT : ", toAmtError);
      if (fromAmtError[i] == '') {
        fromAmtError[i] = 'Nil';
      }
      if (toAmtError[i] == '') {
        toAmtError[i] = 'Nil';
      }
    }
    this.setState({ fromAmtError, toAmtError });
  }
  commissionSelect = (e) => {
    console.log('commi select', e.target.value)
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value,
      remitCommission: _filter(this.state.remitCompList, { companyName: value })[0]
    }, () => { this.setCommissionDetails() });
    // this.setCommissionDetails();
  }
  setCommissionDetails = () => {
    console.log('setcom fun', this.state.remitCommission)
    if (this.state.remitCommission) {
      this.setState({
        firstName: this.state.remitCommission.firstName,
        emailId: this.state.remitCommission.emailId,
        phone: this.state.remitCommission.phone,
        city: this.state.remitCommission.city,
        address: this.state.remitCommission.address,
        accessToken: this.state.remitCommission.accessToken,
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
      'accessTokens': this.state.accessToken,
      'accessKey': this.state.accessKey,
      'ipAddress': this.state.ipAddressList,
      'percentageDTO': this.state.percentageDTO,
      'vTNCommissionDTO': this.state.vTNCommissionDTO
    }
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    axios.post(investorUrl, payLoad, {
      'headers': {
        'authToken': sessionInfo.loginInfo.token,
        'ownerType': sessionInfo.loginInfo.role
      }
    }).then(response => {
      console.log('payload', payLoad)
      this.setState({ isLoading: false });
      if (response.status === 200) {
        notify.show(response.data.message, 'success');
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

  render() {
    const { isLoading, role, isChecked, remitCompList, companyName, errors, firstName, address, formValid,
      remitCommission, perOfInvestorError, emailId, provider, phone, city, accessKey, accessToken, ipAddressList,
      transLimit, investorsList, commissionEmailIdError, fixAmtError, perOfCommissionError, toAmtError, fromAmtError } = this.state;
    console.log('commission state', this.state)
    console.log('commission props', this.props.location.state)
    return (
      <Fragment>
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
        <SideMenu propsRole={role} />
        <div className="cbp-spmenu-push">
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="dashboard-title">
                <h1>Commission</h1>
              </div>
              {/* TODO : Discuss this button need */}
              {/* <button type="button" className="createnew-admin lightblue">
                            Add / Update Funds
              </button> */}
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
                                <input type="text" placeholder="Company Name" list="remitlist" name='companyName' value={companyName} onChange={this.commissionSelect} />
                                <datalist id="remitlist">
                                  {_map(remitCompList,
                                    (items, i) => (
                                      <option key={i} value={items.companyName} />
                                    ))}
                                </datalist>
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Representative Name
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Representative Name" value={firstName || ''} name='firstName' readOnly />
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Remittance Provider Email Address
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Email Address" value={emailId || ''} readOnly />
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Remittance Provider
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Remittance Provider" name='provider' value={provider} onChange={this.handleChange} />
                                <span className="error">{errors.provider}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Phone Number
                                  <sup>*</sup>
                                </label>
                                <input type="number" placeholder="Phone Number" value={phone || ''} readOnly />
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>City
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="City" value={city || ''} readOnly />
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Remittance Provider Address
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Remittance Provider Address" value={address || ''} readOnly />
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Access Token
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Access Token" value={accessToken || ''} readOnly />
                                {/* <span className="error">This value is required</span> */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Access Key
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Access Token" value={accessKey || ''} readOnly />
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
                                <input type="text" placeholder="Company Name" name='ipAddressList' value={ipAddressList} onChange={this.handleChange} />
                                <span className="error">{errors.ipAddressList}</span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-6 col-xs-12 mobilepadd">
                              <div className="form-group">
                                <label>Daily Transaction Limit
                                  <sup>*</sup>
                                </label>
                                <input type="text" placeholder="Daily Transaction Limit" name='transLimit' value={transLimit} onChange={this.handleChange} />
                                <span className="error">{errors.transLimit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h1 className="feeicon">Fee Details</h1>
                        <div className="persional-info-form">
                          <div className="fee-checkbox">
                            <div className="inputGroup">
                              <input id="option1" name="option1" type="checkbox" onChange={() => this.setState({ isChecked: !this.state.isChecked })} />
                              <label htmlFor="option1">Is Fee Allowed</label>
                            </div>
                          </div>
                          {isChecked && <FeeDeatilsTable onProductTableUpdate={this.handleProductTable.bind(this)}
                            onRowAdd={this.handleAddEvent.bind(this)} perOfCommissionError={perOfCommissionError} fixAmtError={fixAmtError}
                            onRowDel={this.handleRowDel.bind(this)} percentageDTO={this.state.percentageDTO}
                            toAmtError={toAmtError} fromAmtError={fromAmtError} />}
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
                          <CommissionTableHead perOfInvestorError={perOfInvestorError} commissionEmailIdError={commissionEmailIdError}
                            onProductTableUpdate={this.clickCommiSplitValuesChange.bind(this)} onRowAdd={this.clickCommiSplitAddRow.bind(this)}
                            onRowDel={this.clickCommiSplitRowDel.bind(this)} vTNCommissionDTO={this.state.vTNCommissionDTO} />
                          <div className="clearfix"></div>
                        </div>
                        <div className="commissionbtn">
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
      </Fragment>
    )
  }
}