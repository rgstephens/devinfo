import React from 'react'
import TextField from 'material-ui/TextField'

const style = {
  marginLeft: 20,
};

let ticket = '';

export class ApicTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: ''
    };
  }

  componentDidMount() {
  }

  render () {
    return (
      <div>
        <TextField floatingLabelText="Ticket" style={style} underlineShow={false} fullWidth={true} value={this.props.dev}/>
      </div>
    )
  }
}
