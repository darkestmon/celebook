import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Modal, List, Input, DatePicker, Layout, Popconfirm, message  } from 'antd';
import 'antd/dist/antd.css';
import { Celebs } from '../api/celebs.js';
import {
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;
const { Search } = Input;

import moment from 'moment';

class CelebrityList extends Component {
  state = {
    infoPanelVisible: false,
    infoRemoveVisible: false,
    celebFilter: "",
    infoForm: {
      _id:"",
      firstname:"",
      lastname:"",
      dob:"",
      desc:"",
    }
  };

  fetchCelebNames() {
    var filter = this.state.celebFilter;
    if(filter) {
      return Celebs.find({
        $or:[
          {firstname : {$regex : ".*" + filter +".*", $options: "i"}},
          {lastname : {$regex : ".*" + filter +".*", $options: "i"}}
        ]}).fetch().map((celeb) => {
        return celeb;
      });
    } else {
      return Celebs.find({}).fetch().map((celeb) => {
        return celeb;
      });
    }
  }



  handleInfoOk = e => {
    if(this.state.infoForm._id) {
      Celebs.update({
        _id: this.state.infoForm._id
      },
      {
        firstname:this.state.infoForm.firstname,
        lastname:this.state.infoForm.lastname,
        dob:this.state.infoForm.dob,
        desc:this.state.infoForm.desc,
      });
    } else {
      Celebs.insert({
        firstname:this.state.infoForm.firstname,
        lastname:this.state.infoForm.lastname,
        dob:this.state.infoForm.dob,
        desc:this.state.infoForm.desc,
      });
    }
    this.setState({
      infoPanelVisible: false,
    });
  };

  handleInfoRemove = e => {
    if(this.state.infoForm._id) {
      Celebs.remove({
        _id: this.state.infoForm._id
      });
    }
    this.setState({
      infoPanelVisible: false,
    });
  };

  handleInfoCancel = e => {
    this.setState({
      infoPanelVisible: false,
    });
  };


  onAddCelebrity = (event) => {
    this.setState({
      infoPanelVisible: true,
      infoRemoveVisible: false,
      celebFilter: "",
      infoForm: {
        _id:"",
        firstname:"",
        lastname:"",
        dob:"2000-01-01",
        desc:"",
      }
    });
  };

  infoChangeHandler = (e) => {
    var infoForm = this.state.infoForm;
    if(e.target.id == "info-firstname") {
      infoForm.firstname = e.target.value;
    } else if(e.target.id == "info-lastname") {
      infoForm.lastname = e.target.value;
    } else if(e.target.id == "info-desc") {
      infoForm.desc = e.target.value;
    }
    this.setState({
      infoForm: infoForm,
    });
    // console.log(this.state.infoForm);
  }

  infoDobHandler = (date, dateString) => {
    if(dateString != "") {
      var infoForm = this.state.infoForm;
      infoForm.dob = dateString;
      this.setState({
        infoForm:infoForm,
      });
    }
  }

  handleInfoClick = (e) => {
    // console.log(e.target.id);
    var celebData = Celebs.findOne({_id:e.target.id});
    // console.log(celebData);

    var infoForm = celebData;
    this.setState({
      infoPanelVisible: true,
      infoRemoveVisible: true,
      infoForm: infoForm,
    });
  }

  searchCeleb = (filter) => {
    // console.log("search", name)
    this.setState({
      celebFilter: filter
    })
  }

  render() {
    // const data = [
    //   'Robert Downy, Jr.',
    //   'Chris Hemsworth',
    //   'Scarlett Johansson',
    //   'Mark Ruffalo',
    //   'Paul Rudd',
    //   'Brie Larson',
    //   'Chris Pratt',
    //   'Don Cheadle',
    //   'Gwyneth Paltrow',
    //   'Josh Brolin',
    // ];

    return (
      <div>
      <List
      size="small"
      bordered
      dataSource={this.fetchCelebNames()}
      header={
        <Search
          placeholder="Enter celebrity name"
          onSearch={this.searchCeleb}
        />
      }
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
        <List.Item key={item._id}>
          <List.Item.Meta
            title={<span>{item.firstname} {item.lastname}</span>}
          />
          <div>
            <Button type="link" shape="circle" icon={<InfoCircleOutlined />}  id={item._id}  onClick={this.handleInfoClick}/>
          </div>
        </List.Item>
      )}
      />

      <Modal
      title="Celebrity Info"
      visible={this.state.infoPanelVisible}
      onOk={this.handleInfoOk}
      onCancel={this.handleInfoCancel}
      footer={[
        <Button key="Cancel" onClick={this.handleInfoCancel}>
        Return
        </Button>,
        <Popconfirm
          key="Remove"
          title="Are you sure remove this celebrity?"
          onConfirm={this.handleInfoRemove}
          okText="Yes"
          cancelText="No"
          >
          <Button style={{ marginLeft: 3, display:this.state.infoRemoveVisible? "initial" : "none" }} type="danger">
            Remove
          </Button>,
        </Popconfirm>,
        <Button key="Save" type="primary" onClick={this.handleInfoOk}>
        Save
        </Button>,
      ]}
      >
        <Input addonBefore="First Name" value={this.state.infoForm.firstname} id="info-firstname" onChange={this.infoChangeHandler} />
        <div style={{ margin: '24px 0' }} />
        <Input addonBefore="Last Name" value={this.state.infoForm.lastname}  id="info-lastname" onChange={this.infoChangeHandler}/>
        <div style={{ margin: '24px 0' }} />
        <p>Date of Birth:</p>
        <DatePicker id="info-dob" value={moment(this.state.infoForm.dob)} onChange={this.infoDobHandler}/>
        <div style={{ margin: '24px 0' }} />
        <p>About the Celebrity:</p>
        <TextArea
        id="info-desc"
        placeholder="Describe him/her..."
        autoSize={{ minRows: 2, maxRows: 10 }}
        onChange={this.infoChangeHandler}
        value={this.state.infoForm.desc}
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
