import React, { Fragment } from 'react';

export default class FeeDeatilsTableCell extends React.Component {
  render() {
    return (
      <td>
        <input type={this.props.cellData.type} name={this.props.cellData.name}
          value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} id={this.props.id} />
        {!this.props.isEdit && <Fragment>{this.props.fixAmtError && <span className="error erropos"> {this.props.fixAmtError[this.props.index] || ''}</span>}
          {this.props.perOfCommissionError && <span className="error erropos"> {this.props.perOfCommissionError[this.props.index] || ''}</span>}
          {this.props.toAmtError && <span className="error erropos"> {this.props.toAmtError[this.props.index] || ''}</span>}
          {this.props.fromAmtError && <span className="error erropos"> {this.props.fromAmtError[this.props.index] || ''}</span>}</Fragment>}
        {this.props.isEdit && <Fragment>{this.props.fixAmtError && <span className="error erropos"> {this.props.fixAmtError[this.props.index] || ''}</span>}
          {this.props.perOfCommissionError && <span className="error erropos"> {this.props.perOfCommissionError[this.props.index] || ''}</span>}
          {this.props.toAmtError && <span className="error erropos"> {this.props.toAmtError[this.props.index] || ''}</span>}
          {this.props.fromAmtError && <span className="error erropos"> {this.props.fromAmtError[this.props.index] || ''}</span>}
        </Fragment>}
      </td>
    );
  }
}
