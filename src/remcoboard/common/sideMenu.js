import React from 'react';
import { NavLink } from 'react-router-dom';

class SideMenu extends React.Component {
  render() {
    return (
      <div>
        <div className="main-content">
          {/* admin */}
          {this.props.propsRole === 'Admin' &&
            <div className="sidebar" role="navigation">
              <div className="navbar-collapse">
                <nav className="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left" id="cbp-spmenu-s1">
                  <ul className="nav" id="side-menu">
                    <li>
                      <a href="javascript:void(0);" className="active">
                        <img src="src/public/image/dashboardIcon.png" alt="icon" />Dashboard</a>
                    </li>
                    <li>
                      <NavLink to='/remittancedetails'>
                        <img src="src/public/image/kycApprovalIcon.png" alt="icon" />Remittence Approvals</NavLink>
                    </li>
                    <li>
                      <NavLink to='/commission'>
                        <img src="src/public/image/commissionIcon.png" alt="icon" />Commission</NavLink>
                    </li>
                    <li>
                      <NavLink to='/commissionlist'>
                        <img src="src/public/image/commissionIcon.png" alt="icon" />Commission List</NavLink>
                    </li>
                    {/* <li>
                      <a href="tokenCreation.html">
                        <img src="src/public/image/tokenCreationIcon.png" alt="icon" />Token Creations</a>
                    </li> */}
                    <li>
                      <NavLink to="/managetoken" >
                        <img src="src/public/image/manageAdminIcon.png" alt="icon" />Manage Tokens</NavLink>              </li>
                    <li>
                      <NavLink to="/transaction">
                        <img src="src/public/image/transactionIcon.png" alt="icon" />Transaction</NavLink>
                    </li>
                    <li>
                      <NavLink to='/investor'>
                        <img src="src/public/image/investorDueAmountIcon.png" alt="icon" />Investor</NavLink>
                    </li>
                    <li>
                      <NavLink to='/investorslist'>
                        <img src="src/public/image/investorDueAmountIcon.png" alt="icon" />Investors List</NavLink>
                    </li>
                    {/* <li>
                      <a href="viewToken.html">
                        <img src="src/public/image/tokenCreationIcon.png" alt="icon" />View Token</a>
                    </li> */}
                    <li>
                      <NavLink to="/transfee">
                        <img src="src/public/image/transactionfeesIcon.png" alt="icon" />Transaction Fees</NavLink>
                    </li>
                    <li>
                      <NavLink to="/investorsdue">
                        <img src="src/public/image/investorDueAmountIcon.png" alt="icon" />Investor Due Amount</NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>}

          {/* superadmin */}
          {this.props.propsRole === 'Superadmin' &&

            <div className="sidebar" role="navigation">
              <div className="navbar-collapse">
                <nav className="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left" id="cbp-spmenu-s1">
                  <ul className="nav" id="side-menu">
                    <li>
                      <NavLink to='/superadmin' className="active">
                        <img src="src/public/image/dashboardIcon.png" alt="icon" />Dashboard</NavLink>
                    </li>
                    <li>
                      <NavLink to='/remittancedetails'>
                        <img src="src/public/image/kycApprovalIcon.png" alt="icon" />Remittence Approvals</NavLink>
                    </li>
                    <li>
                      <NavLink to='/commission'>
                        <img src="src/public/image/commissionIcon.png" alt="icon" />Commission</NavLink>
                    </li>
                    <li>
                      <NavLink to='/commissionlist'>
                        <img src="src/public/image/commissionIcon.png" alt="icon" />Commission List</NavLink>
                    </li>
                    {/* <li>
                      <a href="/manageadmin" >
                        <img src="src/public/image/manageAdminIcon.png" alt="icon" />Manage Admins</a>
                    </li> */}
                    <li>
                      <NavLink to="/managetoken" >
                        <img src="src/public/image/manageAdminIcon.png" alt="icon" />Manage Tokens</NavLink>
                    </li>
                    <li>
                      <NavLink to="/transaction">
                        <img src="src/public/image/transactionIcon.png" alt="icon" />Transaction</NavLink>
                    </li>
                    <li>
                      <NavLink to="/transfee">
                        <img src="src/public/image/transactionfeesIcon.png" alt="icon" />Transaction Fees</NavLink>
                    </li>
                    <li>
                      <NavLink to='/investor'>
                        <img src="src/public/image/investorDueAmountIcon.png" alt="icon" />Investor</NavLink>
                    </li>
                    <li>
                      <NavLink to='/investorslist'>
                        <img src="src/public/image/investorDueAmountIcon.png" alt="icon" />Investors List</NavLink>
                    </li>
                    <li>
                      <NavLink to="/investorsdue">
                        <img src="src/public/image/investorDueAmountIcon.png" alt="icon" />Investor Due Amount</NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>}

          {/* user */}
          {this.props.propsRole === 'User' &&

            <div className="sidebar" role="navigation">
              <div className="navbar-collapse">
                <nav className="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left" id="cbp-spmenu-s1">
                  <ul className="nav" id="side-menu">
                    <li>
                      <a href="javascript:void(0);" className="active">
                        <img src="src/public/image/dashboardIcon.png" alt="icon" />Dashboard</a>
                    </li>

                    <li>
                      <NavLink to='createtoken'>
                        <img src="src/public/image/tokenCreationIcon.png" alt="icon" />Token Creations</NavLink>
                    </li>
                    <li>
                      <NavLink to='/usertransaction'>
                        <img src="src/public/image/transactionIcon.png" alt="icon" />Transaction</NavLink>
                    </li>
                    <li>
                      <NavLink to='viewtoken'>
                        <img src="src/public/image/tokenCreationIcon.png" alt="icon" />View Token</NavLink>
                    </li>

                  </ul>
                </nav>
              </div>
            </div>}

        </div>
      </div>
    )
  }
}
export default SideMenu;
