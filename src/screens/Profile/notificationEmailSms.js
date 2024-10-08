import React, {useEffect, useState} from 'react';
import {
    Container,
    SettingsVal, SmallBtnText, SmallRedBtn,
    Title,
} from "../../styles/styles";
import {Button, IconButton} from "react-native-paper";
import { Linking, Text, View} from "react-native";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {Switch} from "react-native-switch";
import {useTranslation} from "react-i18next";

const NotificationEmailSms = (props) => {
    const { PutApi } = useApiService();
    const { GetApi } = useApiService();
    const { t } = useTranslation();

    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, alignItems:'center'};
    const [sms, setSms] = useState(false);
    const [email, setEmail] = useState(false);

    useEffect(() => {
        getNotificationStatus()
    }, []);

    async function getNotificationStatus() {
        try {
            const accessToken = await getAccessToken();
            const responseData = await GetApi(accEndpoints.get.NotificationStatus, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setEmail(responseData.Email)
            setSms(responseData.Sms)
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    }

    async function onSubmit() {

        const data= {
            email: email,
            sms : sms
        }

        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.get.NotificationStatus, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (responseData){
                props.navigation.navigate('HomeScreen')
            }

        } catch (error) {
            console.error('Error submitting data:', error);
        }
    }



    return (
        <Container style={{justifyContent:'flex-start'}}>
            <IconButton
                style={{position:'absolute', top:0, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => props.navigation.goBack()}
            />
            <Title>{t('notification_settings')}</Title>
                    <View style={viewStyle}>
                        <SettingsVal>{t('push_notifications')}</SettingsVal>
                        <Button
                            onPress={() =>  Linking.openSettings()}
                        ><Text>{t('open_settings')}</Text></Button>
                    </View>
            <View style={viewStyle}>
                <SettingsVal>{t('email_notification')}</SettingsVal>
                <Switch
                    value={email}
                    onValueChange={()=>setEmail(!email)}
                    disabled={false}
                    activeText={'On'}
                    inActiveText={'Off'}
                    switchLeftPx={2.5}
                    circleSize={25}
                    switchWidthMultiplier={2.1}
                    switchRightPx={2.5}
                    backgroundActive={'#FF5A5F'}
                    backgroundInactive={'gray'}
                    circleActiveColor={'#fff'}
                    circleInActiveColor={'#fff'}
                    changeValueImmediately={true}
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchBorderRadius={30}
                    barHeight={30}
                />
            </View>
            <View style={viewStyle}>
                <SettingsVal>{t('sms_notification')}</SettingsVal>
                <Switch
                    value={sms}
                    onValueChange={()=>setSms(!sms)}
                    disabled={false}
                    activeText={'On'}
                    inActiveText={'Off'}
                    switchLeftPx={2.5}
                    circleSize={25}
                    switchWidthMultiplier={2.1}
                    switchRightPx={2.5}
                    backgroundActive={'#FF5A5F'}
                    backgroundInactive={'gray'}
                    circleActiveColor={'#fff'}
                    circleInActiveColor={'#fff'}
                    changeValueImmediately={true}
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchBorderRadius={30}
                    barHeight={30}
                />
            </View>
            <SmallRedBtn style={{position:'absolute', bottom:50, left:'25%'}} buttonColor='#FF5A5F' mode='contained' onPress={onSubmit}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>
        </Container>
    );
};

export default  NotificationEmailSms;
