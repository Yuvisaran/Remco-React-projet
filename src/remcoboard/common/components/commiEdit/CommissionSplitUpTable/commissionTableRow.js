import React, { Fragment } from 'react';
import CommissionTableCell from './commissionTableColumn';

export default class CommissionTableRow extends React.Component {
  render() {
    return (
      <Fragment>
        <tr>
          <CommissionTableCell onProductTableUpdate={this.props.onProductTableUpdate} id={this.props.commissionDetail.investorPercentageId}
            cellData={{
              type: 'checkbox',
              name: 'checkValue',
              value: this.props.commissionDetail.checkValue,
              id: this.props.commissionDetail.investorPercentageId,
            }} />
          <td>Investor </td>
          <CommissionTableCell perOfInvestorError={this.props.perOfInvestorError} id={this.props.commissionDetail.investorPercentageId}
            onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
              type: 'text',
              name: 'percentageOfInvestor',
              value: this.props.commissionDetail.percentageOfInvestor,
              id: this.props.commissionDetail.investorPercentageId,
              max: 100
            }} />
          <CommissionTableCell commissionEmailIdError={this.props.commissionEmailIdError} id={this.props.commissionDetail.investorPercentageId}
            onProductTableUpdate={this.props.onProductTableUpdate}
            cellData={{
              type: 'email',
              name: 'emailId',
              value: this.props.commissionDetail.emailId,
              id: this.props.commissionDetail.investorPercentageId,
              list: 'investors'
            }} />
        </tr>
      </Fragment>
    );
  }
}
