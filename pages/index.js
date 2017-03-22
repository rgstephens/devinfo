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
import { ApicTicket } from '../components/apic'
import axios from 'axios'
import * as https from 'https'

const muiTheme = getMuiTheme({ userAgent: false });

const style = {
  marginLeft: 20,
};

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    //console.log('req: ' + JSON.stringify(req.headers));
    console.log('getInitialProps');

    var headers = {
      userAgent: req.headers['user-agent'],
      remoteAddr: req.connection.remoteAddress,
      forwardedFor: req.headers['x-forwarded-for'],
      realIP: req.headers['x-real-ip'],
    };
    const controller = {
      hostname: 'https://192.168.193.51',
      port: '443',
      apivers: 'v1',
      user: 'api',
      password: 'C1sc0123'
    };
    var buildURL = controller.hostname + '/api/' + controller.apivers + '/ticket';
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    var currentTime = new Date();
    console.log('Login URL: ' + buildURL);
    const response = await axiosInstance.post(buildURL, {
      username: controller.user,
      password: controller.password
    });
    console.log('back from await ' + JSON.stringify(response.data.response));

    return { response: response.data.response, headers: headers }
/*
    axiosInstance.post(buildURL, {
      username: controller.user,
      password: controller.password
    })
      .then(function (response) {
        console.log('response.status: ' + response.status);
        if (response.status === 200) {
          //const content = JSON.parse(response.content);
          console.log('login status code 200, result.content: ' + JSON.stringify(response.data.response));
          return { data: response.data.response, headers: headers };
        } else {
          console.log('login non 200 status return from login: ' + JSON.stringify(response.status) + ', ' + JSON.stringify(response.data.response));
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    if(!process.browser) {
      // running on the server here
      console.log('server side');
      //var buildURL = controller.hostname + ':' + controller.port + '/api/' + controller.apivers + '/ticket';
    } else {
      // running on the client, get the cache
      console.log('client, dev: ' + sessionStorage.getItem('dev'));
      //const dev = JSON.parse(sessionStorage.getItem('dev'));
      const dev = sessionStorage.getItem('dev');
      if (dev !== 'undefined' && dev !== null) {
        console.log('have dev data already');
        const devInfo = JSON.parse(dev);
        return { dev: devInfo, headers: headers };
      } else {
        console.log('no dev data, fake data');
        return { dev: {"serviceTicket":"fake-data","idleTimeout":1,"sessionTimeout":2}, headers: headers };
      }
    }
*/

    //return headers;
  };

  componentDidMount() {
    injectTapEventPlugin();
    console.log('componentDidMount, props: ' + JSON.stringify(this.props) + ', session(dev): ' + sessionStorage.getItem('dev'));
    if (!sessionStorage.getItem('dev')) sessionStorage.setItem('dev', JSON.stringify(this.props.data))
  }

  render() {
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
            <TextField floatingLabelText="Forwarded For" disabled style={style} underlineShow={false} fullWidth={true}  value={this.props.headers.forwardedFor}/>
{/*
            <Divider />
            <TextField floatingLabelText="Real IP" disabled style={style} underlineShow={false} fullWidth={true}  value={this.prop.headers.realIP}/>
*/}
            <Divider />
            <TextField floatingLabelText="Ticket" disabled style={style} underlineShow={false} fullWidth={true}  value={this.props.response.serviceTicket}/>
{/*
            <ApicTicket />
*/}
            <Divider />
          </Paper>
            </Card>
        </div>
      </MuiThemeProvider>
    )
  }
}