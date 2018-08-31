import React, { Fragment } from 'react';
import CommissionTableCell from './commissionTableColumn';

export default class CommissionTableRow extends React.Component {
  render() {
    console.log('table row', this.props.perOfInvestorError)
    return (
      <Fragment>
        <tr>
          <CommissionTableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'checkbox',
            name: 'checkValue',
            value: this.props.commissionDetail.checkValue,
            id: this.props.commissionDetail.id,
          }} />
          <td>Affiliate </td>
          <CommissionTableCell perOfInvestorError={this.props.perOfInvestorError} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'text',
            name: 'percentageOfInvestor',
            value: this.props.commissionDetail.percentageOfInvestor,
            id: this.props.commissionDetail.id,
            placeHolder: '100',
            max: 100
          }} />
          <CommissionTableCell commissionEmailIdError={this.props.commissionEmailIdError} onProductTableUpdate={this.props.onProductTableUpdate}
            cellData={{
              type: 'email',
              name: 'emailId',
              value: this.props.commissionDetail.emailId,
              id: this.props.commissionDetail.id,
              placeHolder: 'settlement1@vtnglobal.com',
              list: 'investors'
            }} />
        </tr>
      </Fragment>
    );
  }
}
