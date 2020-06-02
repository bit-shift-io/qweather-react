import React from 'react';
import { AsyncStorage } from "react-native";
import { EventRegister } from 'react-native-event-listeners';

class Location {
    state = {
        'lat': null,
        'lon': null,
        'alt': null,
    }

    init(){
        this._retrieveData()
        .then (() => {
            this.update_user_location();
        })
        .then(() => {
            this._storeData();
        });
    }

    async update_user_location(){
        new_state = [];
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longitude = JSON.stringify(position.coords.longitude);
                const altitude = JSON.stringify(position.coords.altitude);
                new_state = {
                    'lat': latitude,
                    'lon': longitude,
                    'alt': altitude,
                };
            },
            (error) => alert(error.message),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
        );

        
        // temp
        new_state = {
            'lon':'138.59',
            'lat':'-34.92',
            'alt':'0',
        }

        // check for change
        if (this.state != new_state){
            this.state = new_state;
            EventRegister.emit('Location', 'state'); 
        }
    }


    is_state_valid(){
        if (this.state.lat && this.state.lon && this.state.alt)
            return true;

        return false;
    }

    // write cache
    _storeData = async () => {
        if (!this.is_state_valid())
            return;

        try {
            await AsyncStorage.setItem('@Location:state', JSON.stringify(this.state));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    }

    // read cache
    _retrieveData = async () => {
        try {
            const state = await AsyncStorage.getItem('@Location:state');

            if (state !== null) {
                this.state = JSON.parse(state);
            }

        } catch (error) {
            console.log('Read Error: ');
            console.log(error);
        }
    }

}

export default new Location();