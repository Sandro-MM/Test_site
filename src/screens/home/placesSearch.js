
import * as React from "react";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {View, Text, Keyboard} from "react-native";
import {useEffect, useRef, useState} from "react";
import {Icon, IconButton} from "react-native-paper";
import keyboard from "react-native-web/src/exports/Keyboard";
import {useTranslation} from "react-i18next";



export default function PlacesSearch({navigation, setValue , type ,handleNavigation}) {

    const { t } = useTranslation();
    const [addressValue, setAddressValue] = useState('');
    const autoCompleteRef = useRef(null);

    useEffect(() => {
        if (autoCompleteRef.current) {
            setTimeout(() => {
                autoCompleteRef.current.focus();
            }, 100);
        }
    }, []);

    return (
        <View style={{marginTop:30, flex:1, width:'100%'}}>
            <GooglePlacesAutocomplete
                ref={autoCompleteRef}
                onPress={(data, details = null) => {
                    setValue(type, data.structured_formatting.main_text);
                    setValue(`${type}Latitude`, details.geometry.location.lat);
                    setValue(`${type}Longitude`, details.geometry.location.lng);
                    handleNavigation();
                }}
                enablePoweredByContainer={false}
                onChangeText={text => setAddressValue(text)}
                minLength={2}
                fetchDetails={true}
                renderRow={rowData => {
                    return (
                        <View style={{flex:1}}>
                            <IconButton style={{position:'absolute', right:-18, marginHorizontal:0, paddingHorizontal:0, top:-5}} size={30} iconColor={'#FF5A5F'} icon={'chevron-right'}/>
                            <View style={{minWidth:300,width:'77%', overflow:'hidden'}}>
                                <Text style={{fontSize:18 , lineHeight:22, marginBottom:2, width:250}}>{rowData.structured_formatting.main_text}</Text>
                                <Text style={{fontSize:14, fontWeight:'400', marginLeft:4, color:'#808080'}} >{rowData.structured_formatting.secondary_text}</Text>
                            </View>
                        </View>
                    )
                }}
                debounce={700}
                minLengthAutocomplete={3}
                placeholder={addressValue || t('search')}
                styles={{
                    textInputContainer: {
                        width: '85%',
                        marginHorizontal:'7.5%'
                    },
                    textInput: {
                        backgroundColor: '#D8D9DA',
                        height: 50,
                        borderRadius: 14,
                        paddingLeft:18,
                        marginBottom: 20,
                    },
                    row: {

                        width: "100%",
                        marginVertical:5,
                        minHeight:65,
                        paddingLeft: 30,
                        backgroundColor:'transparent'
                    },
                    description:{
                        lineHeight:23,
                        color: '#1B1B1B',
                        fontSize: 20,
                        fontWeight: 400
                    },
                    listView:{
                        width:'100%',

                    }
                }}
                query={{
                    key: 'AIzaSyDqWRPH5ocus24BKGXLNnryvXbPTx7w9Bc',
                    language: 'en',
                    components: 'country:GE',
                    bounds: {
                        southWest: { lat: 41.55, lng: 41.3 },
                        northEast: { lat: 42.15, lng: 43.8 },
                    }
                }}
            />
            <IconButton
                style={{position:'absolute',top:'0', right:'8%'}}
                icon='close'
                onPress={()=>autoCompleteRef.current.setAddressText('')}
            />
        </View>
    );
}
