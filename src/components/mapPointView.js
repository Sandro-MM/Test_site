import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {View,StyleSheet,Text} from "react-native";
import {SurfaceArea,TitleMap} from "../styles/styles";
import Geocoding from 'react-native-geocoding';
import {useTranslation} from "react-i18next";

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

const MapPointViewScreen = ({route}) => {
    const { t } = useTranslation();
    const { title } = route.params;
    const { startPoint } = route.params;
    const { startAddress } = route.params;

    const [mapRegion, setMapRegion] = useState(null);

    const cordinatesFrom = {
        latitude: startPoint.latitude,
        longitude: startPoint.longitude,
    };
    useEffect(() => {
        const setRegion = async () => {

            try {
        const bounds = {
            latitude: (startPoint.latitude),
            longitude: (startPoint.longitude),
            latitudeDelta: Math.abs(startPoint.latitude) * 0.0003,
            longitudeDelta: Math.abs(startPoint.longitude) * 0.0003,
        }
                setMapRegion(bounds);
        } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        }
        setRegion()

    }, [startPoint]);

    return (

            <View style={styles.container}>

                <View style={{zIndex:2, flex:0.5, position:'absolute', backgroundColor: '#F2F3F4', top:0, left:0, width:'100%', paddingLeft:4, paddingTop:5}}>
                    <TitleMap style={{textAlign:'center'}}>{title}</TitleMap>
                    <SurfaceArea style={{paddingTop:5, paddingBottom:5}}>
                        <Text style={{fontSize:16}}>{t(startAddress)}</Text>
                    </SurfaceArea>

                </View>
                { mapRegion !== null &&
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={mapRegion}
                >
                    <Marker coordinate={cordinatesFrom}>
                    </Marker>
                </MapView>
                }
            </View>
    );
};

export default MapPointViewScreen;
