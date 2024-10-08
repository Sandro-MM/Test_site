import React from 'react';
import {BtnTextAuth, ContainerTop, RedBtn, Title} from "../../styles/styles";
import {Icon} from "react-native-paper";
import {useTranslation} from "react-i18next";

export const Action = ({ route }) => {
    const { t } = useTranslation();
    const { titleItem } = route.params;
    const { navigation } = route.params;

    return (
        <ContainerTop style={{paddingTop:120, alignItems:'center'}}>
            <Title>{t(titleItem)}</Title>
            <Icon
                source="checkbox-marked-circle-outline"
                color='#7a7a7a'
                size={100}
            />
            <RedBtn
                style={{position:'absolute', bottom:70, width:90}}
                buttonColor='#FF5A5F'
                mode="contained"
                onPress={() => navigation.navigate('HomeScreen')}
            >
                <BtnTextAuth>{t('ok')}</BtnTextAuth>
            </RedBtn>
        </ContainerTop>
    );
};


