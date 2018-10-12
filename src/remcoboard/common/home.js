import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Home extends React.Component {
  render() {
    return (
      <div className="remcoLandBg">
        <div className="container-fluid">
          <div className="landingLogo"><img src="../../../src/public/image/logo.png" /></div>
          <div className="landingContent">
            <h2>The World &apos;s First Powerful Distributed Token - Generating Platform for Money Transfer</h2>
            <p>The REMCO Token Generating Platform’s APIs to allow any licensed money transmitter
                  to mint programmable Tokens to move value and leverage distributed ledger advantages at
speed and scale, while also offering innovative compensation to all transaction stakeholders</p>
            <div className="landingBtnBg">
              <NavLink to='/login'> <button type="button" className="landingButton">Login </button></NavLink>
              <NavLink to='/register'> <button type="button" className="landingButton">  Register </button></NavLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
