import React, {useRef, useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {View, StyleSheet, Text} from "react-native";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Icon, } from "react-native-paper";
import {useDebouncedCallback} from "use-debounce";
import {useTranslation} from "react-i18next";
import {SurfaceArea, TitleMap} from "../../styles/styles";
import MapMagnifyAnimation from "../../components/mapMagnifyAnimation";
import A2BNextIcon from "../../components/next_icon";




const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex:1,
        flex:1,
        height:900,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 48,
        width: 48
    },
});

const EditMapViewScreen = ({route}) => {
    const {title, handleMapChoose, setValue, valueName, initPrice} = route.params;
    const { t } = useTranslation();
    const [addressValue, setAddressValue] = useState('');
    const [visible, setVisible] = useState(false);
    const mapRef = useRef(null);
    const autoCompleteRef = useRef(null);

    const [region, setRegion] = useState({
        latitude: 42.20402927792062,
        longitude:  43.379308227449656,
        latitudeDelta: 5.9,
        longitudeDelta: 5.9,
    });

    const debouncedMoveMarker = useDebouncedCallback((lat, lng) => {
        console.log(1)
        moveMarker(lat, lng);
    }, 600);

    const onRegionChange = newRegion => {
        console.log(newRegion);
        setRegion(newRegion);

        if (region.latitude !== newRegion.latitude || region.longitude !== newRegion.longitude){
            setRegion(newRegion);
            debouncedMoveMarker(newRegion.latitude, newRegion.longitude);
        }
    };

    async function moveMarker(lat, lng) {
        try {
            const address = await reverseGeocode(lat, lng);
            console.log(address,'address')
            setAddressValue(address);
            autoCompleteRef.current.setAddressText('')
            setVisible(true)
        } catch (error) {
            console.error('Error moving marker:', error);
        }
    }

    async function moveMarkerAnimate(lat, lng) {
        try {
            mapRef.current.animateToRegion(
                {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.02,
                },
                1000
            );
            await moveMarker(lat, lng)
        } catch (error) {
            console.error('Error moving marker:', error);
        }
    }

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const link = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDqWRPH5ocus24BKGXLNnryvXbPTx7w9Bc`
            const response = await fetch(link);
            const responseRu = await fetch(link+'&language=ru');
            const responseKa = await fetch(link+'&language=ka');
            const data = await response.json();
            const dataRu = await responseRu.json();
            const dataKa = await responseKa.json();
            if (data.status === 'OK' && data.results.length > 0) {
                setValue(valueName, data.results[0])
                setValue(valueName+'Ru', dataRu.results[0])
                setValue(valueName+'Ka', dataKa.results[0])
                return data.results[0].formatted_address;
            } else {
                return 'Address not found';
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Address not found';
        }
    };
    const handleMapPress = event => {
        const { coordinate } = event.nativeEvent;
        moveMarker(coordinate.latitude, coordinate.longitude);
    };


    const focusInput = () => {
        autoCompleteRef.current.blur();
        autoCompleteRef.current.focus();
    };

    const mapOptions = {
        visibleCountry: 'GE'
    }
    return (

            <View style={styles.container}>
                <View style={{zIndex:2, flex:0.5, position:'absolute', backgroundColor: '#F2F3F4', top:0, left:0, width:'100%', paddingLeft:4, paddingTop:5}}>
                    <TitleMap>{t(title)}</TitleMap>
                    <SurfaceArea>
                        <GooglePlacesAutocomplete
                            ref={autoCompleteRef}
                            enablePoweredByContainer={false}
                            onChangeText={text => setAddressValue(text)}
                            minLength={2}
                            fetchDetails={true}
                            debounce={700}
                            renderRow={rowData => {
                                return (
                                    <View>
                                        <Text style={{fontSize:18 , lineHeight:22, marginBottom:2}}>{rowData.structured_formatting.main_text}</Text>
                                        <Text style={{fontSize:14, fontWeight:'400', marginLeft:4, color:'#808080'}} >{rowData.structured_formatting.secondary_text}</Text>
                                    </View>
                                )
                            }}
                            minLengthAutocomplete={3}
                            placeholder={addressValue || 'search'}
                            onPress={(data, details = null) => {
                                moveMarkerAnimate(details.geometry.location.lat, details.geometry.location.lng)
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
                    </SurfaceArea>

                </View>
                <MapView

                    ref={mapRef}
                    mapOptions={mapOptions}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={region}
                    onRegionChangeComplete={onRegionChange}
                >
                </MapView>
                <MapMagnifyAnimation  focusInput={focusInput}/>
                <View style={styles.markerFixed}>
                    <Icon
                        source="map-marker"
                        color='#FF5A5F'
                        size={44}
                    />
                </View>
                <View style={{position:'absolute', bottom:160, right:0}}>
                    { visible &&
                        <A2BNextIcon onPress={() => handleMapChoose(mapRef.current.props.initialRegion)}/>
                    }

                </View>
            </View>
    );
};

export default EditMapViewScreen;
