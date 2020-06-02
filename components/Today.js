import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as css from '../app/Styles';
import Weather from '../app/Weather';
import Image from 'react-native-remote-svg'

export default class Today extends Component {

    render(){
        if (!Weather.observation_data) {
            return null;
        }
        
        return (
            <View style={css.today_component.container}>
                <View style={css.today_component.container_left}>
                    <Image style={css.today_component.image_icon} source={Weather.get_icon(Weather.observation_data.summary)}/>
                    <View style={css.today_component.spacer} />
                    <Text style={css.today_component.text_temp}>
                        {css.add_degrees(Weather.observation_data.temp)}
                    </Text>
                    <Text style={css.today_component.text_body}>
                        Feels like &nbsp;
                        <Text style={css.today_component.text_item}>
                            {css.add_degrees(Weather.observation_data.feel)}
                        </Text>
                    </Text>
                </View>
                <View style={css.today_component.container_right}>
                    <Text style={css.today_component.text_location}>
                            {Weather.observation_data.name}
                    </Text>
                    <View style={css.today_component.spacer} />
                    <Text style={css.today_component.text_item}>
                        {css.add_km(Weather.observation_data.wind_speed_kmh)} / {css.add_kt(Weather.observation_data.wind_speed_kt)}
                    </Text>
                    <Text style={css.today_component.text_body}>
                        {css.expand_wind_dir(Weather.observation_data.wind_dir)}
                    </Text>
                    <View style={css.today_component.spacer} />                 
                    <Text style={css.today_component.text_item}>
                        {css.add_mm(Weather.observation_data.rain)}
                    </Text>
                    <View style={css.today_component.spacer} />
                    <Text style={css.today_component.text_min}>
                        {Weather.observation_data.min} &nbsp;
                        <Text style={css.today_component.text_max}>
                            {Weather.observation_data.max}
                        </Text>
                    </Text>
                    <Text style={css.today_component.text_body}>
                        {css.capitalize(Weather.observation_data.summary)}
                    </Text>
                </View>
            </View>
        );
    }


};
