import React, { useState } from 'react';
import { Button, Modal, List } from 'antd';
import 'antd/dist/antd.css';

export const CelebrityList = () => {
  state = { addPanelVisible: false };
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
    this.setState({
      addPanelVisible: true,
    });
  };


  handleAddOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleAddCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
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
        title="Basic Modal"
        visible={this.state.addPanelVisible}
        onOk={this.handleAddOk}
        onCancel={this.handleAddCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};
