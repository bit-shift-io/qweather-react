import React from 'react';
import {StyleSheet} from 'react-native';


export const colors = {
    'primary': '#1ab2ff',
    'secondary': '#ffffff',
    'background_dark': '#4d4d4d',
    'widget_background': '#333333',
    'text_light': '#ffffff',
    'text_light_alpha': '#ffffff98',    
    "text_medium": '#464646',
    "text_dark": '#263238',
    'separator_background': '#E2E2E220',
    'text_forecast_min': '#88ff4d',
    'text_forecast_max': '#cc3300',
    'text_forecast_rain': '#0066ff',
};


export const values = {
    'font_body': 'NotoSans-Regular',
    'font_body_size': 14,
    'font_title_size': 16,
    'font_place_size': 20,
    'font_small_temp_size': 22,
    'font_temp_size': 48,
    'border_radius': 2,
    "tiny_icon_size": 22,
    "small_icon_size": 40,
    "large_icon_size": 110,
};

export const add_degrees = (temp) => {
    return temp + String.fromCharCode(176);
};

export const add_km = (speed) => {
    return speed + 'km';
};

export const add_kt = (speed) => {
    return speed + 'kt';
};

export const expand_wind_dir = (dir) => {
    if (!dir)
        return;

    var result = '';
    for (var i=0; i<dir.length; i++){
        if (i > 0)
            result = result + ' ';

        char = dir[i];

        switch(char) {
            case 'N':
                result = result + 'North';
                break;
            case 'S':
                result = result + 'South';
                break;
            case 'W':
                result = result + 'West';
                break;
            case 'E':
                result = result + 'East';
                break;            
            default:
              // code block
          }       
    }
    return result;
};


export const add_mm = (rain) => {
    return rain + 'mm';
};  

export const get_widow_width = () => {
    Dimensions.get('window').width;
};

export const capitalize = (string) => {
    if (string)
        return string.charAt(0).toUpperCase() + string.slice(1);
}

export const home = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: colors.background_dark,
    },
});


export const today_component = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        height: 210,
        backgroundColor: colors.primary,
        alignSelf: 'stretch', // stretch width
        elevation: 3,
        padding: 10,
    },
    container_left:{
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch', // stretch width
    },      
    container_right:{
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch', // stretch width
        alignItems: 'flex-end',
    },          
    text_location:{
        color: colors.text_light,
        textAlign: 'left',
        fontSize: values.font_place_size,
        fontFamily: values.font_body,
    },
    text_temp:{
        color: colors.text_light,
        textAlign: 'left',
        fontSize: values.font_temp_size,
        fontFamily: values.font_body,
    },
    text_min:{
        color: colors.text_light_alpha,
        textAlign: 'left',
        fontSize: values.font_small_temp_size,
        fontFamily: values.font_body,
    },   
    text_max:{
        color: colors.text_light,
        textAlign: 'left',
        fontSize: values.font_small_temp_size,
        fontFamily: values.font_body,
    },          
    text_body:{
        color: colors.text_light_alpha,
        textAlign: 'left',
        fontSize: values.font_title_size,
        fontFamily: values.font_body,
    },   
    text_item:{
        color: colors.text_light,
        textAlign: 'left',
        fontSize: values.font_title_size,
        fontFamily: values.font_body,
    },        
    image_icon:{
        width:100,
        height:100,
    }, 
    spacer:{
        flex:1,
    }     
});

export const widget = StyleSheet.create({
    container: {
        flex: 0,
        padding: 10,
        margin: 10,
        borderRadius: 5,
        flexDirection: 'column', // main axis
        justifyContent: 'center', // main axis
        alignItems: 'center', // cross axis
        backgroundColor: colors.widget_background,
        alignSelf: 'stretch', // stretch width
        elevation: 3,
    },
    // wrapper to allow full width
    wrapper:{
        flexDirection: 'row',
    },
    flatlist:{
        alignSelf: 'stretch',
    }

});


export const forecast_component = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        height: 40,
        alignSelf: 'stretch', // stretch width
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_day:{
        flex: 1,
        color: colors.text_light,
        textAlign: 'left',
        fontSize: values.font_body_size,
        fontFamily: values.font_body,
    },
    text_rain:{
        color: colors.text_forecast_rain,
        textAlign: 'center',
        fontSize: values.font_body_size,
        fontFamily: values.font_body,
        width:80
    },      
    text_min:{
        color: colors.text_forecast_min,
        textAlign: 'center',
        fontSize: values.font_body_size,
        fontFamily: values.font_body,
        width:40
    },  
    text_max:{
        color: colors.text_forecast_max,
        textAlign: 'center',
        fontSize: values.font_body_size,
        fontFamily: values.font_body,
        width:40
    },   
    image_icon:{
        width:100,
    },               
});


export const extended_component = StyleSheet.create({
    container:{
        flex: 0,
        flexDirection: 'column',
        margin: 1,
        height: 40,
        width: 80,
    },
});


export const seperator_component = StyleSheet.create({
    container:{
        backgroundColor: colors.separator_background,
        height: 2,
    },
});