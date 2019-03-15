import React, {Component} from 'react';

import Greenhouse from './Greenhouse.js';

import axios from 'axios';
import $ from 'jquery';
import io from 'socket.io-client';

// socket.on('conn', msg=>{
//   console.log(msg);
// });



export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { greenhouses:[], endpoint:'http://localhost:8080/' };
    this.addGreenhouse = this.addGreenhouse.bind(this);
    this.deleteGreenhouse = this.deleteGreenhouse.bind(this);
    this.updateStats = this.updateStats.bind(this);
    try{
      this.socket = io(this.state.endpoint);
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {

    this.socket.on('greenhouse_updated', greenhouse=>{
      // update the starte
      // const index = this.state.greenhouses.indexOf(greenhouse);
      const index = this.state.greenhouses.map(g=> g._id).indexOf(greenhouse._id);
      let greenhouses = this.state.greenhouses;
      greenhouses[index] = greenhouse;
      this.setState({greenhouses:greenhouses});
      // return;
    });
    this.getGreenhouses();
  }
  componentWillUnmount() {
    this.socket.off('greenhouse_updated');
  }
  addGreenhouse() {
    const config = {
      headers: {'Authorization': 'bearer ' + this.props.token}
    };
    const ghName  = $('#greenhouseName').val();
    axios.put('api/assigngreenhouse', {greenhousename:ghName}, config)
      .then( res => {
        // if it works and success is true add the greenhouse in the array
        if(res.data.success === true) {
          this.props.updateUser(ghName);
          // this.setState({greenhouses.})
        } else {
          console.log('Greenhouse is not in the database');
        }
      })
      .catch(err => console.log(err));
  }

  deleteGreenhouse(id) {
    const config = {
      headers: {'Authorization': 'bearer ' + this.props.token}
    };
    axios.delete(`/api/unassigngreenhouse/${id}`, config)
      .then(res=> {
        const greenhouses = this.state.greenhouses.filter(g => {
          if(!(g._id === id)) {
            return g;
          }
        });
        this.setState({greenhouses:greenhouses});
      })
      .catch(err => console.log(err));
  }

  updateStats(greenhouse) {
  }

  getGreenhouses() {
    // set up the token
    const config = {
      headers: {'Authorization': 'bearer ' + this.props.token}
    };
    // get all the greenhouses that are already registered
    axios.get('/api/getgreenhouses', config)
      .then(res=>{
        if(res.data.length === 0) {
          // set up state to show that there isn't any greenhouse assigned
          console.log('no greenhouses assigned');
        } else {
          // setup state to show the values in a nice table
          this.setState({greenhouses:res.data});
        }
      })
      .catch(err=> console.log(err));
  }

  render() {
    const greenhouseList = this.state.greenhouses.map(g =>
      <Greenhouse
        key = {g._id}
        id = {g._id}
        liveStats = {g.live_stats}
        name = {g.name}
        controls={g.controls}
        deleteGreenhouse = {this.deleteGreenhouse}
        updateStats = {this.updateStats}
        imageUrl = {g.imageUrl}
      />
    );

    return(
      <div>
        <div className='row'>
          <div className='col'>
            <input type='text' id='greenhouseName'  className='form-control' name='greenhouseName'/>
          </div>
          <div className='col'>
            <button onClick={this.addGreenhouse} className='btn btn-primary'>Add a greenhouse </button>
          </div>
        </div>

        {greenhouseList}
      </div>
    );
  }
}


// to be updated
const Status = () => <div>You currently have one or more greenhouses connected to the database.</div>;
