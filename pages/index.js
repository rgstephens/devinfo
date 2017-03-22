import React from 'react'
import Head from 'next/head'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Hostinfo from '../components/hostInfo'
import axios from 'axios'
import * as https from 'https'

const muiTheme = getMuiTheme({ userAgent: false });

let serviceTicket = '';

const style = {
  marginLeft: 20,
};

function censor(key, value) {
  console.log('value: ' + value);
  if (typeof(value) == "string") {
    return undefined;
  }
  return value;
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    console.log('getInitialProps, req: ' + JSON.stringify(req.url) + ', serviceTicket: ' + serviceTicket);
    console.log('ip: ' + getAllUrlParams(req.url).hostIp);
    console.log('mac: ' + getAllUrlParams(req.url).hostMac);

    var headers = {
      userAgent: req.headers['user-agent'],
      remoteAddr: req.connection.remoteAddress,
      forwardedFor: req.headers['x-forwarded-for'],
      realIP: req.headers['x-real-ip'],
    };

    let host = {
      hostIp: getAllUrlParams(req.url).ip ? getAllUrlParams(req.url).ip : headers.remoteAddr,
      hostMac: getAllUrlParams(req.url).mac
    };
    const controller = {
      hostname: 'https://192.168.193.51',
      port: '443',
      apivers: 'v1',
      user: 'api',
      password: 'C1sc0123'
    };

    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    if (!serviceTicket) {
      const buildURL = controller.hostname + '/api/' + controller.apivers + '/ticket';
      var currentTime = new Date();
      console.log('Login URL: ' + buildURL);
      const response = await axiosInstance.post(buildURL, {
        username: controller.user,
        password: controller.password
      });
      console.log('back from await ' + JSON.stringify(response.data.response));
      serviceTicket = response.data.response.serviceTicket;
    } else {
      console.log('We already have a ticket: ' + serviceTicket);
    }

    // Get host info
    console.log('host info for: ' + host.hostIp);
    const buildURL = controller.hostname + '/api/' + controller.apivers + '/host/?hostIp=' + host.hostIp;
    const r = await axiosInstance.get(buildURL, { headers: {'x-auth-token': serviceTicket} });
    console.log('status: ' + JSON.stringify(r.status) + ', num hosts: ' + r.data.response.length + ', data: ' + JSON.stringify(r.data));

    return { serviceTicket: serviceTicket, headers: headers, host: host, hostInfo: r.data.response[0] };
  };

  constructor(props) {
    super(props);
    this.state = {
      controller: {
        hostname: 'https://192.168.193.51',
        port: '443',
        apivers: 'v1',
        user: 'api',
        password: 'C1sc0123'
      }
    };
  }

  componentDidMount() {
    injectTapEventPlugin();
    console.log('componentDidMount, props: ' + JSON.stringify(this.props) + ', session(dev): ' + sessionStorage.getItem('dev'));
    if (!sessionStorage.getItem('dev')) sessionStorage.setItem('dev', JSON.stringify(this.props.data))
  }

  render() {
    console.log('render, this.props.host: ' + JSON.stringify(this.props.host));
    console.log('render, this.props.hostInfo: ' + JSON.stringify(this.props.hostInfo));
    console.log('render, this.props.response: ' + JSON.stringify(this.props.response));
    console.log('render, this.props.headers: ' + JSON.stringify(this.props.headers));
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Head>
            <title>NetDef</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
          </Head>

          <AppBar
            title="Device Info"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />

          <Card>
          <Paper zDepth={2}>
            <TextField floatingLabelText="Remote Address" disabled style={style} underlineShow={false} fullWidth={true}  value={this.props.headers.remoteAddr}/>
            <Divider />
            <TextField floatingLabelText="User Agent" disabled style={style} underlineShow={false} fullWidth={true} value={this.props.headers.userAgent}/>
            <Divider />
            <TextField floatingLabelText="APIC Controller" disabled style={style} underlineShow={false} fullWidth={true}  value={this.state.controller.hostname}/>
{/*
            <Divider />
            <TextField floatingLabelText="Forwarded For" disabled style={style} underlineShow={false} fullWidth={true}  value={this.props.headers.forwardedFor}/>
            <Divider />
            <TextField floatingLabelText="Real IP" disabled style={style} underlineShow={false} fullWidth={true}  value={this.prop.headers.realIP}/>
*/}
            <Divider />
            <TextField floatingLabelText="Ticket" disabled style={style} underlineShow={false} fullWidth={true}  value={this.props.serviceTicket}/>
{/*
            <ApicTicket />
*/}
            <Divider />
          </Paper>

            </Card>
            <p></p>
          <Hostinfo hostInfo={this.props.hostInfo}/>
        </div>
      </MuiThemeProvider>
    )
  }
}