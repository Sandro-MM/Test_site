import * as React from 'react';
import {BackHandler} from 'react-native';
import {ContainerMid, Logo, SmallBtnText, SmallRedBtn, TitleLeft} from "../../styles/styles";
import {useEffect} from "react";
import {Icon} from "react-native-paper";
import {useTranslation} from "react-i18next";

export default function Confirm_Price_change({ navigation }) {
    const { t } = useTranslation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('AuthScreen');
                return true;
            }
        );
        return () => backHandler.remove();
    }, [navigation]);
    return (
        <ContainerMid>
            <Logo source={require("../../../assets/img/logos.png")} />
            <TitleLeft style={{textAlign:'center'}}>{t('your_price_was_changed_accordingly')}</TitleLeft>
            <Icon
                source="checkbox-marked-circle-outline"
                color='#FF5A5F'
                size={100}
            />
            <SmallRedBtn style={{bottom:-230}} buttonColor='#FF5A5F' mode='contained' onPress={()=>navigation.goBack()}>
                <SmallBtnText>{t('ok')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerMid>
    );
}
