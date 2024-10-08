import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import A2bInput from "../../components/formInput";
import {
    ContainerTop,
    ErrorText,
    ErrorView,
    SmallBtnText,
    SmallRedBtn,
    Title,
    XIcon
} from "../../styles/styles";
import {IconButton} from "react-native-paper";
import {Keyboard, View} from "react-native";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import Loading from "../../components/loading";
import * as SecureStore from "expo-secure-store";

const PasswordSettingInput = (props) => {
    const { PutApi } = useApiService();
    const navigation = useNavigation()
    const { t } = useTranslation();
    const { control, handleSubmit} = useForm();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(data) {
        Keyboard.dismiss();
        setError(null);
        try {
            const language = await SecureStore.getItemAsync('userLanguage');
            setLoading(true)
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.ChangePassword, data, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            props.navigation.navigate('Action',{navigation: props.navigation, titleItem:'password_changed'})


        } catch (error) {
            console.error('Error submitting data:', error);
            const errorTitle = error.response.data.title;
            setError(errorTitle);
        } finally {
            setLoading(false)
        }
    }



    return (
        <ContainerTop style={{paddingTop:20}}>
            {
                loading? <Loading/>:

                    <View style={{flex:1, width:'100%', alignItems:'center'}}>
                        <IconButton
                            style={{position:'absolute', top:30, left:5, zIndex:3}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => props.navigation.goBack()}
                        />
                        <Title style={{marginBottom:-20, marginTop:45}}>{t('change_password')}</Title>
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <A2bInput

                                    placeholder={t('old_password')}
                                    value={field.value}
                                    onChangeText={(value) => field.onChange(value)}
                                    variant ='eye'
                                />

                            )}
                            name={'OldPassword'}
                            defaultValue={null}
                        />
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <A2bInput
                                    placeholder={t('enter_new_password')}
                                    value={field.value}
                                    onChangeText={(value) => field.onChange(value)}
                                    variant ='eye'
                                />

                            )}
                            name={'NewPassword'}
                            defaultValue={null}
                        />
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <A2bInput
                                    placeholder={t('confirm_password')}
                                    value={field.value}
                                    onChangeText={(value) => field.onChange(value)}
                                    variant ='eye'
                                />

                            )}
                            name={'NewPasswordConfirm'}
                            defaultValue={null}
                        />
                        <SmallRedBtn style={{position:'absolute', bottom:7}} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}>
                            <SmallBtnText>{t('save')}</SmallBtnText>
                        </SmallRedBtn>

                    </View>
            }
        </ContainerTop>
    );
};

export default PasswordSettingInput;
