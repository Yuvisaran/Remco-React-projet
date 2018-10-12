import React, { Fragment } from 'react';
import FeeDeatilsTableCell from './tableColumn';

export default class FeeDeatilsTableRow extends React.Component {
  render() {
    return (
      <Fragment>
        <tr>
          <FeeDeatilsTableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'checkbox',
            name: 'checkValue',
            value: this.props.feeDetail.checkValue,
            id: this.props.feeDetail.id
          }}/>
          <FeeDeatilsTableCell fromAmtError={this.props.fromAmtError} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'text',
            name: 'fromAmount',
            value: this.props.feeDetail.fromAmount,
            id: this.props.feeDetail.id
          }}/>
          <FeeDeatilsTableCell toAmtError={this.props.toAmtError} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'text',
            name: 'toAmount',
            value: this.props.feeDetail.toAmount,
            id: this.props.feeDetail.id
          }}/>
          <FeeDeatilsTableCell fixAmtError={this.props.fixAmtError} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'text',
            name: 'fixedAmountOfCommission',
            value: this.props.feeDetail.fixedAmountOfCommission,
            id: this.props.feeDetail.id
          }}/>
          <FeeDeatilsTableCell perOfCommissionError={this.props.perOfCommissionError} onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: 'text',
            name: 'percentageOfCommission',
            value: this.props.feeDetail.percentageOfCommission,
            id: this.props.feeDetail.id
          }}/>
        </tr>
      </Fragment>
    );
  }
}
