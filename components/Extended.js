import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import * as css from '../app/Styles';

export default class Extended extends Component {

    render(){
        return (
            <View style={css.extended_component.container}>
                <Text style={css.today_component.text_location}>Temprature</Text>
                <Image/>
                <Text>{this.props.data.min}</Text>
                <Text>{this.props.data.max}</Text>
            </View>
        );
    }

};
