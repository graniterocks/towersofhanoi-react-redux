import { createStore } from 'redux';

import React, { Component } from 'react';

import './App.css';

var defaultState = {
   towers : [{ key : 1, value : [1, 2, 3, 4, 5]}, {key : 2, value : []}, {key : 3, value :[]}] 
};

var StoreWithDelay = function(store) {
  this.store = store;
  this.cnt = 0;
}  

StoreWithDelay.prototype.dispatchMove = function(from, to) {
  setTimeout (() => { this.store.dispatch(moveDisc(from, to)) }, this.cnt++ * 1000);
};

var wrappedStore = new StoreWithDelay(createStore(moveDiscApp, defaultState));

function moveDisc(from, to) {
  return {
    type : 'MOVE_DISC',
    from : from,
    to: to
  };
}

function newState(tower, from, to, discToMove) {
    if (tower.key === from)
      return { key : tower.key, value : tower.value.filter((n) => n !== discToMove)};
    else if (tower.key === to)
      return { key : tower.key, value : [discToMove].concat(tower.value) }
    else 
      return tower;
}

function moveDiscApp(state, action) {
  if (action.from == null) {
    return state;
  }

  var discToMove = state.towers.filter((n) => n.key === action.from)[0].value[0];

  return {
    towers : state.towers.map((n) => newState(n, action.from, action.to, discToMove))
  };
}

class Disc extends Component {
 
  render() {
    var cWidth = this.props.number * 30; 

    return(
        <div className="disc" style={{"width" : cWidth}}>{this.props.number}</div>
    );
  }
}

class Tower extends Component {
  render() {
    return (
      <div className="innerDiv">
          <center>
            {this.props.discs.map((disc) => <Disc number={disc} key={disc} />)}
             <div className="spacer"></div>
          </center>   
      </div>
    );
  }
}

class TowersOfHanoi extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState

    this.solveTowersOfHanoi = this.solveTowersOfHanoi.bind(this);
  }

  componentWillMount() {
    wrappedStore.store.subscribe(() => {
      var state = wrappedStore.store.getState();
      this.setState({
        towers: state.towers
      });
    });
  }

  moveTower(size, from, to, extra, store) {
    if (size === 0) {
      return;
    } else {
      this.moveTower(size - 1, from, extra, to, store);
      store.dispatchMove(from, to);
      this.moveTower(size - 1, extra, to, from, store);
      return;
    }
  } 

  solveTowersOfHanoi() {
   this.moveTower(5, 1, 3, 2, wrappedStore);
  }

  render() {
    return (
      <div>
        <div className="outerDiv">
          { this.state.towers.map((discs) => <Tower discs={discs.value}  key={discs.key}/>) }
        </div>
        <div>
          <form>
            <input type="button" onClick={this.solveTowersOfHanoi} value="Solve" />
          </form>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <TowersOfHanoi />
        </div>    
      </div>
    );
  }
}

export default App;
