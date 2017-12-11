import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Constants, Accelerometer } from 'expo';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { x: 0, y: 0, z: 0 };
  }

  componentWillUnmount() {
    this._unsubscribeFromAccelerometer();
  }

  componentDidMount() {
    this._subscribeToAccelerometer();
  }

  _subscribeToAccelerometer = () => {
    this._acceleroMeterSubscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      this.setState({ x, y, z });
    });
  };

  _unsubscribeFromAccelerometer = () => {
    this._acceleroMeterSubscription && this._acceleroMeterSubscription.remove();
    this._acceleroMeterSubscription = null;
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Accelerometer:
          x={this.state.x.toFixed(2)}{', '}
          y={this.state.y.toFixed(2)}{', '}
          z={this.state.z.toFixed(2)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
    
