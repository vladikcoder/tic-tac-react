import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isFieldActive: true,
      currentToe: 'x',
      size: '3',
      fieldObject: App.getFieldStructure(),
      winCombinations: App.getWinCombinations(),
      winLane: []
    };
  }

  static getFieldStructure(size = '3') {
    let fieldObj = {};
    for (let i=1; i<=size; i++) {
      fieldObj[i] = {};
      for (let j=1; j<=size; j++) {
        fieldObj[i][j] = {
          'checked' : false,
          'toe': null,
        };
      }
    }

    return fieldObj;
  }

  static getWinCombinations(size) {
    let winComb = [];
    switch (size) {
    case '4':
      winComb = [
        ['11', '12', '13', '14'],
        ['21', '22', '23', '24'],
        ['31', '32', '33', '34'],
        ['41', '42', '43', '44'],

        ['11', '21', '31', '41'],
        ['12', '22', '32', '42'],
        ['13', '23', '33', '43'],
        ['14', '24', '34', '44'],

        ['11', '22', '33', '44'],
        ['41', '32', '23', '14']
      ];
      break;

    case '5':
      winComb = [
        ['11', '12', '13', '14', '15'],
        ['21', '22', '23', '24', '25'],
        ['31', '32', '33', '34', '35'],
        ['41', '42', '43', '44', '45'],
        ['51', '52', '53', '54', '55'],

        ['11', '21', '31', '41', '51'],
        ['12', '22', '32', '42', '52'],
        ['13', '23', '33', '43', '53'],
        ['14', '24', '34', '44', '54'],
        ['15', '25', '35', '45', '55'],

        ['11', '22', '33', '44', '55'],
        ['51', '42', '33', '23', '13']
      ];
      break;

    default:
      winComb = [
        ['11', '12', '13'],
        ['21', '22', '23'],
        ['31', '32', '33'],

        ['11', '21', '31'],
        ['12', '22', '32'],
        ['13', '23', '33'],

        ['11', '22', '33'],
        ['31', '22', '13']
      ];
      break;
    }

    return winComb;
  }

  getFieldComponent() {
    return Object.entries(this.state.fieldObject).map(([row, columnsObj]) => {
      return (
        <tr key={row}>
          {Object.keys(columnsObj).map(column =>
            <td
              key={`${row}${column}`}
              className={this.state.winLane.includes(`${row}${column}`) ? 'App-win-cell' : ''}
              onClick={() => this.clickHandler(row, column)}
            >
              {this.state.fieldObject[row][column]['checked']
                ? <img
                  src={`./images/${this.state.fieldObject[row][column]['toe']}.png`}
                  alt={this.state.fieldObject[row][column]['toe']}
                />
                : ''}
            </td>
          )}
        </tr>
      )
    });
  }

  clickHandler(row, column) {
    if(!this.state.isFieldActive || this.state.fieldObject[row][column]['checked']) {
      return;
    }

    this.setState(prevState => {
      let fieldObject = {...prevState.fieldObject};
      fieldObject[row][column]['checked'] = true;
      fieldObject[row][column]['toe'] = prevState.currentToe;

      return {
        ...prevState,
        currentToe: (prevState.currentToe === 'x') ? 'o' : 'x',
        fieldObject
      }
    }, () => this.isWin());
  }

  restartClickHandler() {
    this.setState(prevState => {
      return {
        ...prevState,
        isFieldActive: true,
        currentToe: 'x',
        fieldObject: App.getFieldStructure(prevState.size),
        winLane: []
      }
    });
  }

  selectSizeHandler(event) {
    let value = event.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        currentToe: 'x',
        fieldObject: App.getFieldStructure(value),
        isFieldActive: true,
        size: value,
        winCombinations: App.getWinCombinations(value),
        winLane: []
      }
    })
  }

  isWin() {
    for (let lane of this.state.winCombinations) {
      let isXWin = lane.every(winToe => this.state.fieldObject[winToe[0]][winToe[1]]['toe'] === 'x');
      let isOWin = lane.every(winToe => this.state.fieldObject[winToe[0]][winToe[1]]['toe'] === 'x');

      if (isXWin || isOWin) {
        this.setState(
          prevState => {
            return {
              ...prevState,
              isFieldActive: false,
              winLane: lane,
            }
          });

        return;
      }
    }
  }

  render() {
    App.getWinCombinations();
    return (
      <div className="App">
        <span>Size: </span>
        <select className="App-select" onChange={(event) => this.selectSizeHandler(event)}>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
        <table>
          <tbody>
            {this.getFieldComponent()}
          </tbody>
        </table>
        <br/>
        <button
          className="App-restart-btn"
          onClick={() => {this.restartClickHandler()}}
        >
          Restart
        </button>
      </div>
    )
  }
};

export default App;