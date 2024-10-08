import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {View,StyleSheet,Text} from "react-native";

import MapViewDirections from "react-native-maps-directions";
import Geocoding from 'react-native-geocoding';
import {useTranslation} from "react-i18next";
import {SmallBtnText, SmallRedBtn, SurfaceArea, TitleMap} from "../../styles/styles";
import * as SecureStore from "expo-secure-store";
import useApiService, {getAccessToken, headersTextToken, OrderEndpoints} from "../../services/api";

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

const MapAToBViewEditScreen = ({route}) => {

    const { GetApi } = useApiService();

    const { title , startPoint, endPoint, setValue, startAddress, endAddress, handleSubmit, initPrice } = route.params;
    const { t } = useTranslation();
    const [duration, setDuration] = useState(null);
    const [distance, setDistance] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);
    const [newPrice, setNewPrice] = useState(null);
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

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const language = await SecureStore.getItemAsync('userLanguage');
                const accessToken = await getAccessToken();
                const responseData = await GetApi(`${OrderEndpoints.get.maxPrice}?orderDistance=${(distance || 100)}&`, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setNewPrice(responseData);
                if (responseData.MaxPrice < initPrice){
                    setValue('NewMaxPrice', responseData.MaxPrice)
                }

                console.log(responseData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchPrice();
    }, [distance]);

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
                    <TitleMap>{title}</TitleMap>
                    <SurfaceArea>
                        <Text>{startAddress}</Text>
                        <Text>{endAddress}</Text>
                        <Text>{t('duration')}: {duration}</Text>
                        <Text>{t('distance')}: {distance}</Text>
                    </SurfaceArea>

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
                            setDuration(result.duration);
                            setDistance(result.distance);
                            setValue('distance',result.distance.toString());
                            setValue('duration',result.duration.toString());
                        }}
                    />
                </MapView>
                <SmallRedBtn style={{bottom:-230}} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit}>
                    <SmallBtnText>{t('save')}</SmallBtnText>
                </SmallRedBtn>
            </View>
    );
};

export default MapAToBViewEditScreen;
