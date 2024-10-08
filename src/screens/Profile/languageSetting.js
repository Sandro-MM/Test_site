import React from 'react';
import {Container, SettingsVal, Title} from "../../styles/styles";
import {TouchableHighlight, View} from "react-native";
import {Icon} from "react-native-paper";
import useApiService, {accEndpoints, getAccessToken, headersText} from "../../services/api";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import {changeLanguage} from "i18next";


const LanguageSetting = (props) => {
    const { GetApi } = useApiService();
    const { t } = useTranslation();
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, alignItems:'center'};
    const ChangeLang = async (id) => {

        if (id == 1){
            changeLanguage('en')
            await SecureStore.setItemAsync('userLanguage', 'en');

        } else if (id == 2){
            changeLanguage('ka')
            await SecureStore.setItemAsync('userLanguage', 'ka');
        } else if (id == 3){
            changeLanguage('ru')
            await SecureStore.setItemAsync('userLanguage', 'ru');
        }

        props.navigation.navigate('HomeScreen')

        try {
            const language = await SecureStore.getItemAsync('userLanguage');
            const accessToken = await getAccessToken();
            const fetchedData = await GetApi(`${accEndpoints.get.ChangeLang}${id}`,{
                headers: {
                    ...headersText.headers,
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }



    const languges = [
        {
            language:'english',
            id:'1'
        },
        {
            language:'georgian',
            id:'2'
        },
        {
            language:'russian',
            id:'3'
        },
    ]
    return (
       <Container style={{marginTop:-400}}>
           <Title style={{marginBottom:-30, marginTop:-80}}>{t('change_language')}</Title>
           {languges.map((language, index) => (
               <TouchableHighlight
                   key={index}
                   onPress={() => ChangeLang(language.id)}
                   underlayColor='rgba(128, 128, 128, 0.5)'
               >
                   <View style={viewStyle}>
                       <SettingsVal>{t(language.language)}</SettingsVal>
                       <Icon size={35} color={'#FF5A5F'} source={'chevron-right'}/>
                   </View>
               </TouchableHighlight>
           ))}
       </Container>
    );
};

export default LanguageSetting;
