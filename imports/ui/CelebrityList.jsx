import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, List, Input } from 'antd';
import 'antd/dist/antd.css';
import { Celebs } from '../api/celebs.js';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import InfoBox from './InfoBox.jsx';

const { Search } = Input;

const SORT_NONE = 0;
const SORT_ASC = 1;
const SORT_DESC = 2;

class CelebrityList extends Component {
  state = {
    infoCelebId: "",
    infoBoxVisible: false,
    celebFilter: "",
    sort: SORT_ASC
  };

  fetchCelebNames() {
    let filter = this.state.celebFilter;
    let celebs = [];
    if(filter) {
      celebs = Celebs.find({
        $or:[
          {firstname : {$regex : ".*" + filter +".*", $options: "i"}},
          {lastname : {$regex : ".*" + filter +".*", $options: "i"}}
        ]}).fetch().map((celeb) => {
        return celeb;
      });
    } else {
      celebs = Celebs.find({}).fetch().map((celeb) => {
        return celeb;
      });
    }

    if(this.state.sort == SORT_ASC) {
      celebs = celebs.sort(function(a, b) {
          return a.lastname+a.firstname > b.lastname+b.firstname? 1: -1;
      });
    }
    return celebs;
  }


  onAddCelebrity = (event) => {
    this.setState({
      infoCelebId: "",
      infoBoxVisible: true
    })
  };

  handleInfoClick = (e) => {
    this.setState({
      infoCelebId: e.target.id,
      infoBoxVisible: true
    })
  }

  handleInfoClose = (e) => {
    this.setState({
      infoBoxVisible: false
    })
  }

  searchCeleb = (filter) => {
    this.setState({
      celebFilter: filter
    })
  }

  render() {
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
        <br/>
        <InfoBox celebId={this.state.infoCelebId} visible={this.state.infoBoxVisible} onClose={this.handleInfoClose}/>
      </div>
    );
  }
};

export default withTracker(() => {
  return {
    celebs: Celebs.find({}).fetch(),
  };
})(CelebrityList);
