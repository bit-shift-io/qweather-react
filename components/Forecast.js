import React, { Component } from 'react';
import { View, Text } from 'react-native';

import Image from 'react-native-remote-svg'
import * as css from '../app/Styles';
import Weather from '../app/Weather';

export default class Forecast extends Component {
    day = Weather.forecast_data[this.props.data];

    render(){
        return (
            <View style={css.forecast_component.container}>
                <Text style={css.forecast_component.text_day}>{this.day.name}</Text>
                <Text style={css.forecast_component.text_rain}>{this.day.rain}</Text>
                <Image style={css.forecast_component.image_icon} source={Weather.get_icon(this.day.summary)}/>
                <Text style={css.forecast_component.text_min}>{this.day.min}</Text>
                <Text style={css.forecast_component.text_max}>{this.day.max}</Text>
            </View>
        );
    }

};
