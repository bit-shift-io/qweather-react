import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import * as css from '../app/Styles';

export default class Seperator extends Component {

    render(){
        return (
            <View style={css.seperator_component.container}>
            </View>
        );
    }

};
