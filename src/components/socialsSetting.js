import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import A2bInput from "./formInput";
import {
    ContainerTop,
    SmallBtnText,
    SmallRedBtn,
    Title,
} from "../styles/styles";
import {IconButton} from "react-native-paper";
import {useTranslation} from "react-i18next";
import useApiService, {accEndpoints, getAccessToken} from "../services/api";
import * as SecureStore from "expo-secure-store";
import {ScrollView} from "react-native";

const SocialsSetting = (props) => {
    const { PatchApi } = useApiService();

    const { t } = useTranslation();
    const { control, handleSubmit, reset } = useForm();
    const values = props.route.params.defaultValue;

    const [error, setError] = useState(null);
    const [facebook, setFacebook] = useState('');
    const [X, setX] = useState('');
    const [instagram, setInstagram] = useState('');
    const [viber, setViber] = useState('');
    const [telegram, setTelegram] = useState('');
    const [WhatsApp, setWhatsApp] = useState('');

    useEffect(() => {
        values.forEach(item => {
            switch(item.Name) {
                case 'Facebook':
                    setFacebook(item.ContactData);
                    break;
                case 'X':
                    setX(item.ContactData);
                    break;
                case 'Instagram':
                    setInstagram(item.ContactData);
                    break;
                    case 'Telegram':
                    setTelegram(item.ContactData);
                    break;
                    case 'Viber':
                        setViber(item.ContactData);
                    break;
                case 'WhatsApp':
                    setWhatsApp(item.ContactData);
                    break;
                default:
                    break;
            }
        });
        // Reset form values after state has been set
        reset({
            Facebook: facebook,
            X: X,
            Instagram: instagram,
            WhatsApp: WhatsApp,
            Viber: viber,
            Telegram: telegram
        });
    }, [values, facebook, X, instagram, viber, telegram, reset]);

    const setErrorItem = async (formValues) => {
        const formData = [
            {  ContactData: formValues.Telegram,  ContactTypeIds: 7, },
            {  ContactData: formValues.Viber ,  ContactTypeIds: 2, },
            {  ContactData: formValues.Facebook,  ContactTypeIds: 3, },
            {  ContactData: formValues.X ,  ContactTypeIds: 5, },
            {  ContactData: formValues.WhatsApp ,  ContactTypeIds: 1, },
            { ContactData: formValues.Instagram,   ContactTypeIds: 4, },
        ].filter(item => item.ContactData && item.ContactData.trim() !== '');

        const Value = 
             formData;
        

        try {
            const language = await SecureStore.getItemAsync('userLanguage');
            const accessToken = await getAccessToken();
            const responseData = await PatchApi(accEndpoints.patch.EditSocials, Value, {
                headers: {
                    'Accept-Language': language,
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('Response data:', responseData);
            props.navigation.goBack()
        } catch (error) {
            console.error('Error submitting data:', error);
            setError('Failed to submit data.');
        }
    };

    return (
        <ContainerTop>
            <IconButton
                style={{ position: 'absolute', top: 55, left: 7, zIndex: 3 }}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => props.navigation.goBack()}
            />
            <Title style={{marginTop:0, width:260, marginBottom:-30}}>{t('edit_socials')}</Title>
            <ScrollView style={{width:'100%', display:'flex', marginBottom:55, marginRight:-50}}>
                <Controller
                    control={control}
                    render={({ field }) => (
                        <A2bInput
                            autoFocus={true}
                            placeholder={'Facebook'}
                            value={field.value}
                            onChangeText={(value) => field.onChange(value)}
                            variant='default'
                        />
                    )}
                    name={'Facebook'}
                    defaultValue={facebook}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <A2bInput
                            placeholder={'Instagram'}
                            value={field.value}
                            onChangeText={(value) => field.onChange(value)}
                            variant='default'
                        />
                    )}
                    name={'Instagram'}
                    defaultValue={instagram}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <A2bInput
                            placeholder={`X`}
                            value={field.value}
                            onChangeText={(value) => field.onChange(value)}
                            variant='default'
                        />
                    )}
                    name={'X'}
                    defaultValue={X}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <A2bInput
                            placeholder={`Telegram`}
                            value={field.value}
                            onChangeText={(value) => field.onChange(value)}
                            variant='default'
                        />
                    )}
                    name={'Telegram'}
                    defaultValue={telegram}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <A2bInput
                            placeholder={`WhatsApp`}
                            value={field.value}
                            onChangeText={(value) => field.onChange(value)}
                            variant='default'
                        />
                    )}
                    name={'WhatsApp'}
                    defaultValue={WhatsApp}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <A2bInput
                            placeholder={`Viber`}
                            value={field.value}
                            onChangeText={(value) => field.onChange(value)}
                            variant='default'
                        />
                    )}
                    name={'Viber'}
                    defaultValue={viber}
                />
            </ScrollView>
            <SmallRedBtn style={{ position: 'absolute', bottom: 7 }} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(setErrorItem)}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>
            {/*{error && (*/}
            {/*    <ErrorView>*/}
            {/*        <ErrorText>{error}</ErrorText>*/}
            {/*        <XIcon*/}
            {/*            icon="window-close"*/}
            {/*            iconColor='#FFF'*/}
            {/*            size={20}*/}
            {/*            onPress={() => setError(null)}*/}
            {/*        />*/}
            {/*    </ErrorView>*/}
            {/*)}*/}
        </ContainerTop>
    );
};

export default SocialsSetting;
