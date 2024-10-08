import React, {useEffect} from 'react';
import {BtnTextAuth, ContainerTop, RedBtn, Title} from "../../styles/styles";
import {Icon} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {BackHandler} from "react-native";

export const RideAddedSucsess = ({ navigation }) => {
    useEffect(() => {
        const backAction = () => {
            navigation.navigate('HomeScreen');
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);
    const { t } = useTranslation();

    return (
        <ContainerTop style={{paddingTop:120}}>
            <Title> {t('your_ride_is_created')}</Title>
            <Icon
                source="checkbox-marked-circle-outline"
                color='#7a7a7a'
                size={100}
            />
            <RedBtn
                style={{position:'absolute', bottom:70, width:90}}
                buttonColor='#FF5A5F'
                mode="contained"
                onPress={() => navigation.navigate('RideHistory')}
            >
                <BtnTextAuth>{t('ok')}</BtnTextAuth>
            </RedBtn>
        </ContainerTop>
    );
};


