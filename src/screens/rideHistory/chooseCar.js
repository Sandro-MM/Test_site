import React, {useEffect, useState} from 'react';
import {Divider, IconButton} from "react-native-paper";
import {Container, Title} from "../../styles/styles";
import useApiService, { CarEndpoints, getAccessToken, headersTextToken } from "../../services/api";
import {Text, TouchableHighlight, View} from "react-native";
import {vehicleTypeMappingByName} from "../../styles/vehicleMappings";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";

const ChooseCar = ({ route }) => {
    const { GetApi } = useApiService();
    const { handleCarChoose } = route.params;
    const { navigation } = route.params;
    const viewStyle = { height: 65};
    const iconStyle = { marginRight: -20, position: 'absolute', marginTop: 15 };

    const [responseData, setResponseData] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const language = await SecureStore.getItemAsync('userLanguage');
                const accessToken = await getAccessToken();
                const response = await GetApi(CarEndpoints.get.Cars, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setResponseData(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const onSelectItem = (carId) => {
        handleCarChoose({CarId:carId});
        navigation.goBack()
    };

    const TypeIcon = ({ id }) => (
        <IconButton
            style={iconStyle}
            color='#1B1B1B'
            size={30}
            icon={vehicleTypeMappingByName[id] || 'car-side'}
        />
    );

    return (
        <Container style={{marginTop:-140}}>
            <IconButton
                style={{ position: 'absolute', top: 160, left: 0, zIndex: 3 }}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title>{t('choose_your_car')}</Title>

            {responseData.map(car => (
                <TouchableHighlight
                    style={{marginVertical:5 }}
                    key={car.Id}
                    underlayColor="rgba(128, 128, 128, 0.2)"
                    onPress={() => onSelectItem(car.Id)}
                >

                    <View
                        style={viewStyle}
                    >
                        <TypeIcon id={car.CarType} />
                        <Text style={{ marginLeft: 55, marginTop: 15, fontSize: 17 }}>{car.Manufacturer} {car.Model} </Text>
                        <Text style={{ marginLeft: 55 }}>Color: {car.Color}</Text>
                        <Divider style={{ width: '90%', marginTop: 15 }} horizontalInset={true} bold={true} />
                    </View>

                </TouchableHighlight>
            ))}
        </Container>
    );
};

export default ChooseCar;
