import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Modal, Input, DatePicker, Layout, Popconfirm, Avatar, Badge, message  } from 'antd';
import 'antd/dist/antd.css';
import { Celebs } from '../api/celebs.js';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;

import moment from 'moment';



class InfoBox extends Component {
  state = {
    isVisible: false,
    celebId: "",
    infoExisting: false,
    scrapedInfo: "",
    infoForm: {
      _id:"",
      firstname:"",
      lastname:"",
      dob:"",
      desc:"",
    }
  };

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
    this.props.onClose();
  };

  handleInfoRemove = e => {
    if(this.state.infoForm._id) {
      Celebs.remove({
        _id: this.state.infoForm._id
      });
    }
    this.props.onClose();
  };

  handleInfoCancel = e => {
    this.props.onClose();
  };



  fetchCelebData = (celebId) => {
    let celebData = Celebs.findOne({_id:celebId});

    let infoForm = celebData;
    this.setState({
      isVisible:true,
      celebId:celebId,
      infoExisting: true,
      infoForm: infoForm,
      scrapedInfo: "",
    });

    let infoList = []
    fetch("http://localhost:5000/celeb-info/"+escape(celebData.lastname+"/"+celebData.firstname))
    .then((response) => response.json())
    .then((bio)=>{
      Object.keys(bio).map((key) => {
        if(key!="title" && key!="thumb" && key!="last_fetch" &&  bio[key] != "") {
          infoList.push(
            <li key={key}>{key}: {bio[key]}</li>
          );
        }
      });

      let infoContent = "";
      if(bio["last_fetch"]!="none") {
        infoContent = (
          <div>
          <div style={{ margin: '24px 0' }} />
          <p>Info from Wikipedia ({bio["last_fetch"]}):</p>
          <Layout>
            <Sider>
              <Avatar shape="square" size={200} src={bio["thumb"]} icon={<UserOutlined />} />
            </Sider>
            <Content>
              <br/><ul>{infoList}</ul>
            </Content>
          </Layout>

          </div>
        );
      } else {
        infoContent = (
          <div>
          <div style={{ margin: '24px 0' }} />
          <p>No info from Wikipedia :(</p>
          </div>
        );
      }

      this.setState({
        scrapedInfo: infoContent,
      });
    })
  }

  addCeleb = () => {
    this.setState({
      isVisible: true,
      infoExisting: false,
      scrapedInfo: "",
      infoForm: {
        _id:"",
        firstname:"",
        lastname:"",
        dob:"2000-01-01",
        desc:"",
      }
    });
  }


  infoChangeHandler = (e) => {
    let infoForm = this.state.infoForm;
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
  }

  infoDobHandler = (date, dateString) => {
    if(dateString != "") {
      let infoForm = this.state.infoForm;
      infoForm.dob = dateString;
      this.setState({
        infoForm:infoForm,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.visible){
      if(!this.state.isVisible) {
        if(this.props.celebId == "") {
          this.addCeleb();
        } else {
          this.fetchCelebData(this.props.celebId);
        }
      }
    } else {
      if(this.state.isVisible) {
        this.setState({
          isVisible:false
        })
      }
    }
  }

  render() {

    return(

      <Modal
      title="Celebrity Info"
      visible={this.state.isVisible}
      onOk={this.handleInfoOk}
      onCancel={this.handleInfoCancel}
      footer={[
        <Button key="Cancel" onClick={this.handleInfoCancel}>
        Close
        </Button>,
        <Popconfirm
          key="Remove"
          title="Are you sure remove this celebrity?"
          onConfirm={this.handleInfoRemove}
          okText="Yes"
          cancelText="No"
          >
          <Button style={{ marginLeft: 3, display:this.state.infoExisting? "initial" : "none" }} type="danger">
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
        <div>
          {this.state.scrapedInfo}
        </div>
      </Modal>
    );
  }
}

export default withTracker(() => {
  return {
    celebs: Celebs.find({}).fetch(),
  };
})(InfoBox);
