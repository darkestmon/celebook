import React, { useState } from 'react';
import { Button, Modal, List, Input, DatePicker  } from 'antd';
import 'antd/dist/antd.css';

const { TextArea } = Input;
import moment from 'moment';

export const CelebrityList = () => {
  const [state, setState] = React.useState({
    addPanelVisible: false
  })
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


  onAddCelebrity = (event) => {
    console.log("adding");
    setState({...state, addPanelVisible: true});
  };


  handleAddOk = e => {
    console.log(e);
    setState({...state, addPanelVisible: false});
  };

  handleAddCancel = e => {
    console.log(e);
    setState({...state, addPanelVisible: false});
  };

  return (
    <div>
      <List
        size="small"
        bordered
        dataSource={data}
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
        visible={state.addPanelVisible}
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
};
