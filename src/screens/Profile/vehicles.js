import React, {useState} from 'react';
import { View, PanResponder} from 'react-native';
import {
    AboutMe, ConfirmRedBtn,
    ContainerMid, ProfileName, SmallConfirmText, Subtitle,
    SurfaceVehicle, TextRight, Title, VehicleColor,
    VehicleFuel,
    VehicleInfo, VehicleName,
    VehiclePic, VehicleSubtitle, VehicleSubtitleContainer
} from '../../styles/styles';
import {Icon, IconButton, Surface} from "react-native-paper";
import useApiService, { CarEndpoints, getAccessToken, headersTextToken} from "../../services/api";
import DeleteConfirmationModal from "../../components/modal";
import {colorMapping, fuelTypeMapping, vehicleTypeMapping} from "../../styles/vehicleMappings";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";

export default function Vehicles(props) {

    const { DelApi } = useApiService();

    const { t } = useTranslation();
    const { carData } = props.route.params;
    const { firstName } = props.route.params;
    const { navigation } = props.route.params;

    const [isModalVisible, setModalVisible] = useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);
    const deleteButtonPress = () => {
        showModal();
    };
    const [currentIndex, setCurrentIndex] = useState(0);
    const panResponder = React.useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) => {
                    const { dx } = gestureState;
                    return Math.abs(dx) > 50;
                },
                onPanResponderRelease: (_, gestureState) => {
                    const { dx } = gestureState;
                    if (dx > 50 && currentIndex > 0) {
                        handleSwipe('left');
                    } else if (dx < -50 && currentIndex < carData.length - 1) {
                        handleSwipe('right');
                    }
                },
            }),
        [currentIndex, carData]
    );
    const handleSwipe = (direction) => {
        direction === 'left' ? handleBack() : handleNext();
    };
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < carData.length - 1 ? prevIndex + 1 : prevIndex));
    };
    const handleBack = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };
    const deleteVehicle = async (id) => {
        console.log(id)
        try {
            const accessToken = await getAccessToken();
            const responseData = await DelApi(CarEndpoints.delete.Car, {
                headers: {
                    ...headersTextToken.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            }, id);

            if (responseData.AccessToken){
                try {
                    await SecureStore.setItemAsync('accessToken', responseData.AccessToken);
                } catch (error) {
                    console.error('Error saving tokens:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <View {...panResponder.panHandlers} style={{ flex: 1 }}>
            <ContainerMid>
                {
                    !carData || carData.length === 0 ? (
                        <Surface style={{alignItems:'center', paddingBottom:30,borderRadius:13, backgroundColor:'#F2F3F4'}}>
                            <Title>{t('no_cars_available')}</Title>
                            <Icon
                                source="car"
                                color='#7a7a7a'
                                size={100}
                            />

                            <ConfirmRedBtn
                                style={{marginTop:20}}
                                buttonColor='#FF5A5F'
                                mode="contained"
                                onPress={()=>props.navigation.navigate('AddVehicle',{mode:'addVehicle', navigation:navigation})}>
                                <SmallConfirmText>{t('add_car')}</SmallConfirmText>
                            </ConfirmRedBtn>
                        </Surface>
                    ) : null
                }
                {carData.map((item, index) => (
                    <ContainerMid
                        key={item.Id}
                        style={{ width: '100%', height:'100%', display: index === currentIndex ? 'flex' : 'none' }}>
                        <VehicleSubtitleContainer>
                            <VehicleSubtitle style={{width:'100%', marginTop:-40}}>{t('vehicles')}</VehicleSubtitle>

                            <View style={{ flexDirection:'row', position:'absolute', right:0}}>
                                {  carData.length<3?
                                    <IconButton
                                        icon="plus-circle"
                                        iconColor='#7a7a7a'
                                        size={22}
                                        onPress={()=>props.navigation.navigate('AddVehicle',{mode:'addVehicle', navigation:navigation})}
                                    />:null}
                                <IconButton
                                    icon="pencil"
                                    iconColor='#7a7a7a'
                                    size={22}
                                    onPress={()=>props.navigation.navigate('AddVehicle',{mode:'editVehicle', item:item,  navigation:navigation})}
                                />
                                { item.IsCarRelateToOrders === false &&
                                    <IconButton
                                        icon="trash-can-outline"
                                        iconColor='#FF5A5F'
                                        size={22}
                                        onPress={deleteButtonPress}
                                    />
                                }

                                <DeleteConfirmationModal
                                    isVisible={isModalVisible}
                                    onCancel={hideModal}
                                    confirmButton={{
                                        title: 'confirm',
                                        onPress: async () => {
                                            hideModal();
                                            await deleteVehicle(item.Id);
                                            props.navigation.navigate('HomeScreen');
                                        },
                                        color: 'red',
                                    }}
                                    cancelButton={{
                                        title: 'cancel',
                                        onPress: hideModal,
                                        color: 'blue',
                                    }}
                                >
                                    <Subtitle>{t('are_you_sure_you_want_to_remove_your_vehicle')}</Subtitle>
                                </DeleteConfirmationModal>
                            </View>
                        </VehicleSubtitleContainer>
                        <IconButton
                            style={{position:'absolute', top:99, left:0}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => props.navigation.goBack()}
                        />

                        <SurfaceVehicle>
                            <VehiclePic
                                source={{
                                    uri: item.CarPictureUrls[0]?.Name,
                                }}
                            />
                            <VehicleInfo>
                                <VehicleName style={{textAlign: 'center', marginTop: -20}}>
                                    {item.Manufacturer.Name} {item.Model?.Name}
                                </VehicleName>
                                <ProfileName> {item.ReleaseDate}</ProfileName>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <VehicleColor> {item.Color?.Name} </VehicleColor>
                                    <Icon
                                        source={'circle'}
                                        color={colorMapping[item.Color.Id] || 'black'}
                                        size={24}
                                    />
                                </View>
                                <TextRight style={{marginTop:30, fontSize: 20}}>{item.PlateNumber}</TextRight>
                                <View style={{ flexDirection: 'row', marginTop: -15 }}>
                                    <VehicleFuel
                                        contentStyle={{ height: 38, justifyContent: 'flex-start' }}
                                        mode="text"
                                    >
                                        <Icon
                                            source={fuelTypeMapping[item.FuelType.Id] || 'gas-station'}
                                            color="#7a7a7a"
                                            size={18}
                                        />
                                        <AboutMe> {item.FuelType?.Name} </AboutMe>
                                    </VehicleFuel>
                                    <VehicleFuel
                                        contentStyle={{ height: 38, justifyContent: 'flex-start' }}
                                        mode="text"
                                    >
                                        <Icon
                                            source={vehicleTypeMapping[item.CarType.Id] || 'car-side'}
                                            color="#7a7a7a"
                                            size={18}
                                        />
                                        <AboutMe> {item.CarType?.Name} </AboutMe>
                                    </VehicleFuel>
                                </View>
                            </VehicleInfo>
                        </SurfaceVehicle>
                    </ContainerMid>
                ))}
            </ContainerMid>
        </View>
    );
};



