import React from 'react';
import { AsyncStorage } from "react-native";
var DomParser = require('react-native-html-parser').DOMParser;
import { EventRegister } from 'react-native-event-listeners';

// https://github.com/connected-io/react-native-xml2js
// https://github.com/g6ling/react-native-html-parser

class Weather {

    bom_url = 'http://www.bom.gov.au'
    user_location = [];

    // overview + forecast - http://www.bom.gov.au/places/sa/adelaide/
    // detailed forecast - http://www.bom.gov.au/places/sa/adelaide/forecast/detailed/
    url_data = [];
    forecast_data = [];
    detailed_forecast_data = [];

    observation_data = {
        name: 'Home',
        temp: '0',
        min: '0',
        max: '0',
        feel: '0',
        humidity: '0',
        pressure: '0',
        wind_speed_kmh: '0',
        wind_speed_kt: '0',
        wind_dir: 'N',
        summary: 'sunny',
        rain: '0',
    };
 
    icon_dict = {
        clear:require('../res/clear.png'),
        cloudy:require('../res/cloudy.png'),
        dust:require('../res/dust.png'),
        fog:require('../res/fog.png'),
        fog_night:require('../res/fog_night.png'),
        frost:require('../res/frost.png'),
        haze:require('../res/haze.png'),
        heavy_showers:require('../res/heavy_showers.png'),
        light_rain:require('../res/light_rain.png'),
        light_showers_night:require('../res/light_showers_night.png'),
        light_showers:require('../res/light_showers.svg'),
        partly_cloudy:require('../res/partly_cloudy.svg'),
        partly_cloudy_night:require('../res/partly_cloudy_night.png'),
        rain:require('../res/rain.png'),
        showers_night:require('../res/showers_night.png'),
        showers:require('../res/showers.png'),
        snow:require('../res/snow.png'),
        storm:require('../res/storm.png'),
        sunny:require('../res/sunny.svg'),
        tropicalcyclone:require('../res/tropicalcyclone.png'),
        wind:require('../res/wind.png'),
    };

    day_dict = {
        Sat:'Saturday',
        Sun:'Sunday',
        Mon:'Monday',
        Tue:'Tuesday',
        Wed:'Wednesday',
        Thu:'Thursday',
        Fri:'Friday',
    }

    get_icon(icon){
        if (!icon){
            return;
        }

        icon = icon.replace(' ','_');        
        return this.icon_dict[icon];
    }

    init(){
        /*
        this._retrieveData()
            .then(() => {
                this.update_bom()
                .then(() => {
                    this._storeData();
                });
            });    
            */   
    }

    set_station(station){
        this.station_data = station;
        this.fetch_data();
    }

    set_location(location){
        this.user_location = location;
        this.fetch_data();
    }

    get_html(html){
        // this is needed for /places/ url only
        // hack, replace the final </div> with </body></html> to get this to load!
        n = html.lastIndexOf('</div>');
        return html.substring(0, n) + '</body></html>';
    }

    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    get_feel(temp, humidity){
        // https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
        // https://www.wpc.ncep.noaa.gov/html/heatindex.shtml
        temp_air = temp;
        T = 1.80 * temp_air + 32.0;
        RH = humidity;
        heat_index = -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - 0.00683783*T*T - 0.05481717*RH*RH + 0.00122874*T*T*RH + 0.00085282*T*RH*RH - 0.00000199*T*T*RH*RH;
        if (RH < 13 && T >= 80 && T<=112){
            adjustment = ((13-RH)/4)*Math.sqrt((17-Math.abs(T-95.0))/17);
            heat_index = heat_index - adjustment;
        }
        if (RH > 85 && T >= 85 && T <= 87){
            adjustment = ((RH-85)/10) * ((87-T)/5);
            heat_index = heat_index + adjustment;
        }
        if (T < 80){
            heat_index = 0.5 * (T + 61.0 + ((T-68.0)*1.2) + (RH*0.094)); 
        }
        heat_index = this.round((heat_index - 32) / 1.80, 1);
        return heat_index;
    }

    async fetch_data(){
        return this.fetch_overview()
        .then(() => {
            this.fetch_detailed_forecast();
        })
        .then(() => {
            this._storeData();
        });
    }

    // update BOM weather
    async fetch_detailed_forecast(){
        promises = [];

        promises.push(fetch(this.url_data.detailed_forecast_html)
        .then(response => {
            return response.text()
        })
        .then((response) => {
            return this.parse_bom_detailed_forecast(response);
        })
        .catch((err) => {
            console.log('Weather, update bom', err)
        })); 

        return Promise.all(promises);
    }

    // update BOM weather
    async fetch_overview(){
        promises = [];
    
        // sample url
        // http://www.bom.gov.au/places/sa/KHEF/?location=Yatala
        // http://www.bom.gov.au/places/sa/victor-harbor/
        // http://www.bom.gov.au/places/search/?q=-34/138

        overview_url = 'http://www.bom.gov.au/places/search/?q=' + this.user_location.lat + '/' + this.user_location.lon
        console.log(overview_url);
        // update overview/forecast
        promises.push(fetch(overview_url)
        .then(response => {
            return response.text()
        })
        .then((response) => {
            return this.parse_bom_overview(response);
        })
        .catch((err) => {
            console.log('Weather, update bom', err)
        })); 

        return Promise.all(promises);
    }

    parse_bom_observation(html){
        let doc = new DomParser().parseFromString(this.get_html(html),'text/html');

        name = doc.getElementsByClassName('station-name')[0].firstChild.textContent.split('(')[0].trim();
        observations = doc.getElementsByClassName('observations')[0].getElementsByAttribute('id', 'summary-1')[0];
        temp = observations.getElementsByClassName('airT')[0].textContent.split(' ')[0];
        min = observations.getElementsByClassName('extT')[0].getElementsByClassName('temp')[0].textContent.split(' ')[0];
        max = observations.getElementsByClassName('extT')[1].getElementsByClassName('temp')[0].textContent.split(' ')[0];
        rain = observations.getElementsByClassName('rain')[0].textContent.split(' ')[0];
        
        table = observations.getElementsByTagName('table')[0].getElementsByTagName('td');
        humidity = table[0].textContent.replace('%','');
        wind_dir = table[1].textContent.trim();
        pressure = table[2].textContent;
        wind_speed_kmh = table[3].getAttribute('data-kmh');
        wind_speed_kt = table[3].getAttribute('data-knots');

        // summary is icon
        top = doc.getElementsByClassName('forecasts-top')[0].getElementsByClassName('forecast-summary')[0];
        summary = top.getElementsByTagName('img')[0].getAttribute('src').split('/').pop().replace('.png','').replace('-', ' ');;

        let data = {
            name: name,
            temp: temp,
            min: min,
            max: max,
            feel: this.get_feel(temp, humidity),
            humidity: humidity,
            pressure: pressure,
            wind_speed_kmh: wind_speed_kmh,
            wind_speed_kt: wind_speed_kt,
            wind_dir: wind_dir,
            summary: summary,
            rain: rain,
        };

        // check for change
        if (this.observation_data != data){
            this.observation_data = data;
            EventRegister.emit('Weather', 'observation');
        }
    }

    parse_bom_detailed_forecast(html){
        let doc = new DomParser().parseFromString(this.get_html(html),'text/html');
        /*
        // get urls
        right_menu = doc.getElementsByAttribute('class', 'menu')[0].getElementsByTagName('li');
        overview_html = right_menu[0].getElementsByTagName('a')[0].getAttribute('href');
        detailed_forecast_html = right_menu[1].getElementsByTagName('a')[0].getAttribute('href');
        //extended_forecast_html = right_menu[2].getElementsByTagName('a')[0].getAttribute('href');
        //extended_forecast_html = right_menu[3].getElementsByTagName('a')[0].getAttribute('href');

        data = {
            'overview':this.bom_url + overview_html,
            'detailed_forecast': + detailed_forecast_html,
        }

        this.url_data = data;
        */
    }

    parse_bom_overview(html){
        let doc = new DomParser().parseFromString(this.get_html(html),'text/html');

        // get urls
        right_menu = doc.getElementsByClassName('menu')[0].getElementsByTagName('li');
        overview_html = right_menu[0].getElementsByTagName('a')[0].getAttribute('href');
        detailed_forecast_html = right_menu[1].getElementsByTagName('a')[0].getAttribute('href');
        //extended_forecast_html = right_menu[2].getElementsByTagName('a')[0].getAttribute('href');
        //extended_forecast_html = right_menu[3].getElementsByTagName('a')[0].getAttribute('href');

        data = {
            'overview':this.bom_url + overview_html,
            'detailed_forecast': + detailed_forecast_html,
        }

        this.url_data = data;

        // get current observations
        this.parse_bom_observation(html);

        // get the week forecast
        this.parse_bom_forecast(html);
    }


    parse_bom_forecast(html){
        let doc = new DomParser().parseFromString(this.get_html(html),'text/html');

        // remove first day
        days = doc.getElementsByClassName('forecast-summary');

        date_counter = 1;
        var today = new Date();
        new_forecast_data = [];

        for (var i=1; i < days.length; i++){
            var day = days[i];

            name = day.getElementsByClassName('date')[0].getElementsByTagName('a')[0].textContent.trim().split(' ')[0];
            name = this.day_dict[name];
            summary = day.getElementsByClassName('image')[0].getElementsByTagName('img')[0].getAttribute('src').split('/').pop().replace('.png','').replace('-', ' ');
            min = day.getElementsByClassName('min')[1].textContent.split(' ')[0];
            max = day.getElementsByClassName('max')[0].textContent.split(' ')[0];
            rain = day.getElementsByClassName('amt')[0].textContent.split(' ')[0];
            rain_chance = day.getElementsByClassName('pop')[0].textContent.split(' ')[0].replace('%', '');
            //description = day.querySelect('p')[0].firstChild.data;

            var d = new Date();
            d.setDate(today.getDate() + date_counter);
            date = d;
            date_counter++;

            let data = {
                name: name,
                max: max,
                min: min,
                summary: summary,
                rain: rain,
                rain_chance: rain_chance,
                //description: description,
                date: date,
            };

            console.log(data);

            new_forecast_data.push(data);
        }

        // check for change
        if (this.forecast_data != new_forecast_data){
            this.forecast_data = new_forecast_data;
            EventRegister.emit('Weather', 'forecast');
        }
    }


    // write cache
    _storeData = async () => {
        try {
            await AsyncStorage.setItem('@Weather:forecast', JSON.stringify(this.forecast_data));
            await AsyncStorage.setItem('@Weather:observation', JSON.stringify(this.observation_data));
            await AsyncStorage.setItem('@Weather:detailed_forecast', JSON.stringify(this.detailed_forecast_data));
            await AsyncStorage.setItem('@Weather:today_forecast', JSON.stringify(this.today_forecast_data));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    }

    // read cache
    _retrieveData = async () => {
        try {
            const forecast = await AsyncStorage.getItem('@Weather:forecast');
            const observation = await AsyncStorage.getItem('@Weather:observation');
            const detailed_forecast = await AsyncStorage.getItem('@Weather:detailed_forecast');
            const today_forecast = await AsyncStorage.getItem('@Weather:today_forecast');

            if (forecast !== null) {
                this.forecast_data = JSON.parse(forecast);
            }
            if (observation !== null){
               this.observation_data = JSON.parse(observation);
            }
            if (detailed_forecast !== null){
                this.detailed_forecast_data = JSON.parse(detailed_forecast);
            }    
            if (today_forecast !== null){
                this.today_forecast_data = JSON.parse(today_forecast);
            }
            
            // update today forecast
            var today = new Date();
            for (var i=0; i<this.forecast_data.length; i++){
                date = new Date(this.forecast_data[i].date);
                if (date == today){
                    this.today_forecast_data = data;
                    break;
                }
            }

        } catch (error) {
            console.log('Read Error: ');
            console.log(error);
        }
    }

}

// new = singleton
export default new Weather();