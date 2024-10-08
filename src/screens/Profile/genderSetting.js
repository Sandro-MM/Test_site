import React, {useState} from 'react';
import {
    Container,
    SettingsVal,
    Title
} from "../../styles/styles";
import {Divider, Icon} from "react-native-paper";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {TouchableHighlight, View} from "react-native";
import {useTranslation} from "react-i18next";


const GenderSetting = (props) => {
    const { PutApi } = useApiService();

    const { t } = useTranslation();
    const setGenders = props.route.params.setGenders
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, alignItems:'center'};



    const  changeGender = async (id) => {
        const Value =
            {
                Gender: id
            }
        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setGenders(id)
            props.navigation.goBack()
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <Container style={{marginTop:-300}}>
            <Title>{t('change_gender')}</Title>
            <TouchableHighlight
                onPress={() =>  changeGender(1)}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal>{t('male')}</SettingsVal>
                    <Icon size={35} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>

            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() =>  changeGender(2)}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal>{t('female')}</SettingsVal>
                    <Icon size={35} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() =>  changeGender(3)}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal>{t('other')}</SettingsVal>
                    <Icon size={35} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
        </Container>
    );
};

export default GenderSetting;
