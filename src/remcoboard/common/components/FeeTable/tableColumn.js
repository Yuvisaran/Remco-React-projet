import React from 'react';

export default class FeeDeatilsTableCell extends React.Component {
  render() {
    return (
      <td>
        <input type={this.props.cellData.type} name={this.props.cellData.name} id={this.props.cellData.id}
          value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} />
        {this.props.fixAmtError && <span className="error"> {this.props.fixAmtError[this.props.cellData.id] || ''}</span>}
        {this.props.perOfCommissionError && <span className="error"> {this.props.perOfCommissionError[this.props.cellData.id] || ''}</span>}
        {this.props.toAmtError && <span className="error"> {this.props.toAmtError[this.props.cellData.id] || ''}</span>}
        {this.props.fromAmtError && <span className="error"> {this.props.fromAmtError[this.props.cellData.id] || ''}</span>}
      </td>
    );
  }
}
