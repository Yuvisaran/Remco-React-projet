import React, { Fragment } from 'react';
import CommissionTableCell from './commissionTableColumn';

export default class CommissionTableRow extends React.Component {
  render() {
    return (
      <Fragment>
        <tr>
          <CommissionTableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'checkbox',
            name: 'checkValue',
            value: this.props.commissionDetail.checkValue,
            id: this.props.commissionDetail.id,
          }} />
          <td>Investor </td>
          <CommissionTableCell perOfInvestorError={this.props.perOfInvestorError} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'text',
            name: 'percentageOfInvestor',
            value: this.props.commissionDetail.percentageOfInvestor,
            id: this.props.commissionDetail.id,
            max: 100
          }} />
          <CommissionTableCell commissionEmailIdError={this.props.commissionEmailIdError} onProductTableUpdate={this.props.onProductTableUpdate}
            cellData={{
              type: 'email',
              name: 'emailId',
              value: this.props.commissionDetail.emailId,
              id: this.props.commissionDetail.id,
              list: 'investors'
            }} />
        </tr>
      </Fragment>
    );
  }
}
