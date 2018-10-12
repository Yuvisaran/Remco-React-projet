
import React from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import { base_url } from '../common/apiUrl';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import CustSearch from '../common/custSearch';
import validateip from 'validate-ip';

class ManageAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      token: '',
      adminName: '',
      emailId: '',
      mobileNo: '',
      password: '',
      confirmPassword: '',
      ipAddress: '',
      status: '',
      id: '',
      errors: {
        adminName: '',
        emailId: '',
        mobileNo: '',
        password: '',
        confirmPassword: '',
        ipAddress: '',
        editAdminName: '',
        editMobileNo: '',
        editIpAddress: '',
        editStatus: '',
        status: ''
      },
      adminNamevalid: false,
      emailIdvalid: false,
      mobileNovalid: false,
      passwordvalid: false,
      confirmPasswordvalid: false,
      ipAddressvalid: false,
      statusvalid: false,
      formValid: false,
      iscreateadminForm: false,
      loading: false,
      listArray: [],
      editAdminName: '',
      editEmailId: '',
      editMobileNo: '',
      editPassword: '',
      editIpAddress: '',
      editStatus: '',
      editadminNamevalid: true,
      editmobileNovalid: true,
      editipAddressvalid: true,
      editstatusvalid: true,
      editformValid: true,
      isEditadminform: false,
      page: 1,
      errIpAddress: '',
      errEditIpAddress: '',
      delId: '',
      isDel: false

    }
    // Check authorized or not
    if (sessionStorage.getItem('loginInfo') == null) {
      props.history.push('/login');
    }

    this.handleChange = this.handleChange.bind(this);
    this.createAdmin = this.createAdmin.bind(this);
    this.listAdmin = this.listAdmin.bind(this);
    this.updateAdmin = this.updateAdmin.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateFormEdit = this.validateFormEdit.bind(this);
    this.handleChangeEdit = this.handleChangeEdit.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
    }
  }

  componentDidMount() {
    this.listAdmin();
  }

  listAdmin() {
    // API request for admin list
    const api_url = base_url + 'admin/list/admin';
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      if (response.status === 200) {
        this.setState({ listArray: response.data.userList })
      } else if (response.data.message === 'Page Session has expired. Please login again!') {
        this.props.history.push('/login');
        notify.show(response.data.message, 'error');
      } else {
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

  handleChangeEdit(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value }, () => { this.validateFieldEdit(name, value) });
  }

  validateFieldEdit(fieldName, value) {
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
      case 'editAdminName':
        this.state.editadminNamevalid = !validator.isEmpty(value);
        fieldValidationErrors.editAdminName = this.state.editadminNamevalid ? '' : 'Please enter admin name.';
        break;
      case 'editMobileNo':
        this.state.editmobileNovalid = validator.isNumeric(value) && validator.isLength(value, 5, 20);
        fieldValidationErrors.editMobileNo = this.state.editmobileNovalid ? '' : 'Valid international mobile number length is 5 to 20.';
        break;
      case 'editStatus':
        this.state.editstatusvalid = !validator.isEmpty(value);
        fieldValidationErrors.editStatus = this.state.editstatusvalid ? '' : 'Please select status.';
        break;
      default:
        break;
    }
    this.setState({ errors: fieldValidationErrors }, this.validateFormEdit)
  }

  validateFormEdit() {
    this.setState({
      editformValid: this.state.editadminNamevalid &&
        this.state.editmobileNovalid &&
        this.state.editstatusvalid
    })
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }

  handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.errors;
    switch (fieldName) {
      case 'adminName':
        this.state.adminNamevalid = !validator.isEmpty(value);
        fieldValidationErrors.adminName = this.state.adminNamevalid ? '' : 'Please enter admin name.';
        break;
      case 'mobileNo':
        this.state.mobileNovalid = validator.isNumeric(value) && validator.isLength(value, 5, 20);
        fieldValidationErrors.mobileNo = this.state.mobileNovalid ? '' : 'Valid international mobile number length is 5 to 20.';
        break;
      case 'emailId':
        this.state.emailIdvalid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.emailId = this.state.emailIdvalid ? '' : 'Please enter valid email.';
        break;
      case 'password':
        this.state.passwordvalid = value.length >= 8 && value.match(/(?=.*[_!@#$%^&*-])(?=.*\d)(?!.*[.\n])(?=.*[a-z])(?=.*[A-Z])^.{8,}$/);
        fieldValidationErrors.password = this.state.passwordvalid ? '' : 'Password must contain atleast one uppercase, one lowercase, one number, one special character and must contain minimum 8 character.';
        break;
      case 'confirmPassword':
        this.state.confirmPasswordvalid = validator.equals(value, this.state.password);
        fieldValidationErrors.confirmPassword = this.state.confirmPasswordvalid ? '' : 'Password does not match.';
        break;
      case 'status':
        this.state.statusvalid = !validator.isEmpty(value);
        fieldValidationErrors.status = this.state.statusvalid ? '' : 'Please select status.';
        break;
      default:
        break;
    }

    if (fieldName === 'password') {
      if (this.state.confirmPassword !== '') {
        if (value !== this.state.confirmPassword) {
          fieldValidationErrors.confirmPassword = 'Password does not match.';
        } else {
          fieldValidationErrors.confirmPassword = '';
        }
      }
    } else if (fieldName === 'confirmPassword') {
      if (value !== this.state.password) {
        fieldValidationErrors.confirmPassword = 'Password does not match.';
      } else {
        fieldValidationErrors.confirmPassword = '';
      }
    }
    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }

  validateForm() {
    this.setState({
      formValid: this.state.adminNamevalid &&
        this.state.mobileNovalid &&
        this.state.emailIdvalid &&
        this.state.passwordvalid &&
        this.state.confirmPasswordvalid &&
        this.state.statusvalid
    })
  }

  // Function for multiple ip seperated by comma validation
  toggleIpValidate = () => {
    const commaLen = (this.state.ipAddress.match(/,/g) || []).length;
    for (let i = 0; i <= commaLen; i++) {
      var res = this.state.ipAddress.split(',')[i];
      this.state.ipAddressvalid = validateip(res);
      let errIpAddress = this.state.ipAddressvalid ? '' : 'Please enter valid IP address.';
      this.setState(prevState => (prevState.errIpAddress !== errIpAddress ? { errIpAddress } : null));
      if (this.state.ipAddressvalid == false) { break; }
    }
    if (this.state.ipAddressvalid) {
      this.createAdmin();
    }
  }

  // Function for multiple ip seperated by comma validation
  toggleEditAdminIpValidate = () => {
    const commaLen = (this.state.editIpAddress.match(/,/g) || []).length;
    for (let i = 0; i <= commaLen; i++) {
      var res = this.state.editIpAddress.split(',')[i];
      this.state.editipAddressvalid = validateip(res);
      let errEditIpAddress = this.state.editipAddressvalid ? '' : 'Please enter valid IP address.';
      this.setState(prevState => (prevState.errEditIpAddress !== errEditIpAddress ? { errEditIpAddress } : null));
      if (this.state.editipAddressvalid == false) { break; }
    }
    if (this.state.editipAddressvalid) {
      this.updateAdmin();
    }
  }

  createAdmin() {
    // API request for create admin
    this.setState({ loading: true })
    const payLoad = {
      'adminName': this.state.adminName,
      'emailId': this.state.emailId,
      'mobileNo': this.state.mobileNo,
      'password': this.state.password,
      'confirmPassword': this.state.confirmPassword,
      'ipAddress': this.state.ipAddress,
      'status': this.state.status
    }
    const api_url = base_url + 'admin/create';
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ loading: false })
      if (response.status === 200) {
        this.setState({ iscreateadminForm: false })
        this.listAdmin();
        this.setState({
          adminName: '',
          emailId: '',
          mobileNo: '',
          password: '',
          confirmPassword: '',
          ipAddress: '',
          status: ''
        })
        notify.show(response.data.message, 'success');
      } else if (response.data.message === 'Page Session has expired. Please login again!') {
        this.setState({ iscreateadminForm: false })

        this.props.history.push('/login');
        notify.show(response.data.message, 'error');
      } else {
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

  viewAdmin = (each) => {
    // API request for view admin
    this.setState({ isEditadminform: true })
    let payLoad = {
      'id': each.id
    }
    const api_url = base_url + 'admin/view/admin';
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ loading: false })
      if (response.status === 200) {
        this.setState({
          editAdminName: response.data.registerInfo.adminName,
          editEmailId: response.data.registerInfo.emailId,
          editMobileNo: response.data.registerInfo.mobileNo,
          editPassword: response.data.registerInfo.password,
          editIpAddress: response.data.registerInfo.ipAddress,
          editStatus: response.data.registerInfo.status,
          id: response.data.registerInfo.id
        })
      } else if (response.data.message === 'Page Session has expired. Please login again!') {
        this.props.history.push('/login');
        notify.show(response.data.message, 'error');
      } else {
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

  updateAdmin() {
    // API request for update admin
    this.setState({ loading: true })
    let payLoad = {
      'mobileNo': this.state.editMobileNo,
      'emailId': this.state.editEmailId,
      'adminName': this.state.editAdminName,
      'ipAddress': this.state.editIpAddress,
      'status': this.state.editStatus
    }
    const api_url = base_url + 'admin/update';
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ loading: false })
      if (response.status === 200) {
        this.setState({ isEditadminform: false })
        notify.show(response.data.message, 'success');
        this.listAdmin();
      } else if (response.data.message === 'Page Session has expired. Please login again!') {
        this.setState({ isEditadminform: false })

        this.props.history.push('/login');
        notify.show(response.data.message, 'error');
      } else {
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

  toggleDeleteAdmin = (each) => {
    this.setState({ delId: each.id, isDel: true });
  }

  toggleDeleteAdminCancel = () => {
    this.setState({ delId: '', isDel: false });
  }

  deleteAdmin = () => {
    // API request for delete admin
    this.setState({ loading: true })
    let payLoad = {
      'id': this.state.delId
    }
    const api_url = base_url + 'admin/delete';
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ loading: false })
      if (response.status === 200) {
        notify.show(response.data.message, 'success');
        this.listAdmin();
      } else if (response.data.message === 'Page Session has expired. Please login again!') {
        this.props.history.push('/login');
        notify.show(response.data.message, 'error');
      } else {
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

  tableHead = ['Admin Name', 'Phone', 'Email', 'IP Address', 'Status', 'Action'];

  render() {
    const { listArray, page, role, loading, isDel } = this.state;
    return (
      <div>
        <Notifications />
        <div className="cbp-spmenu-push">
          <SideMenu propsRole={role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            {
              loading && <div className="loaderBg">
                <div className="loaderimg">
                  <SyncLoader
                    color={'#0f99dd'}
                    loading={loading}
                  /></div>
              </div>
            }
            <div className="main-page">
              <div className="dashboard-title">
                <h1>Manage Admins</h1>
              </div>
              <button type="button" className="createnew-admin lightblue" onClick={() => {
                this.setState({
                  iscreateadminForm: true,
                  errors: {
                    adminName: '',
                    emailId: '',
                    mobileNo: '',
                    password: '',
                    confirmPassword: '',
                    ipAddress: '',
                    status: ''
                  },
                  formValid: false
                })
              }} data-toggle="modal" data-target="#createnewadmin" data-backdrop="static">
                <img src="src/public/image/adduser.png" alt="userImage" /> Create New Admin
              </button>
              <CustSearch tokenList={listArray} tableHead={this.tableHead} deleteAdmin={this.toggleDeleteAdmin}
                page={page} perPage={10} isMangeAdmin handlePageChange={this.handlePageChange} viewAdmin={this.viewAdmin} />
            </div>
          </div>
        </div>

        {/* <!-- Create New Admin Popup --> */}
        {this.state.iscreateadminForm &&
          <div className="createnew-admin">
            <div className="modal fade in" id="createnewadmin" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" onClick={() => this.setState({
                      iscreateadminForm: false,
                      adminName: '',
                      mobileNo: '',
                      emailId: '',
                      password: '',
                      confirmPassword: '',
                      ipAddress: '',
                      status: '',
                      errors: ''
                    })}>&times;</button>
                    <h4 className="modal-title">Create New Admin</h4>
                  </div>
                  <div className="modal-body">
                    <div className="createnew-form">
                      <form>
                        <div className="form-group">
                          <label>Admin Name</label>
                          <input type="text" name='adminName' value={this.state.adminName} onChange={this.handleChange} placeholder="Admin Name" />
                          <span className="error">{this.state.errors.adminName}</span>
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input type="number" name='mobileNo' value={this.state.mobileNo} onChange={this.handleChange} placeholder="Phone Number" />
                          <span className="error">{this.state.errors.mobileNo}</span>
                        </div>
                        <div className="form-group">
                          <label>Email Id</label>
                          <input type="text" name='emailId' value={this.state.emailId} onChange={this.handleChange} placeholder="Email Address" />
                          <span className="error">{this.state.errors.emailId} </span>
                        </div>
                        <div className="form-group">
                          <label>Password</label>
                          <input type="password" name='password' value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                          <span className="error">{this.state.errors.password}</span>
                        </div>
                        <div className="form-group">
                          <label>Confirm Password</label>
                          <input type="password" name='confirmPassword' value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm Password" />
                          <span className="error">{this.state.errors.confirmPassword}</span>
                        </div>
                        <div className="form-group">
                          <label>IP Address</label>
                          <input type="text" name='ipAddress' value={this.state.ipAddress} onChange={this.handleChange} placeholder="IP Address" />
                          <span className="error">{this.state.errIpAddress}</span>
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <div className="ipaddr-select pos-relative">
                            <select className="act-inact-select" name='status' value={this.state.status} onChange={this.handleChange}>
                              <option className="green-text" value="">Select Status</option>
                              <option className="green-text" value="1">Active</option>
                              <option className="red-text" value="0">Inactive</option>
                            </select>
                            <span className="error">{this.state.errors.status}</span>
                          </div>
                        </div>
                        <div className="form-group btngrouptop">
                          <button type="button" onClick={() => this.setState({
                            iscreateadminForm: false,
                            adminName: '',
                            mobileNo: '',
                            emailId: '',
                            password: '',
                            confirmPassword: '',
                            ipAddress: '',
                            status: '',
                            errors: ''
                          })} className="cancelbtn">Cancel</button>
                          <button type="button" onClick={this.toggleIpValidate} disabled={!this.state.formValid} className="submitbtn">Submit</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {this.state.isEditadminform &&
          <div className="createnew-admin">
            <div className="modal fade in" id="createnewadmin" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" onClick={() => {
                      this.setState({ isEditadminform: false });
                      this.setState({
                        editAdminName: '',
                        editEmailId: '',
                        editMobileNo: '',
                        editPassword: '',
                        editIpAddress: '',
                        editStatus: '',
                        errors: {
                          editAdminName: '',
                          editMobileNo: '',
                          editIpAddress: '',
                          editStatus: ''
                        },
                        editformValid: true
                      })
                    }}>&times;</button>
                    <h4 className="modal-title">Edit Admin</h4>
                  </div>
                  <div className="modal-body">
                    <div className="createnew-form">
                      <form>
                        <div className="form-group">
                          <label>Admin Name</label>
                          <input type="text" name='editAdminName' value={this.state.editAdminName} onChange={this.handleChangeEdit} placeholder="Admin Name" />
                          <span className="error">{this.state.errors.editAdminName}</span>
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input type="number" name='editMobileNo' value={this.state.editMobileNo} onChange={this.handleChangeEdit} placeholder="Phone Number" />
                          <span className="error">{this.state.errors.editMobileNo}</span>
                        </div>
                        <div className="form-group">
                          <label>Email Id</label>
                          <input type="text" name='editEmailId' value={this.state.editEmailId} readOnly onChange={this.handleChangeEdit} placeholder="Email Address" />
                          <span className="error">{this.state.errors.editEmailId}</span>
                        </div>
                        <div className="form-group">
                          <label>Password</label>
                          <input type="password" name='editPassword' value={this.state.editPassword} readOnly onChange={this.handleChangeEdit} placeholder="Password" />
                          <span className="error">{this.state.errors.editPassword}</span>
                        </div>

                        <div className="form-group">
                          <label>IP Address</label>
                          <input type="text" name='editIpAddress' value={this.state.editIpAddress} onChange={this.handleChangeEdit} placeholder="IP Address" />

                          <span className="error">{this.state.errEditIpAddress}</span>
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <div className="ipaddr-select pos-relative">
                            <select className="act-inact-select" name='editStatus' value={this.state.editStatus} onChange={this.handleChangeEdit}>
                              <option className="green-text" value=''>Select Status</option>
                              <option className="green-text" value="1">Active</option>
                              <option className="red-text" value="0">Inactive</option>
                            </select>
                            <span className="error">{this.state.errors.editStatus}</span>
                          </div>
                        </div>
                        <div className="form-group btngrouptop">
                          <button type="button" onClick={() => {
                            this.setState({ isEditadminform: false });
                            this.setState({
                              editAdminName: '',
                              editEmailId: '',
                              editMobileNo: '',
                              editPassword: '',
                              confirmPassword: '',
                              editIpAddress: '',
                              editStatus: ''

                            })
                          }} className="cancelbtn">Cancel</button>
                          <button type="button" onClick={this.toggleEditAdminIpValidate} disabled={!this.state.editformValid} className="submitbtn">Submit</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {isDel && <div className="fa-code-section deleteMessage approvpopup">
          <div className="fa-code-div">
            <div className="remittance-title modal-header"><h1>Delete This Administrator</h1><button type="button" className="clsebtn close" onClick={() => {
              this.setState({ isDel: false, delId: '', delMsg: '' });
            }
            }>×</button></div>
            <div className="fa-code-content">
              <form>
                <div className="delete-group-body"><p>Are you sure you would like to delete Administrator</p>
                  <p> This will destroy account and cannot be undone!</p>
                </div>
                <input className="hightwidth" name="delMsg" value={this.state.delMsg} onChange={this.handleChange} placeholder="type DELETE here and click Delete button" />
                <div className="commissionbtn">
                  <button type="button" onClick={() => {
                    this.setState({ isDel: false, delId: '', delMsg: '' });
                  }} className="cancelbtn buttn-no">Back</button>
                  <button type="button" disabled={this.state.delMsg != 'DELETE'} onClick={() => {
                    this.deleteAdmin();
                    this.setState({ isDel: false, delId: '' });
                  }} className="commission-submit buttn-delete">Delete</button>
                </div>
              </form>
            </div>
          </div>
        </div>}
      </div>
    )
  }
}
export default ManageAdmin;
