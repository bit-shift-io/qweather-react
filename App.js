
import React, {Component} from 'react';
import {
  Platform, 
  Text, 
  ScrollView, 
  View, 
  FlatList,
  RefreshControl,
  DrawerLayoutAndroid,
} from 'react-native';

import { EventRegister } from 'react-native-event-listeners';

import * as css from './app/Styles';
import Forecast from './components/Forecast';
import Today from './components/Today';
import Extended from './components/Extended';
import Seperator from './components/Seperator';
import Weather from './app/Weather';
import Location from './app/Location';

/*
// To see all the requests in the chrome Dev tools in the network tab.
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest;

  // fetch logger
global._fetch = fetch;
global.fetch = function (uri, options, ...args) {
  return global._fetch(uri, options, ...args).then((response) => {
    console.log('Fetch', { request: { uri, options, ...args }, response });
    return response;
  });
}; 
*/


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      refreshing: false,
    };    
 
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    Weather.fetch_data().then(() => {
      this.setState({refreshing: false});
    });
  }
 

  render() {
    return (

    <DrawerLayoutAndroid
      drawerWidth={300}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      renderNavigationView={() => {
        <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
      </View>
      }}
      >
      <ScrollView 
        style={css.home.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >

        <Today/>
        
        <View style={[css.widget.wrapper, css.widget.container]}>
          <FlatList 
            style={css.widget.flatlist}
            data={Weather.forecast_data}
            renderItem={(item) => {
              return <Forecast data={item.index} />
            }}
            ItemSeparatorComponent={() => <Seperator/>}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

      </ScrollView>
    </DrawerLayoutAndroid>   

    );
  }


/*
        <View style={[css.widget.wrapper, css.widget.container]}>
          <FlatList 
            style={css.widget.flatlist}
            data={Weather.forecast_data}
            renderItem={({item}) => <Extended data={item} />}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>    
        */
       
  // listener
  componentWillMount() {
    Location.init();
    Weather.init();

    this.listener = EventRegister.addEventListener('Weather', (data) => {
      this.forceUpdate();
    })

    // set location
    this.listener = EventRegister.addEventListener('Location', (data) => {
      Weather.set_location(Location.state);
    })
  }

  // listener
  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }

}

