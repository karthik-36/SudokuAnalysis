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
  let [bTime4, setBTime4] = useState(0);
  let [bTime5, setBTime5] = useState(0);
  let [bTime6, setBTime6] = useState(0);

  let [data, setData] = useState([]);
  let [data1, setData1] = useState([]);
  let [data2, setData2] = useState([]);
  let [data3, setData3] = useState([]);
  let [data4, setData4] = useState([]);
  let [data5, setData5] = useState([]);
  let [data6, setData6] = useState([]);

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
      let inputTotal = 0;
      for(let i = 0 ; i < victoryArr.length ; i++){
        inputTotal = inputTotal + victoryArr[i].inputs;
      }
      setBTime2(inputTotal/count);
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

      let temp = null;
      for (let [key, value] of map) {
        let inputs = 0;
        let i = 1;
        for (; i < value.length; i++) {
          if (temp == null) {
            if (value[i].State && value[i].State.split('&answer=')[1].substring(0, 5) != '&work' && value[i - 1].State && value[i - 1].State.split('&answer=')[1].substring(0, 5) != '&work') {

              if (value[i].State.split('&answer=')[1].split('&work=')[0] != value[i - 1]['State'].split('&answer=')[1].split('&work=')[0]) {
                inputs++;
                temp = value[i]['State'].split('&answer=')[1].split('&work=')[0];
              }
            }
          }

          else if(temp){

     
            if (value[i].State && value[i].State.split('&answer=')[1].substring(0, 5) != '&work') {
              if (value[i].State.split('&answer=')[1].split('&work=')[0] != temp) {
                inputs++;
                temp = value[i]['State'].split('&answer=')[1].split('&work=')[0];
              }
            }
          }
        }
        if (inputs > 0) {
          victoryArr.push({ count: count++, inputs })
        }
      }


      let inputTotal = 0;
      for(let i = 0 ; i < victoryArr.length ; i++){
        inputTotal = inputTotal + victoryArr[i].inputs;
      }
      setBTime3(inputTotal/count);
      setData3(victoryArr);
      return set;
    }).then((set) => {

    });

// errors encountered

    csv(dataB).then(data => {
      let map = new Map();
      let victoryArr = [];
      let count = 1;
      let sum = 0;
      let set = new Set();
      for (let i = 0; i < data.length; i++) {
  
        if (map.has(data[i].uid)) {
          let newArr = map.get(data[i].uid).concat(data[i]);
          map.set(data[i].uid, newArr);
        } else {
          map.set(data[i].uid, [data[i]])
        }
  
      }

      for (let [key, value] of map) {
        let inputs = 0;
        let i = 1;
        for (; i < value.length; i++) {
 
          if (JSON.parse(value[i]['q5 info']).boardStates == '#errors' && JSON.parse(value[i - 1]['q5 info']).boardStates != '#errors') {
            inputs++;
          }
        }

          victoryArr.push({ count: count++, inputs })
        
      }
  

      let inputTotal = 0;
      for(let i = 0 ; i < victoryArr.length ; i++){
        inputTotal = inputTotal + victoryArr[i].inputs;
      }
      setBTime4(inputTotal/count);
      setData4(victoryArr);
      return set;
    }).then((set) => {
    });






// arrow key movement
    csv(dataB).then(data => {
      let map = new Map();
      let victoryArr = [];
      let count = 1;
      let sum = 0;
      let set = new Set();
      for (let i = 0; i < data.length; i++) {
  
        if (map.has(data[i].uid)) {
          let newArr = map.get(data[i].uid).concat(data[i]);
          map.set(data[i].uid, newArr);
        } else {
          map.set(data[i].uid, [data[i]])
        }
  
      }
  

      for (let [key, value] of map) {
        let inputs = 0;
        let i = 1;
        for (; i < value.length; i++) {
      
          if(value[i]['q3 name'] == 'Arrow_movement'){
            let move = JSON.parse(value[i]['q5 info']).movement;
            if (move == 'ArrowUp' || move == 'ArrowDown'|| move == 'ArrowLeft'|| move == 'ArrowRight') {
              inputs++;
            }
          
          }
      
        }

          victoryArr.push({ count: count++, inputs })
      }

      let inputTotal = 0;
      for(let i = 0 ; i < victoryArr.length ; i++){
        inputTotal = inputTotal + victoryArr[i].inputs;
      }
      setBTime5(inputTotal/count);
      
      setData5(victoryArr);
      return set;
    }).then((set) => {
    });



// number key input
    csv(dataB).then(data => {
      let map = new Map();
      let victoryArr = [];
      let count = 1;
      let sum = 0;
      let set = new Set();
      for (let i = 0; i < data.length; i++) {
  
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
         // console.log(value[i]);
          if(value[i]['q3 name'] == 'keyboard_input'){
           if(JSON.parse(value[i]['q5 info']).inputNumber){
             inputs++;
           }
          }
      
        }
          victoryArr.push({ count: count++, inputs })
      }
      
      let inputTotal = 0;
      for(let i = 0 ; i < victoryArr.length ; i++){
        inputTotal = inputTotal + victoryArr[i].inputs;
      }
      setBTime6(inputTotal/count);
      setData6(victoryArr);
      
      return set;
    }).then((set) => {
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
      
      <hr style = {{width : "100%" , position : "absolute" , left : "0px"}} />
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

      
      <hr style = {{width : "100%" , position : "absolute" , left : "0px"}} />
      <br />
      <br />

      <div>
        <h1>Sudoku B number of inputs given(mouse + keyboard) to update/create/delete number in a cell</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : number of inputs &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
        <p> <b> average number of inputs per user per game : </b> {bTime2.toFixed(2)} </p>
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

      <hr style = {{width : "100%" , position : "absolute" , left : "0px"}} />
      <br />
      <br />
      <br />

      <div>
        <h1>Sudoku A number of inputs given(mouse only) to update/create/delete number in a cell</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : time taken between inputs &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
        <p> <b> average mouse only input per user only : </b> {bTime3.toFixed(2)} </p>
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

      <hr style = {{width : "100%" , position : "absolute" , left : "0px"}} />
      <br />
      <br />
      <br />



      <div>
        <h1>Sudoku B number of errors encountered while playing(reading available to B only)</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : number of errors encountered &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
        <p> <b> errors encounterd per user per game : </b> {bTime4.toFixed(2)} </p>
        (low number/0 on y means axis means the user did not encounter any error while playing, an expert sudoku player)
        <VictoryChart domainPadding={20}>
          <VictoryBar
            data={data4}
            // data accessor for x values
            x="count"
            // data accessor for y values
            y="inputs"
          />
        </VictoryChart>
      </div>


      <hr style = {{width : "100%" , position : "absolute" , left : "0px"}} />
      <br />
      <br />
      <br />



      <div>
        <h1>Sudoku B arrow keys used per player(reading available to B only)</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : number of arrow inputs given &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </p>
        <p> <b>Average arrow key inputs per user per game : </b> {bTime5.toFixed(2)} </p>
        <p> (0 on y means axis means the user did not use the arrow keys at all) </p>
        <VictoryChart domainPadding={20}>
          <VictoryBar
            data={data5}
            // data accessor for x values
            x="count"
            // data accessor for y values
            y="inputs"
          />
        </VictoryChart>
      </div>



      <hr style = {{width : "100%" , position : "absolute" , left : "0px"}} />
      <br />
      <br />
      <br />




      <div>
        <h1>Sudoku B number inputs given(1/2/3/4)(reading available to B only)</h1>
        <p><b>x-axis</b> : user number (1-10)  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>y-axis</b> : number of arrow inputs given &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p> <b>Average keyboard inputs per user per game : </b> {bTime6} </p>
        <p> (0 on y means axis means the user did not use number input at all) </p>
        
        <VictoryChart domainPadding={20}>
          <VictoryBar
            data={data6}
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
