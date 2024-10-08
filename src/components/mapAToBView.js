import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {View,StyleSheet,Text} from "react-native";
import {ErrorText, ErrorView, SurfaceArea, TitleMap, XIcon} from "../styles/styles";
import MapViewDirections from "react-native-maps-directions";
import Geocoding from 'react-native-geocoding';
import {useTranslation} from "react-i18next";
import math from "lodash";
import A2BNextIcon from "./next_icon";

Geocoding.init('AIzaSyDqWRPH5ocus24BKGXLNnryvXbPTx7w9Bc');


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

const MapAToBViewScreen = ({title , startPoint, endPoint, setValue, startAddress, endAddress, navigation}) => {
    const { t } = useTranslation();
    const [duration, setDuration] = useState(null);
    const [distance, setDistance] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);

    console.log(title,'  console.log(title)')
    console.log(startPoint,'startPoint')
    console.log(endPoint,'endPoint')
    console.log(setValue,'setValue')
    console.log(startAddress,'startAddress')
    console.log(endAddress,'endAddress')


    useEffect(() => {
        const fetchAddressesAndDirections = async () => {
            try {
                const bounds = {
                    latitude: (startPoint.latitude + endPoint.latitude) / 2,
                    longitude: (startPoint.longitude + endPoint.longitude) / 2,
                    latitudeDelta: Math.abs(startPoint.latitude - endPoint.latitude) * 1.55,
                    longitudeDelta: Math.abs(startPoint.longitude - endPoint.longitude) * 1.55,
                };

                setMapRegion(bounds);

            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddressesAndDirections();
    }, [startPoint, endPoint]);

    const cordinatesFrom = {
        latitude: startPoint.latitude,
        longitude: startPoint.longitude,
    };

    const cordinatesTo = {
        latitude: endPoint.latitude,
        longitude: endPoint.longitude,
    };

    return (
        <View style={styles.container}>

            <View style={{zIndex:2, flex:0.5, position:'absolute', backgroundColor: '#F2F3F4', top:0, left:0, width:'100%', paddingLeft:4, paddingTop:5}}>
                <TitleMap>{t(title)}</TitleMap>

                {  distance !==  'error'  && distance !==  null &&
                    <SurfaceArea style={{paddingBottom:10}}>
                        {/*<Text style={{fontSize:16}}>{startAddress}</Text>*/}
                        {/*<Text style={{fontSize:16}}>{endAddress}</Text>*/}
                        <Text style={{fontSize:18}}>{t('duration')}: {duration < 60 ? `${Math.floor(duration)} ${t('minutes')}` : `${Math.floor(duration / 60)} ${t('hours')}`}
                        </Text>
                        <Text style={{fontSize:18}}>{t('distance')}: {math.floor(distance)} {t('km')}</Text>
                    </SurfaceArea>
                }


            </View>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={mapRegion}
            >
                <Marker coordinate={cordinatesFrom}>
                </Marker>
                <Marker coordinate={cordinatesTo}>
                </Marker>
                <MapViewDirections
                    origin={cordinatesFrom}
                    destination={cordinatesTo}
                    apikey='AIzaSyDqWRPH5ocus24BKGXLNnryvXbPTx7w9Bc'
                    strokeWidth={4}
                    strokeColor='#FF5A5F'
                    onReady={(result) => {
                        console.log(result.duration,'distance')
                        console.log(result.duration,'distance')
                        console.log(result.distance,'distance')
                        setDuration(result.duration);
                        setDistance(result.distance);
                        setValue('distance',result.distance.toString());
                        setValue('duration',result.duration.toString());
                    }}
                    onError={()=> setDistance('error')}
                />

            </MapView>
            {/*{ distance ===  'error'  && <ErrorView style={{position:'absolute', bottom:160, zIndex:1000}}>*/}
            {/*    <ErrorText>{t('set_valid_locations')}</ErrorText>*/}
            {/*</ErrorView>}*/}

            <View style={{position:'absolute', bottom:160, right:0}} >
                <A2BNextIcon onPress={() => navigation.navigate("Calendar")}/>
            </View>
        </View>
    );
};

export default MapAToBViewScreen;
