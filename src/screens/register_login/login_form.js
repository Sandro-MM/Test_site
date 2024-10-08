import {ActivityIndicator, Keyboard} from 'react-native';
import * as React from 'react';
import {Controller, useForm} from "react-hook-form";
import useApiService, {accEndpoints, connectSignalR} from "../../services/api";
import {useState} from "react";
import * as SecureStore from 'expo-secure-store';
import {
    LinkLogin,
    SmallRedBtn,
    Title,
    SmallBtnText, ContainerTop,
} from "../../styles/styles";
import A2bInput from "../../components/formInput";
import {useTranslation} from "react-i18next";

export default function LoginForm(props) {
    const { PostApi } = useApiService();
    const {Connect} = connectSignalR()

    const { t } = useTranslation();
    const { control, handleSubmit, setValue, watch, reset } = useForm({
        // defaultValues: {
        //     LoginByMobile: true
        // }
    });
    const isButtonDisabled = !(watch('UserName') && watch('Password'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);



    const onSubmit = async (data) => {
        const language = await SecureStore.getItemAsync('userLanguage');
        const loginData = {
            ...data,
            LoginByMobile: true
        };
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await PostApi(accEndpoints.post.Login, loginData, {headers:{
                    'Accept-Language': language
                }});
            console.log(responseData)
            if (responseData){
                try {
                    const expirationTime = Date.now() + 30 * 60 * 1000;
                    await SecureStore.setItemAsync('accessToken', responseData.AccessToken);
                    await SecureStore.setItemAsync('accessTokenExpiration', expirationTime.toString());
                    // await SecureStore.setItemAsync('refreshToken', responseData.RefreshToken);
                    props.navigation.navigate('HomeScreen');
                    await Connect()

                } catch (error) {
                    console.error('Error saving tokens:', error);
                }
            }
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <ContainerTop>
            <Title style={{marginTop:65, marginBottom:-20}}>{t('login_title')}</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        placeholder={t('email')}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant ='default'
                        autoFocus={true} 
                    />
                )}
                name="UserName"
                defaultValue=""
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput

                        placeholder={t('password')}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant ='eye'
                    />
                )}
                name="Password"
                defaultValue=""
            />
            <LinkLogin onPress={() => props.navigation.navigate('Forget_password_form')}>{t('forget_password')}</LinkLogin>
            {!isButtonDisabled && (
                <SmallRedBtn
                    buttonColor='#FF5A5F'
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                >
                    <SmallBtnText>{t('login')}</SmallBtnText>
                </SmallRedBtn>
            )}
            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
            {/*{error && <ErrorView>*/}
            {/*    <ErrorText>{error}</ErrorText>*/}
            {/*    <XIcon*/}
            {/*        icon="window-close"*/}
            {/*        iconColor='#FFF'*/}
            {/*        size={20}*/}
            {/*        onPress={() => setError(null)}*/}
            {/*    />*/}
            {/*</ErrorView>}*/}
        </ContainerTop>
    );
}
