import React, {useState} from 'react';
import {
    SettingsVal, Subtitle, Title,
} from "../../styles/styles";
import {Divider, Icon, IconButton} from "react-native-paper";
import {ScrollView, TouchableHighlight, View} from "react-native";
import { Linking } from 'react-native';
import DeleteConfirmationModal from "../../components/modal";
import useApiService, {accEndpoints, getAccessToken, headersText,} from "../../services/api";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";

const SettingsPage = (props) => {
    const { DelApi } = useApiService();
    const { PostApi } = useApiService();
    const { t } = useTranslation();
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, alignItems:'center'};
    const userData = props.route.params.userData;
    const [isDelModalVisible, setDelModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(() => null);

    const showDelModal = (messege, action) => {
        setModalMessage(messege)
        setConfirmAction(() => action)
        setDelModalVisible(true);
    }
    const hideDelModal = () => setDelModalVisible(false);

    const openBrowser = (url) => {
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }
    const logOut = async () => {
        try {

            const accessToken = await getAccessToken();
            const fetchedData = await PostApi(accEndpoints.post.Logout,null ,{
                headers: {
                    ...headersText.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const delToken = await SecureStore.deleteItemAsync('accessToken');
            props.navigation.navigate('HomeScreen')

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const deleteAcc = async () => {
        try {
            const accessToken = await getAccessToken();
            const fetchedData = await DelApi(accEndpoints.delete.UserDel,null ,{
                headers: {
                    ...headersText.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const delToken = await SecureStore.deleteItemAsync('accessToken');
            props.navigation.navigate('HomeScreen')
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const settings = {
        Notification:{
            title: 'notification_email_sms',
            nav: 'NotificationEmailSms'
        },
        Password:{
            title: 'change_password',
            nav: 'PasswordSettingInput'
        },
        Language:{
            title: 'change_language',
            nav: 'LanguageSetting'
        },
    };
    const info = {
        Help:{
            title: 'help',
            url:'https://www.a2b.ge/en/help'
        }
        ,
        Terms:{
            title: 'terms_and_conditions',
            url:'https://www.a2b.ge/en/terms-and-conditions'
        },
        Data:
            {
                title:'data_protection',
                url:'https://www.a2b.ge/en/privacy-policy'
            },
        licenses: {
            title:
                'licenses',
            url:'https://www.a2b.ge/en/licenses'
        },
    };


    const openSettingInput = (key) => {
        props.navigation.navigate('ProfileSettings', {userData:userData});
    };



    return (
        <ScrollView contentContainerStyle={{justifyContent:'flex-start', paddingTop:40}}>
            <IconButton
                rippleColor="rgba(128, 128, 128, 0.2)"
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}
                icon='close'
                iconColor='#1B1B1B'
                size={28}
                onPress={() => props.navigation.navigate('Profile',{ IsUserOrder: 1, navigation: props.navigation })}
            />

            <Title style={{marginBottom:-40, marginTop:-50}}>{t('settings')}</Title>
            <TouchableHighlight
                onPress={() => openSettingInput()}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal>{t('edit_profile')}</SettingsVal>
                    <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <TouchableHighlight   underlayColor='rgba(128, 128, 128, 0.5)'   onPress={() => {
                props.navigation.navigate('Vehicles', { carData: userData.UserCarReponseModels, firstName:null, navigation:props.navigation});
            }}>
                <View style={viewStyle}>
                    <SettingsVal>{t('vehicles')}</SettingsVal>
                    <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>

            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() => props.navigation.navigate('RatingsSetting')}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal>{t('ratings')}</SettingsVal>
                    <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            {Object.keys(settings).map((key, index) => (
                <TouchableHighlight
                    key={index}
                    onPress={() => props.navigation.navigate(settings[key].nav)}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={viewStyle}>
                        <SettingsVal>{t(settings[key].title)}</SettingsVal>
                        <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                    </View>
                </TouchableHighlight>
            ))}
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            {Object.keys(info).map((key, index) => (
                <TouchableHighlight
                    key={index}
                    onPress={() => openBrowser(info[key].url)}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={viewStyle}>
                        <SettingsVal>{t(info[key].title)}</SettingsVal>
                        <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                    </View>
                </TouchableHighlight>
            ))}
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() => showDelModal('are_you_sure_you_want_to_log_out', () => logOut())}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal style={{color:'#FF5A5F'}}>{t('log_out')}</SettingsVal>
                    <Icon size={30} color={'gray'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() => showDelModal('are_you_sure_you_want_to_deactivate_your_account', () => deleteAcc())}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal style={{color:'#FF5A5F'}}>{t('deactivate_account')}</SettingsVal>
                    <Icon size={30} color={'gray'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>

            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <DeleteConfirmationModal
                isVisible={isDelModalVisible}
                onCancel={hideDelModal}
                confirmButton={{
                    title: 'confirm',
                    onPress: async () => {
                        hideDelModal();
                        await confirmAction();
                    },
                    color: 'red',
                }}
                cancelButton={{
                    title: 'cancel',
                    onPress: hideDelModal,
                    color: 'blue',
                }}
            >
                <Subtitle>{t(modalMessage)}</Subtitle>
            </DeleteConfirmationModal>
        </ScrollView>
    );
};

export default SettingsPage;
