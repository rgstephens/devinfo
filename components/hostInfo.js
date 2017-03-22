import React from 'react'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const style = {
  marginLeft: 20,
};
const alignLeft = {
  textAlign: "left",
};


export default ({hostInfo}) => (
  <Card>
    <CardHeader title="Basic Info"/>
    <Paper zDepth={2}>
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Property</TableHeaderColumn>
            <TableHeaderColumn>Value</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>hostIp</TableRowColumn>
            <TableRowColumn><strong>{hostInfo.hostIp}</strong></TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>hostMac</TableRowColumn>
            <TableRowColumn><strong>{hostInfo.hostMac}</strong></TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>hostType</TableRowColumn>
            <TableRowColumn><strong>{hostInfo.hostType}</strong></TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>connectedNetworkDeviceIpAddress</TableRowColumn>
            <TableRowColumn><strong>{hostInfo.connectedNetworkDeviceIpAddress}</strong></TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>connectedInterfaceName</TableRowColumn>
            <TableRowColumn><strong>{hostInfo.connectedInterfaceName}</strong></TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>vlanId</TableRowColumn>
            <TableRowColumn><strong>{hostInfo.vlanId}</strong></TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  </Card>
)

// {"hostIp":"172.18.16.200","hostMac":"00:50:56:90:21:ac","hostType":"wired","connectedNetworkDeviceId":"80cb1b69-798a-4099-ab2a-30ad91e1c296","connectedNetworkDeviceIpAddress":"172.18.0.246","connectedInterfaceId":"405973e8-5e43-4db7-b572-e78f4ac0a6eb","connectedInterfaceName":"GigabitEthernet1/0/26",
// "vlanId":"16","lastUpdated":"1490205098118","source":"200","subType":"UNKNOWN","id":"9c284112-c6e0-4aa2-9584-34e173d10792"}
