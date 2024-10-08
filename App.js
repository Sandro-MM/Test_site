import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AuthScreen from "./src/screens/auth/auth";
import Register_login from "./src/screens/register_login/register_login";
import Register_form from "./src/screens/register_login/register_form";
import Login_form from "./src/screens/register_login/login_form";
import Forget_password_form from "./src/screens/register_login/forget_password_form";
import Confirm_password_change from "./src/screens/register_login/confirm_password_change";
import HomeScreen from "./src/screens/home/home";
import Profile from "./src/screens/Profile/profile";
import Vehicles from "./src/screens/Profile/vehicles";
import {DefaultTheme, Provider} from 'react-native-paper';
import AddVehicle from "./src/screens/Profile/addVehicle";
import Reviews from "./src/screens/Profile/reviews";
import ProfileSettings from "./src/screens/Profile/profileSettings";
import SettingInput from "./src/components/settingInput";
import VerifyPhoneNumber from "./src/screens/Profile/VerifyPhoneNumber";
import AddRide from "./src/screens/add_ride/add_ride";
// import {enableLatestRenderer} from 'react-native-maps';
import AddRideCheck from "./src/screens/add_ride/addRideCheck";
import RideHistory from "./src/screens/rideHistory/rideHistory";
import Order from "./src/screens/home/order";
import MapPointViewScreen from "./src/components/mapPointView";
import {ListFilter} from "./src/components/listFilter";
import {AppState, Platform, StatusBar, Text, View} from "react-native";
import {RideAddedSucsess} from "./src/screens/add_ride/rideAddedSucsess";
import {Passengers} from "./src/screens/rideHistory/passengers";
import SettingsPage from "./src/screens/Profile/settings";
import LanguageSetting from "./src/screens/Profile/languageSetting";
import PasswordSettingInput from "./src/screens/Profile/passwordSettingInput";
import NotificationEmailSms from "./src/screens/Profile/notificationEmailSms";
import DescriptionSetting from "./src/screens/Profile/descriptionSetting";
import GenderSetting from "./src/screens/Profile/genderSetting";
import PrefrenceSettings from "./src/screens/Profile/prefrenceSettings";
import RatingsSetting from "./src/screens/Profile/ratingsSetting";
import DateSettingInput from "./src/screens/Profile/dateSettingInput";
import {I18nextProvider} from "react-i18next";
import i18n from './i18n';
import {EditRide} from "./src/screens/rideHistory/editRide";
import ChooseCar from "./src/screens/rideHistory/chooseCar";
import EditPassengerCount from "./src/screens/rideHistory/editPassengerCount";
import EditRideDescription from "./src/screens/rideHistory/editRideDescription";
import EditDate from "./src/screens/rideHistory/editDate";
import EditTime from "./src/screens/rideHistory/editTime";
import EditDescription from "./src/screens/rideHistory/editOptions";
import EditMapViewScreen from "./src/screens/rideHistory/editMapView";
import MapAToBViewEditScreen from "./src/screens/rideHistory/mapAToBViewEdit";
import RidePriceEdit from "./src/screens/rideHistory/ridePriceEdit";
import Confirm_Price_change from "./src/screens/rideHistory/confirm_price_change";
import {useEffect, useRef, useState} from "react";
import * as SecureStore from "expo-secure-store";
import First_login from "./src/screens/first_login/first_login";
import CancelReason from "./src/screens/home/cancel_reason";
import ReportReason from "./src/screens/Profile/report_reason";
import CarGallery from "./src/screens/Profile/carGallery";
import WriteReview from "./src/screens/Profile/write_review";
import NotificationsScreen from "./src/screens/notifications/notifications";
import * as Notifications from "expo-notifications";
import Constants from 'expo-constants';
import * as Device from "expo-device";
import {Action} from "./src/screens/Profile/action";
import PhoneSettingInput from "./src/components/PhonesettingInput";
import CancelReasonOwner from "./src/screens/home/cancel_reason_Owner";
import SocialsSetting from "./src/components/socialsSetting";
import {ErrorProvider} from "./src/components/errorContext";
import ErrorDisplay from "./src/components/errorDisplay";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import useApiService, {connectSignalR, getAccessToken} from "./src/services/api";
import * as signalR from "@microsoft/signalr";
import {NotificationProvider} from "./src/components/notificationCountContenxt";



Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    // Android specific code
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    // Check if it's a physical device
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Request permission if not already granted
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }

        // iOS Specific: Request for APN (Apple Push Notification) token
        if (Platform.OS === 'ios') {
            const { status: iosStatus } = await Notifications.getPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowSound: true,
                    allowBadge: true,
                },
            });

            if (iosStatus !== 'granted') {
                handleRegistrationError('iOS permission not granted for push notifications!');
                return;
            }

            // Optionally, get the APN token if you need it (not required for Expo push notifications)
            const apnToken = await Notifications.getDevicePushTokenAsync();
            console.log(apnToken, 'APN Token');
        }

        // Get the Expo Push Token
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;

        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }

        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString, 'pushTokenString');
            return pushTokenString;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }

    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export default function App() {
    // enableLatestRenderer();
    const Stack = createStackNavigator();




    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(undefined);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => {setExpoPushToken(token ?? '');          SecureStore.setItemAsync('expoPushToken', token);})
            .catch((error) => setExpoPushToken(`${error}`));



        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(
                notificationListener.current,
            );
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const token = Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
    });



    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);




    const [showWelcome, setShowWelcome] = useState(0);

        useEffect(() => {
            SecureStore.getItemAsync('welcomeShown')
                .then(value => {
                    if (!value) {
                        setShowWelcome(true);
                    } else {
                        setShowWelcome(false);
                    }
                })
                .catch(error => {
                    console.error('Error reading AsyncStorage:', error);
                });
        }, []);


    return (

        <Provider theme={theme}>
            <NotificationProvider>
            <ErrorProvider>
            <I18nextProvider i18n={i18n}>
                <NavigationContainer>
                    <StatusBar
                        backgroundColor="#FFF"
                        barStyle="dark-content"
                    />
                    <ErrorDisplay/>
                    {showWelcome ?
                        <Stack.Navigator>
                            <Stack.Screen  name="First_login"  initialParams={{welcomeShown: setShowWelcome }} options={{ headerShown: false }} component={First_login} />
                        </Stack.Navigator>
                        : showWelcome === false &&

                        <Stack.Navigator>


                            <Stack.Screen
                                name="HomeScreen"
                                options={{ headerShown: false , animationEnabled: false }}
                                component={HomeScreen}

                            />
                            <Stack.Screen name="AuthScreen" options={{ headerShown: false }} component={AuthScreen} />
                            <Stack.Screen name="Register_login"  options={{ headerShown: false }} component={Register_login} />
                            <Stack.Screen name="Register_form"  options={{ headerShown: false }} component={Register_form} />
                            <Stack.Screen name="Login_form"  options={{ headerShown: false }} component={Login_form} />
                            <Stack.Screen name="Forget_password_form"  options={{ headerShown: false }} component={Forget_password_form} />
                            <Stack.Screen name="Profile"   options={{ headerShown: false , animationEnabled: false}} component={Profile} />
                            <Stack.Screen name="Confirm_password_change"  options={{ headerShown: false }} component={Confirm_password_change} />
                            <Stack.Screen name="Vehicles"  options={{ headerShown: false }} component={Vehicles} />
                            <Stack.Screen name="AddVehicle"  options={{ headerShown: false }} component={AddVehicle} />
                            <Stack.Screen name="Reviews"  options={{ headerShown: false }} component={Reviews} />
                            <Stack.Screen name="ProfileSettings"  options={{ headerShown: false }} component={ProfileSettings} />
                            <Stack.Screen name="SettingsPage"  options={{ headerShown: false }} component={SettingsPage} />
                            <Stack.Screen name="SettingInput"  options={{ headerShown: false }} component={SettingInput} />
                            <Stack.Screen name="VerifyPhoneNumber"  options={{ headerShown: false }} component={VerifyPhoneNumber} />
                            <Stack.Screen name="AddRide"  options={{ headerShown: false }} component={AddRide} />
                            <Stack.Screen name="NotificationsScreen"  options={{ headerShown: false , animationEnabled: false }} component={NotificationsScreen} />
                            <Stack.Screen name="RideHistory"  options={{ headerShown: false , animationEnabled: false }} component={RideHistory} />
                            <Stack.Screen name="Order"  options={{ headerShown: false , animationEnabled: false }} component={Order} />
                            <Stack.Screen name="MapPointViewScreen"  options={{ headerShown: false , animationEnabled: false }} component={MapPointViewScreen} />
                            <Stack.Screen name="ListFilter"  options={{ headerShown: false , animationEnabled: false }} component={ListFilter} />
                            <Stack.Screen name="AddRideCheck"  options={{ headerShown: false , animationEnabled: false}} component={AddRideCheck} />
                            <Stack.Screen name="RideAddedSucsess"  options={{ headerShown: false , animationEnabled: false}} component={RideAddedSucsess} />
                            <Stack.Screen name="Passengers"  options={{ headerShown: false , animationEnabled: false}} component={Passengers} />
                            <Stack.Screen name="LanguageSetting"  options={{ headerShown: false , animationEnabled: false}} component={LanguageSetting} />
                            <Stack.Screen name="PasswordSettingInput"  options={{ headerShown: false , animationEnabled: false}} component={PasswordSettingInput} />
                            <Stack.Screen name="NotificationEmailSms"  options={{ headerShown: false , animationEnabled: false}} component={NotificationEmailSms} />
                            <Stack.Screen name="DescriptionSetting"  options={{ headerShown: false , animationEnabled: false}} component={DescriptionSetting} />
                            <Stack.Screen name="GenderSetting"  options={{ headerShown: false , animationEnabled: false}} component={GenderSetting} />
                            <Stack.Screen name="PrefrenceSettings"  options={{ headerShown: false , animationEnabled: false}} component={PrefrenceSettings} />
                            <Stack.Screen name="RatingsSetting"  options={{ headerShown: false , animationEnabled: false}} component={RatingsSetting} />
                            <Stack.Screen name="DateSettingInput"  options={{ headerShown: false , animationEnabled: false}} component={DateSettingInput} />
                            <Stack.Screen name="EditRide"  options={{ headerShown: false , animationEnabled: false}} component={EditRide} />
                            <Stack.Screen name="ChooseCar"  options={{ headerShown: false , animationEnabled: false}} component={ChooseCar} />
                            <Stack.Screen name="EditPassengerCount"  options={{ headerShown: false , animationEnabled: false}} component={EditPassengerCount} />
                            <Stack.Screen name="EditRideDescription"  options={{ headerShown: false , animationEnabled: false}} component={EditRideDescription} />
                            <Stack.Screen name="EditDate"  options={{ headerShown: false , animationEnabled: false}} component={EditDate} />
                            <Stack.Screen name="EditTime"  options={{ headerShown: false , animationEnabled: false}} component={EditTime} />
                            <Stack.Screen name="EditDescription"  options={{ headerShown: false , animationEnabled: false}} component={EditDescription} />
                            <Stack.Screen name="EditMapViewScreen"  options={{ headerShown: false , animationEnabled: false}} component={EditMapViewScreen} />
                            <Stack.Screen name="MapAToBViewEditScreen"  options={{ headerShown: false , animationEnabled: false}} component={MapAToBViewEditScreen} />
                            <Stack.Screen name="RidePriceEdit"  options={{ headerShown: false , animationEnabled: false}} component={RidePriceEdit} />
                            <Stack.Screen name="Confirm_Price_change"  options={{ headerShown: false , animationEnabled: false}} component={Confirm_Price_change} />
                            <Stack.Screen name="CancelReason"  options={{ headerShown: false , animationEnabled: false}} component={CancelReason} />
                            <Stack.Screen name="CancelReasonOwner"  options={{ headerShown: false , animationEnabled: false}} component={CancelReasonOwner} />
                            <Stack.Screen name="ReportReason"  options={{ headerShown: false , animationEnabled: false}} component={ReportReason} />
                            <Stack.Screen name="CarGallery"  options={{ headerShown: false , animationEnabled: false}} component={CarGallery} />
                            <Stack.Screen name="WriteReview"  options={{ headerShown: false , animationEnabled: false}} component={WriteReview} />
                            <Stack.Screen name="Action"  options={{ headerShown: false , animationEnabled: false}} component={Action} />
                            <Stack.Screen name="PhoneSettingInput"  options={{ headerShown: false , animationEnabled: false}} component={PhoneSettingInput} />
                            <Stack.Screen name="SocialsSetting"  options={{ headerShown: false , animationEnabled: false}} component={SocialsSetting} />

                        </Stack.Navigator>
                    }
                </NavigationContainer>
            </I18nextProvider>
            </ErrorProvider>
                </NotificationProvider>
        </Provider>

    );
}

const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
        ...DefaultTheme.colors,
        primary: "#FF5A5F",
        secondaryContainer: "#f6f6f6",
        surfaceVariant: "#f6f6f6",
        surfaceDisabled: "#808080",
        onPrimaryContainer: "#000000",
    },
};

