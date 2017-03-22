import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    console.log('req: ' + JSON.stringify(req.headers));
    debugger;
    var headers = {
      userAgent: req.headers['user-agent'],
      remoteAddr: req.connection.remoteAddress,
      forwardedFor: req.headers['x-forwarded-for'],
      realIP: req.headers['x-real-ip'],
    };
    return headers;
    /*
     return req
     ? { userAgent: req.headers['user-agent'] }
     : { userAgent: navigator.userAgent }
     */
  };

  render () {
    return <div>
      <MuiThemeProvider>
        <p>this.props.userAgent: {this.props.userAgent}</p>
        <p>this.props.remoteAddr: {this.props.remoteAddr.replace(/^.*:/, '')}</p>
        <p>this.props.forwardedFor: {this.props.forwardedFor}</p>
        <p>this.props.realIP: {this.props.realIP}</p>
      </MuiThemeProvider>
    </div>
  }
}

