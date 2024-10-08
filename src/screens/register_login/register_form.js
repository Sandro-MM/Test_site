import {ActivityIndicator, Keyboard, View,} from 'react-native';
import * as React from 'react';
import { Divider } from 'react-native-paper';
import {Controller, useForm} from "react-hook-form";
import useApiService, {accEndpoints, connectSignalR, headers} from "../../services/api";
import {useState} from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {TextInputMask} from "react-native-masked-text";
import moment from "moment";
import {
    ContainerMid, ContainerTop,
    ErrorText,
    ErrorView,
    GenderBntText, LinkLogin,
    SimpleBtnPadded,

    Title,
    XIcon
} from "../../styles/styles";
import A2bInput from "../../components/formInput";
import A2BNextIcon from "../../components/next_icon";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import MaskInput from "react-native-mask-input/src/MaskInput";
import {Masks} from "react-native-mask-input";

const Stack = createStackNavigator();
export default function Register_form({navigation}) {
    const { PostApi } = useApiService();
    const {Connect} = connectSignalR()
    const { t } = useTranslation();
    const { control, handleSubmit, watch,reset,formState ,formState: { errors }  } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkEmail = async (data) => {
        const language = await SecureStore.getItemAsync('userLanguage');
        const email = {
            Email: data.email
        };
        console.log(data.email);

        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await PostApi(accEndpoints.post.CheckEmailExists, email, {headers:{
                'Accept-Language': language
            }});

            if (responseData?.IsEmailExist) {
                setError('email_is_taken');
            } else {
                navigation.navigate('Name');
            }
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };

    async function onSubmit(data) {
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        const dateString = data?.birthDate;
        const parsedDate = moment(dateString, "DD/MM/YYYY");
        const formattedDate = parsedDate.format("ddd MMM DD YYYY");
        const formData = new FormData();
        formData.append('firstName', data?.firstName);
        formData.append('lastName', data?.lastName);
        formData.append('email', data.email);
        formData.append('gender', data.gender);
        formData.append('birthDate', formattedDate);
        formData.append('password', data.password);
        formData.append('acceptTerms', 'true');
        try {
            const responseData = await PostApi(accEndpoints.post.Register, formData, headers);
            navigation.navigate('ActivateEmail');
        }catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    }
    const onSubmitCode = async (data) => {
        const language = await SecureStore.getItemAsync('userLanguage');
        console.log(1);
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);

        try {
            const newData = {
                Email: data.email,
                confirmationCode: data.code
            };
            const loginData = {
                UserName: data.email,
                Password: data.password,
                LoginByMobile: true
            };
            const responseData = await PostApi(accEndpoints.post.ActivateEmailForReg, newData,{headers:{
                    'Accept-Language': language
                }});
            if (responseData) {
                console.log(responseData)
                const login = await PostApi(accEndpoints.post.Login, loginData,{headers:{
                        'Accept-Language': language
                    }});
                if(login){
                    try {
                        const expirationTime = Date.now() + 30 * 60 * 1000;
                        await SecureStore.setItemAsync('accessToken', login.AccessToken);
                        await SecureStore.setItemAsync('accessTokenExpiration', expirationTime.toString());
                        // await SecureStore.setItemAsync('refreshToken', login.RefreshToken);
                        navigation.navigate('Profile', { IsUserOrder: 1, navigation: navigation });
                        await Connect()
                    } catch (error) {
                        console.error('Error saving tokens:', error);
                    }
                }
            } else {
                const errorTitle = responseData ? responseData.detail : 'Activation failed';
                setError(errorTitle);
            }
        } catch (error) {
            const errorTitle = error.response ? error.response.data.detail : 'An error occurred';
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };

    return (
            <Stack.Navigator>
                <Stack.Screen name="Email" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerTop>
                            <Title style={{marginTop:101}}>{t("what's_your_email")}</Title>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <A2bInput
                                            placeholder={t("email")}
                                            value={field.value}
                                            onChangeText={(value) => field.onChange(value)}
                                            variant ='default'
                                            autoFocus={true}
                                        />
                                        {field.value.length > 5 && (
                                            <A2BNextIcon onPress={handleSubmit(checkEmail)} />
                                        )}
                                    </React.Fragment>
                                )}
                                name="email"
                                defaultValue=""
                                rules={{
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email address',
                                    },
                                }}
                            />
                            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
                            {(errors.email || error) && (
                                <ErrorView>
                                    <ErrorText>{t(errors.email?.message || error)}</ErrorText>
                                    <XIcon
                                        icon="window-close"
                                        iconColor='#FFF'
                                        size={20}
                                        onPress={() => setError(null)}
                                    />
                                </ErrorView>
                            )}
                        </ContainerTop>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Name" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerTop>
                            <Title style={{marginTop:60}}>{t( "tell_us_your_name")}</Title>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <A2bInput
                                        placeholder={t(  "first_name")}
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value)}
                                        variant ='default'
                                        autoFocus={true}
                                    />
                                )}
                                name="firstName"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <A2bInput
                                        placeholder={t("last_name")}
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value)}
                                        variant ='default'
                                    />
                                )}
                                name="lastName"
                                defaultValue=""
                            />
                            {(formState.dirtyFields.firstName && formState.dirtyFields.lastName) && (
                                <A2BNextIcon onPress={() => navigation.navigate('DateOfBirth')} />
                            )}
                        </ContainerTop>
                    )}
                </Stack.Screen>
                <Stack.Screen name="DateOfBirth" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerTop>
                            <Title style={{marginTop:101}}>{t("what's_your_date_of_birth")}</Title>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <MaskInput
                                            autoFocus={true}
                                            style={{height:45, backgroundColor:'#D8D9DA', width:'85%', borderRadius:14, paddingVertical:5, paddingHorizontal:15, fontSize:18}}
                                            keyboardType = 'numeric'
                                            placeholder={'DD/MM/YYYY'}
                                            value={field.value}
                                            mask={Masks.DATE_DDMMYYYY}
                                            onChangeText={(value) => field.onChange(value)}
                                        />
                                        {field.value.length > 9 && (
                                            <A2BNextIcon onPress={() => navigation.navigate('Gender')} />
                                        )}
                                    </React.Fragment>
                                )}
                                name="birthDate"
                                defaultValue=""
                            />
                        </ContainerTop>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Gender" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerMid>
                            <Title style={{marginTop:-140}}>{t('how_would_you_like_to_be_addressed')}</Title>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <SimpleBtnPadded
                                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                                        rippleColor="rgba(128, 128, 128, 0.2)"
                                        mode="text"
                                        onPress={() => {
                                            field.onChange(1);
                                            navigation.navigate('Password');
                                        }}
                                    >
                                        <GenderBntText>{t('male')}</GenderBntText>
                                    </SimpleBtnPadded>
                                )}
                                name="gender"
                                defaultValue="1"
                            />
                            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <SimpleBtnPadded
                                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                                        rippleColor="rgba(128, 128, 128, 0.2)"
                                        mode="text"
                                        onPress={() => {
                                            field.onChange(2);
                                            navigation.navigate('Password');
                                        }}
                                    >
                                        <GenderBntText>{t('female')}</GenderBntText>
                                    </SimpleBtnPadded>
                                )}
                                name="gender"
                                defaultValue="2"
                            />
                            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <SimpleBtnPadded
                                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                                        rippleColor="rgba(128, 128, 128, 0.2)"
                                        mode="text"
                                        onPress={() => {
                                            field.onChange(3);
                                            navigation.navigate('Password');
                                        }}
                                    >
                                        <GenderBntText>{t('other')}</GenderBntText>
                                    </SimpleBtnPadded>
                                )}
                                name="gender"
                                defaultValue="3"
                            />
                        </ContainerMid>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Password" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerTop>
                            <Title style={{marginTop:101}}>{t('define_your_password')}</Title>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <A2bInput
                                            placeholder={t("password")}
                                            value={field.value}
                                            onChangeText={(value) => field.onChange(value)}
                                            variant ='eye'
                                        />
                                        {field.value.length > 7 && (
                                            <A2BNextIcon onPress={handleSubmit(onSubmit)} />
                                        )}
                                        {(errors.password && field.value.length > 7) && (
                                            <View style={{position:"absolute", bottom:0, width:'100%'}}>
                                                <ErrorView>
                                                    <ErrorText>{errors.password?.message}</ErrorText>
                                                </ErrorView>
                                            </View>
                                        )}
                                    </React.Fragment>
                                )}
                                name="password"
                                defaultValue=""
                                rules={{
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                        message: 'Password requires 8 characters, uppercase, lowercase and digit.',
                                    },
                                }}
                            />
                            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
                        </ContainerTop>
                    )}
                </Stack.Screen>
                <Stack.Screen name="ActivateEmail" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerTop>
                            <Title style={{marginTop:60}}>{t('please_confirm_your_email')}</Title>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <A2bInput
                                            placeholder="Code"
                                            value={field.value}
                                            onChangeText={(value) => field.onChange(value)}
                                            variant ='default'
                                            autoFocus={true}
                                            render={props => (
                                                <TextInputMask
                                                    {...props}
                                                    type={'only-numbers'}
                                                />
                                            )}
                                        />
                                        {field.value.length > 5 && (
                                            <A2BNextIcon onPress={handleSubmit(onSubmitCode)} />
                                        )}
                                    </React.Fragment>
                                )}
                                name="code"
                                defaultValue=""
                            />
                            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}

                            <LinkLogin onPress={handleSubmit(checkEmail)}>{t('resend_code')}</LinkLogin>
                        </ContainerTop>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
    );
}
