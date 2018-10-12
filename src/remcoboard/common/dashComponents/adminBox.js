import React from 'react';

const AdminBox = ({ tokenList }) => (
  <div className="superadmin-box">
    <div className="row">
      <div className="admin-lg-3 mobilepadd0">
        <div className="box-listadmin bg2f3e9e">
          <div className="iconimg">
            <img src="src/public/image/enterprise.png" alt="icon" />
          </div>
          <h1>{tokenList.noOfCompanies}</h1>
          <p>Remittance Company</p>
        </div>
      </div>
      <div className="admin-lg-3 mobilepadd0">
        <div className="box-listadmin bgd22e2e">
          <div className="iconimg">
            <img src="src/public/image/approve-invoice.png" alt="icon" />
          </div>
          <h1>{tokenList.noOfPendingKYC}</h1>
          <p>KYC Approval Pending</p>
        </div>
      </div>
      <div className="admin-lg-3 mobilepadd0">
        <div className="box-listadmin bg00aeef">
          <div className="iconimg">
            <img src="src/public/image/investor.png" alt="icon" />
          </div>
          <h1>{tokenList.noOfInvestors}</h1>
          <p>Investors</p>
        </div>
      </div>
      <div className="admin-lg-3 mobilepadd0">
        <div className="box-listadmin bg6d6e71">
          <div className="iconimg">
            <img src="src/public/image/commission.png" alt="icon" />
          </div>
          <h1>{tokenList.commissionForMonth}</h1>
          <p>Commission
            <span>(For this Month)</span>
          </p>
        </div>
      </div>
      <div className="admin-lg-3 mobilepadd0">
        <div className="box-listadmin bgf7941e">
          <div className="iconimg">
            <img src="src/public/image/investor.png" alt="icon" />
          </div>
          <h1>{tokenList.investorDueForMonth}</h1>
          <p>Investor Due
            <span>(For this Month)</span>
          </p>
        </div>
      </div>
    </div>
  </div>
)
export default AdminBox;
