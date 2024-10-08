import * as React from 'react';
import { Button } from 'react-native-paper';
import {BtnTextAuth, ContainerMid, LgnText, Logo, RedBtn, Title} from "../../styles/styles";
import { useTranslation } from 'react-i18next';
import {BackHandler} from "react-native";
import {useEffect} from "react";
export default function AuthScreen({ navigation }) {
    const { t } = useTranslation();
    // useEffect(() => {
    //     const backAction = () => {
    //         navigation.navigate('HomeScreen');
    //         return true;
    //     };
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    //
    //     return () => backHandler.remove();
    // }, [navigation]);


    return (
        <ContainerMid>
            <Logo source={require("../../../assets/img/logos.png")}/>
            {/*<Title>{t('sample_text')}</Title>*/}
            <RedBtn buttonColor='#FF5A5F' mode="contained" onPress={() => navigation.navigate('Register_login', { screenMode: 'Register' })}>
                <BtnTextAuth>{t('register')}</BtnTextAuth>
            </RedBtn>
                <Button  mode="text" rippleColor='transparent'  textColor='#FF5A5F' onPress={() => navigation.navigate('Register_login',{ screenMode : 'Login' })}>
                    <LgnText>{t('login')}</LgnText>
                </Button>
        </ContainerMid>
    );
}



