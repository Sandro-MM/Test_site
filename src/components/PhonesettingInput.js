import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import A2bInput from "./formInput";
import {
    ContainerTop,
    ErrorText,
    ErrorView,
    SmallBtnText,
    SmallRedBtn,
    Title,
    XIcon
} from "../styles/styles";
import {IconButton} from "react-native-paper";
import {useTranslation} from "react-i18next";
import useApiService, {accEndpoints, getAccessToken} from "../services/api";
import * as SecureStore from "expo-secure-store";

const PhoneSettingInput = ({ route, navigation }) => {
    const { PutApi,PostApi } = useApiService();


    const { t } = useTranslation();
    const {defaultValue, control, name, title, handleSubmit } = route.params;
    const [error, setError] = useState(null);
    React.useEffect(() => {
        console.log('Error prop:', error);
    }, [error]);




    const addNumber = async () => {
        const Value = { PhoneNumber: control._formValues.PhoneNumber };
        try {
            const language = await SecureStore.getItemAsync('userLanguage');
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Accept-Language': language,
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // handleSubmit()
            // const oldaccessToken = await SecureStore.getItemAsync('accessToken');
            // const refreshToken = await SecureStore.getItemAsync('refreshToken');
            // const data = {
            //     AccessToken: oldaccessToken,
            //     RefreshToken: refreshToken
            // };
            //     const newAccessToken = await PostApi(accEndpoints.post.Refresh, data);
            //     const newExpirationTime = Date.now() + 30 * 60 * 1000;
            //     await SecureStore.setItemAsync('accessToken', newAccessToken.AccessToken);
            //     await SecureStore.setItemAsync('accessTokenExpiration', newExpirationTime.toString());
            //     await SecureStore.setItemAsync('refreshToken', newAccessToken.RefreshToken);
            navigation.goBack()
        } catch (error) {
            console.error('Error submitting data:', error)
            const errorTitle = error.message;
            console.error('Error submitting data:', error); // Log error for troubleshooting
            setError(errorTitle);
        }
    };




    return (
        <ContainerTop style={{ paddingTop: 100 }}>
            <IconButton
                style={{ position: 'absolute', top: 60, left: 0, zIndex: 3 }}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title>{t(title)}</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        autoFocus={true}
                        placeholder={`${t(title)}`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name={name}
                defaultValue={defaultValue}
            />
            <SmallRedBtn style={{ position: 'absolute', bottom: 50}} buttonColor='#FF5A5F' mode='contained' onPress={addNumber}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>

        </ContainerTop>
    );
};

export default PhoneSettingInput;
