import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Modal, List, Input, DatePicker  } from 'antd';
import 'antd/dist/antd.css';
import { Celebs } from '../api/celebs.js';


const { TextArea } = Input;
import moment from 'moment';

class CelebrityList extends Component {
  state = { addPanelVisible: false };

  onAddCelebrity = (event) => {
    console.log("adding");
    Celebs.insert({"text":"pikachu"});
    this.setState({
      addPanelVisible: true,
    });
  };


  renderCelebs() {
    return Celebs.find({}).fetch().map((celeb) => (
      <div key={celeb._id}>
        {celeb.text}
      </div>
    ));
  }


  fetchCelebNames() {
    return Celebs.find({}).fetch().map((celeb) => {
      return celeb.text;
    }
    );
  }

  handleAddOk = e => {
    // console.log(e);
    this.setState({
      addPanelVisible: false,
    });
  };

  handleAddCancel = e => {
    // console.log(e);
    this.setState({
      addPanelVisible: false,
    });
  };
  render() {

    // Celebs.insert({"text":"hello"});
    // celebs=   Celebs.find({}).collection._docs._map;
    // var celebs=  Celebs.find({});
    // console.log(celebs);
    // for (var c in celebs) {
    //   // console.log("aaa");
    //     console.log(c);
    //     // console.log(celebs[c]);
    // }
    //console.log(Celebs.find());

    const data = [
      'Robert Downy, Jr.',
      'Chris Hemsworth',
      'Scarlett Johansson',
      'Mark Ruffalo',
      'Paul Rudd',
      'Brie Larson',
      'Chris Pratt',
      'Don Cheadle',
      'Gwyneth Paltrow',
      'Josh Brolin',
    ];

    return (
      <div>
      <List
      size="small"
      bordered
      dataSource={this.fetchCelebNames()}
      footer={
        <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
        >
        <Button onClick={this.onAddCelebrity}>Add a celebrity</Button>
        </div>
      }
      renderItem={item => (
        <List.Item>
        {item}
        </List.Item>
      )}
      />
      <Modal
      title="Add a celebrity"
      visible={this.state.addPanelVisible}
      onOk={this.handleAddOk}
      onCancel={this.handleAddCancel}
      footer={[
        <Button key="Cancel" onClick={this.handleCancel}>
        Return
        </Button>,
        <Button key="Save" type="primary" onClick={this.handleOk}>
        Submit
        </Button>,
      ]}
      >
      <Input addonBefore="First Name" defaultValue="" />
      <div style={{ margin: '24px 0' }} />
      <Input addonBefore="Last Name" defaultValue="" />
      <div style={{ margin: '24px 0' }} />
      <p>Date of Birth:</p>
      <DatePicker defaultValue={moment('2000/01/01')}/>
      <div style={{ margin: '24px 0' }} />
      <p>About the Celebrity:</p>
      <TextArea
      placeholder="Describe him/her..."
      autoSize={{ minRows: 2, maxRows: 10 }}
      />
      </Modal>
      </div>
    );
  }
};

export default withTracker(() => {
  return {
    celebs: Celebs.find({}).fetch(),
  };
})(CelebrityList);
