import React, { Component, Fragment } from 'react';
import _map from 'lodash/map';

export default class Filter extends Component {
  componentDidMount() {
    var start = new Date().getFullYear();
    var end = 2018;
    var options = '<option value="">' + '--Select Year--' + '</option>';
    for (var year = start; year >= end; year--) {
      options += '<option>' + year + '</option>';
    }
    document.getElementById('year').innerHTML = options;
  }
  render() {
    const { month, year, selectedYear, toggleTokenList, isAdmin, isAdminDas, comName, comList } = this.props;
    return (
      <Fragment>
        {(isAdmin || isAdminDas) && <div className="selecbox-due">
          <div className="slctbox">
            <select value={comName} name='comName' onChange={(e) => selectedYear(e)}>
              <option value="">--Select Company--</option>
              {_map(comList,
                (items, i) => (
                  <Fragment key={i}>
                    <option value={items.companyName}>{items.companyName} </option>
                  </Fragment>
                ))}
            </select>
          </div>
        </div>}
        <div className="selectmonth">
          {!isAdminDas && <select name='month' value={month} onChange={(e) => selectedYear(e)}>
            <option value=''>--Select Month--</option>
            <option value='1'>January</option>
            <option value='2'>Febraury</option>
            <option value='3'>March</option>
            <option value='4'>April</option>
            <option value='5'>May</option>
            <option value='6'>June</option>
            <option value='7'>July</option>
            <option value='8'>August</option>
            <option value='9'>September</option>
            <option value='10'>October</option>
            <option value='11'>November</option>
            <option value='12'>December</option>
          </select>}
          {!isAdminDas && <select name='year' id='year' value={year} onChange={(e) => selectedYear(e)}>
          </select>}
          {(!isAdmin && !isAdminDas) && <button type='button' className='creattoken' onClick={toggleTokenList} disabled={!month || !year} >Get List </button>}
          {isAdmin && <button type='button' className='creattoken' onClick={toggleTokenList} disabled={!month || !year || !comName} >Get List </button>}
          {isAdminDas && <button type='button' className='creattoken' onClick={toggleTokenList} disabled={!comName} >Get List </button>}
        </div>
        <span id='year' style={{ display: 'none' }} />
      </Fragment>
    )
  }
}
