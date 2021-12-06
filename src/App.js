import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import dataA from "./sudA.csv";
import dataB from "./sudB.csv";
//import VictoryBar from 'victory';
import * as V from 'victory';
import { VictoryBar, VictoryChart } from 'victory';

// const csv = require('csv-parser')
// const fs = require('fs')
// const results = [];


import { csv } from 'd3';

function App() {

  let [bTime, setBTime] = useState(0);
  let [bTime1, setBTime1] = useState(0);
  let [bTime2, setBTime2] = useState(0);
  let [bTime3, setBTime3] = useState(0);

  let [data, setData] = useState([]);
  let [data1, setData1] = useState([]);
  let [data2, setData2] = useState([]);
  let [data3, setData3] = useState([]);

  useEffect(() => {

    let convertTime = function (mTime) {
      let arr = mTime.split(':');
      let num = parseInt(arr[0]) * 60 + parseInt(arr[1]);
      return num;
    }

    csv(dataB).then(data => {
      let map = new Map();
      let victoryArr = [];
      let count = 1;
      let sum = 0;
      let set = new Set();
      for (let i = 0; i < data.length; i++) {
        if (JSON.parse(data[i]['q5 info']).boardStates == "#victory" && !set.has(data[i].uid)) {
          set.add(data[i].uid);
          let time = convertTime(JSON.parse(data[i]['q5 info']).timePassed);
          victoryArr.push({ num: count++, uid: data[i].uid, time: time });
          sum = sum + time;
        }
      }

      // console.log("victory arr");
      // console.log(victoryArr);
      setData(victoryArr);
      setBTime(sum / count);
      return set;
    }).then((set) => {
      // console.log(set);
    });


    csv(dataA).then(data => {
      // console.log("here A");
      let victoryArr = [];
      let count1 = 1;
      let sum = 0;
      let total = 0;
      for (let i = 0; i < data.length; i++) {

        if (data[i].Name == 'victory') {
          let time = JSON.parse(data[i].Info).elapsed / 1000;
          if (time < 600) {
            total++;
            sum = sum + time;
            victoryArr.push({ num1: count1++, uid: data[i].Uid, time1: time });

          }
        }
      }
      // console.log("victoryArr");
      // console.log(victoryArr);
      setData1(victoryArr);
      setBTime1(sum / total);

    });


    //time taken between each input
    csv(dataB).then(data => {
      //  console.log("here B");
      let map = new Map();
      let victoryArr = [];
      let count = 1;
      let sum = 0;
      let set = new Set();
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i]);

        if (map.has(data[i].uid)) {
          let newArr = map.get(data[i].uid).concat(data[i]);
          map.set(data[i].uid, newArr);
        } else {
          map.set(data[i].uid, [data[i]])
        }

      }

     // console.log(map);


      for (let [key, value] of map) {
        let inputs = 0;
        let i = 1;
        for (; i < value.length; i++) {

        //  console.log(value[i]['q6 state'].split('&answer=')[1].split('&work=')[0], value[i - 1]['q6 state'].split('&answer=')[1].split('&work=')[0], value[i]['q6 state'].split('&answer=')[1].split('&work=')[0] == value[i - 1]['q6 state'].split('&answer=')[1].split('&work=')[0]);
          if (value[i]['q6 state'].split('&answer=')[1].split('&work=')[0] != value[i - 1]['q6 state'].split('&answer=')[1].split('&work=')[0]) {
            inputs++;
          }
        }
        if (inputs > 0) {
          victoryArr.push({ count: count++, inputs })
        }
      }

     // console.log(victoryArr);
      setData2(victoryArr);
      return set;
    }).then((set) => {
      // console.log(set);
    });




    csv(dataA).then(data => {
      //  console.log("here B");
      let map = new Map();
      let victoryArr = [];
      let count = 1;
      let sum = 0;
      let set = new Set();
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i]);

        if (map.has(data[i].Uid)) {
          let newArr = map.get(data[i].Uid).concat(data[i]);
          map.set(data[i].Uid, newArr);
        } else {
          map.set(data[i].Uid, [data[i]])
        }

      }

      console.log(map);


      for (let [key, value] of map) {
        let inputs = 0;
        let i = 1;
        for (; i < value.length; i++) {
         // console.log(value[i]);
          //  console.log(value[i]['q6 state'].split('&answer=')[1].split('&work=')[0] , value[i-1]['q6 state'].split('&answer=')[1].split('&work=')[0] , value[i]['q6 state'].split('&answer=')[1].split('&work=')[0] == value[i-1]['q6 state'].split('&answer=')[1].split('&work=')[0] );
          // console.log("u",value[i].State);
          // console.log(0,value[i].State.split('&answer='));
          // console.log(1,value[i].State.split('&answer=')[1]);
          // console.log(2,value[i].State.split('&answer=')[1].substring(0,5) != '&work');

          if (value[i].State && value[i].State.split('&answer=')[1].substring(0,5) != '&work' && value[i - 1].State && value[i - 1].State.split('&answer=')[1].substring(0,5) != '&work' ) {
           // console.log(4,value[i].State.split('&answer=')[1].split('&work=')[0] , value[i - 1].State.split('&answer=')[1].split('&work=')[0]);
            if (value[i].State.split('&answer=')[1].split('&work=')[0] != value[i - 1]['State'].split('&answer=')[1].split('&work=')[0]) {
              inputs++;
            }
          }
        }
        if (inputs > 0) {
          victoryArr.push({ count: count++, inputs })
        }
      }

      console.log(victoryArr);
      setData3(victoryArr);
      return set;
    }).then((set) => {
      // console.log(set);
    });


  }, []);


  //   time1: 46059.496
  // uid: "OS_X-Chrome-32718434860304346"
  return (
    <div className="App">
      <h1>Sudoku B Implementation victory time</h1>

      <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : time taken to solve puzzle in seconds &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Average time taken to solve : {bTime.toFixed(2)} seconds</b></p>

      <VictoryChart domainPadding={20}>
        <VictoryBar
          data={data}
          // data accessor for x values
          x="num"
          // data accessor for y values
          y="time"
        />
      </VictoryChart>

      <br />
      <br />
      <br />

      <h1>Sudoku A Implementation victory time</h1>
      <h3>(outliers with 600 seconds+ time were removed)</h3>
      <p><b>x-axis</b> : number # of games played (~280) &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : time taken to solve puzzle in seconds &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Average time taken to solve : {bTime1.toFixed(2)} seconds</b></p>

      <VictoryChart >
        <VictoryBar
          data={data1}
          // data accessor for x values
          x="num1"
          // data accessor for y values
          y="time1"
        />
      </VictoryChart>


      <div>
        <h1>Sudoku B number of inputs given(cell number change)</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : number of inputs &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>

        <VictoryChart domainPadding={20}>
          <VictoryBar
            data={data2}
            // data accessor for x values
            x="count"
            // data accessor for y values
            y="inputs"
          />
        </VictoryChart>
      </div>



      <div>
        <h1>Sudoku A number of inputs given(cell number change)</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : time taken between inputs &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>

        <VictoryChart domainPadding={20}>
          <VictoryBar
            data={data3}
            // data accessor for x values
            x="count"
            // data accessor for y values
            y="inputs"
          />
        </VictoryChart>
      </div>
      {/* <div>
        <h1>Sudoku B number of inputs given(board state change record event)</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : time taken between inputs &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>

        <VictoryChart domainPadding={20}>
          <VictoryBar
            data={data2}
            // data accessor for x values
            x="count"
            // data accessor for y values
            y="inputs"
          />
        </VictoryChart>
      </div> */}
    </div>
  );
}

export default App;
