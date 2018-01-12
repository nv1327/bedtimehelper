import React from 'react';
import { Button, ScrollView, Text, StyleSheet, Picker, View } from 'react-native';
import moment from 'moment';

//https://stackoverflow.com/questions/39878057/how-to-add-minutes-to-date-in-react-native
//https://stackoverflow.com/questions/37600750/how-to-prevent-two-react-native-pickers-from-affecting-each-other

//Current position: countdown logic
//If someone selects 23:59 (as in 11:59pm) and 1:00am, the difference is 22:59, but they are only an hour apart!
//Maybe do a pyramid of values where 1 has a low value, it builds up where 12 has a high value, and goes back down where 24 has a low value.

export default class App extends React.Component {
  constructor(props) {
    super(props);
    //state is where write and read variables are declared, but variables in the render() function are read-only
    //pretty much all variables that you want to change should be state, but the only problem is that you can't set them equal to variables as a declaration, but you can do that in the render() function
    this.state = {
      time: new Date().toLocaleString(),
      thishour: 0,
      thisminute: 0,
      thisdaytime: "",
      daytimebool: false,
      counter: 0,
      countdownhour: 0,
      countdownminute: 0,
      countdownsec: 0,
    };
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    this.setState({
      time: new Date().toLocaleString()
    });
  }

  render() {

    //current time
    const currenttime = moment(this.state.time).format("HH:mm:ss");
    const currenthour = moment(this.state.time).format("HH");
    const currentminute = moment(this.state.time).format("mm");
    const currentsecond = moment(this.state.time).format("ss");
    const hourmult = currenthour * 60 * 60;
    const minutemult = currentminute * 60;
    const secondmult = currentsecond * 1;
    const hourtime = Number.parseInt(hourmult, 10);
    const minutetime = Number.parseInt(minutemult, 10);
    const secondtime = Number.parseInt(secondmult, 10);
    const timemult = hourtime + minutetime + secondtime;

    //selected bedtime
    const hour2time = this.state.thishour;
    const minute2time = this.state.thisminute;
    const second2time = 0;
    const hour2mult = hour2time * 60 * 60;
    const minute2mult = minute2time * 60;
    const second2mult = second2time * 1;
    const hour3time = Number.parseInt(hour2mult, 10);
    const minute3time = Number.parseInt(minute2mult, 10);
    const second3time = Number.parseInt(second2mult, 10);
    const time2mult = hour3time + minute3time + second3time;

    //countdown logic
    const countdownsec = Math.abs(timemult - time2mult);
    const countdownminute = countdownsec / 60;
    const countdownhour = +((countdownminute / 60).toFixed(2)); //https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
    this.state.countdownhour = countdownhour;
    this.state.countdownsec = countdownsec;

    //for displaying "2H 34M" rather than 2.55hrs...
      this.state.countdownhour = truncator(countdownhour, 0); //should make the hour 0
      this.state.countdownminute = (countdownhour - this.state.countdownhour) * 60;
      this.state.countdownminute = truncator(this.state.countdownminute, 0);
      //NOW I HAVE TO DO THE SAME ADJUSTMENT WITH SECONDS --> multiply this.state.countdownhour by 3600, this.state.countdownminute by 60, and add those together, and subtract that from the countdownsec consistently

    //truncator function that cuts off the end of floating point numbers --> https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
    function truncator(numToTruncate, intDecimalPlaces) {
      var numPowerConverter = Math.pow(10, intDecimalPlaces);
      return ~~(numToTruncate * numPowerConverter)/numPowerConverter;
    };


    //round the countdownhour to two decimal places!
    //there have to be some recurring patterns where you can use if loops to figure out every combination
    //of hours and minutes and seconds based on the seconds alone.
    //To start, maybe I can just divide the seconds by 3600 and then display, for example, "3.56 hours left" and after a minute, "3.57 hours left"
    //Then, I can figure out exact hour, minute and second countdowns


    if (this.state.thisdaytime === "PM") {
        this.state.daytimebool = true;
    }

    if (this.state.daytimebool === true && this.state.counter < 1) {
      this.state.thishour += 12; //gives 112 when it should give 14 --> issue was that the picker values were strings, not integers
      this.state.daytimebool = false;
      this.state.counter += 1;
    }

    if (this.state.thisdaytime === "AM") {
      this.state.counter = 0;
      this.state.daytimebool = false;
    }

    return (
      <View style = {styles.container}>
        <View style = {{alignItems: 'center'}}>
          <View style={{flex: 0.5, marginTop: 50}}>
            <Text style = {styles.container}>
              The time is {this.state.time}.
            </Text>
            <Text style = {styles.container}>
              In military time, the time is {currenttime}.
            </Text>
            <Text style = {styles.container}>
              You selected {hour2time}:{minute2time}{this.state.thisdaytime}!
            </Text>
            <Text style = {styles.container}>
              {countdownsec} seconds until bedtime.
            </Text>
            <Text style = {styles.container}>
              {this.state.countdownhour} hours, {this.state.countdownminute} minutes and {this.state.countdownsec} seconds until bedtime.
            </Text>
          </View>
          <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: -70, marginBottom: -70, position: 'absolute', bottom: 0}}>
            <View style={{flex:1/3, width: 100}}>
              <Picker
                selectedValue={this.state.thishour}
                onValueChange={(value) => this.setState({thishour: value})}>
                <Picker.Item label={"1"} value= {1} />
                <Picker.Item label={"2"} value= {2} />
                <Picker.Item label={"3"} value= {3} />
                <Picker.Item label={"4"} value= {4} />
                <Picker.Item label={"5"} value= {5} />
                <Picker.Item label={"6"} value= {6} />
                <Picker.Item label={"7"} value= {7} />
                <Picker.Item label={"8"} value= {8} />
                <Picker.Item label={"9"} value= {9} />
                <Picker.Item label={"10"} value= {10} />
                <Picker.Item label={"11"} value= {11} />
                <Picker.Item label={"12"} value = {12} />
              </Picker>
             </View>
             <View style={{flex:1/3, width: 100}}>
               <Picker
                 selectedValue={this.state.thisminute}
                 onValueChange={(value) => this.setState({thisminute: value})}>
                 <Picker.Item label={"00"} value = {"00"} />
                 <Picker.Item label={"05"} value= {"05"} />
                 <Picker.Item label={"10"} value= {"10"} />
                 <Picker.Item label={"15"} value= {"15"} />
                 <Picker.Item label={"20"} value= {"20"} />
                 <Picker.Item label={"25"} value= {"25"} />
                 <Picker.Item label={"30"} value= {"30"} />
                 <Picker.Item label={"35"} value= {"35"} />
                 <Picker.Item label={"40"} value= {"40"} />
                 <Picker.Item label={"45"} value= {"45"} />
                 <Picker.Item label={"50"} value= {"50"} />
                 <Picker.Item label={"55"} value= {"55"} />
               </Picker>
             </View>
             <View style={{flex:1/3, width: 100}}>
               <Picker
                 selectedValue={this.state.thisdaytime}
                 onValueChange={(value) => this.setState({thisdaytime: value})}>
                 <Picker.Item label={"AM"} value = {"AM"} />
                 <Picker.Item label={"PM"} value= {"PM"} />
               </Picker>
             </View>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex:1,
  },
  title: {

  },
  activeTitle: {
    color: 'red',
  },
  picker: {
    width: 100,
  }
});
