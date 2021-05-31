import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Message, Button, Segment, Divider } from 'semantic-ui-react';
import _ from 'lodash';
import { Controlled as CodeMirror } from 'react-codemirror2';
import asyncActions from '../actions/asyncActions';
import styles from '../components/style.scss';

class AnnouncementContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcement: '<center>Signups are disabled</center>',
      response: null,
    };
  }
  componentDidMount() {
    this.getAnnouncement();
  }
  getAnnouncement() {
    const that = this;
    that.props.dispatch(asyncActions.getAnnouncement())
      .then(x => that.setState({ announcement: x && x.payload }));
  }
  publishAnnouncement() {
    const that = this;
    const data = {
      msg: that.state.announcement,
    };
    that.props.dispatch(asyncActions.publishAnnoucement(data))
      .then(x => that.setState({ response: _.get(x, 'data.message', 'NULL') }))
      .catch(error => that.setState({ response: _.get(error, 'data.message', 'Some error in publishing') }));
  }
  clearAnnoucement() {
    const that = this;
    that.props.dispatch(asyncActions.clearAnnouncement())
      .then((x) => {
        that.setState({ response: _.get(x, 'data.message', 'NULL') });
        that.getAnnouncement();
      })
      .catch(error => that.setState({ response: _.get(error, 'data.message', 'Some error in deleting') }));
  }
  render() {
    const that = this;
    const { announcement, response } = that.state;
    return (
      <div style={{ padding: '5em', marginTop: '2em' }}>
        <Form>
          <nav className="announcement">
            {/* eslint-disable react/no-danger */}
            <div className="content" dangerouslySetInnerHTML={{ __html: announcement }} />
            <Button style={{ backgroundColor: 'transparent', transform: 'translateY(-35px)' }} floated="right" icon="remove" />
          </nav>
          {response && <Message title="Response" content={response} />}
          <Form.Group>
            <Form.Field width={16}>
              <label>HTML Announcement String</label>
              <CodeMirror
                value={announcement}
                options={{
                  mode: 'xml',
                  theme: 'material',
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  that.setState({ announcement: value });
                }}
                onChange={(editor, data, value) => {
                  // that.setState({ announcement: value });
                }}
              />
            </Form.Field>
          </Form.Group>
          <Form.Button onClick={that.publishAnnouncement.bind(that)}>Publish</Form.Button>
          <Form.Button onClick={that.clearAnnoucement.bind(that)}>clear Annoucement</Form.Button>
        </Form>
      </div>
    );
  }
}
export default connect()(AnnouncementContainer);
