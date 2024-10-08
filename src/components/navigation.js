import {BackHandler, Dimensions, Text, TouchableHighlight, View} from 'react-native';
import {Button, IconButton} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import { useFonts, NotoSans_500Medium } from '@expo-google-fonts/noto-sans';
import SEARCH from '../../assets/img/nav/search.png'
import PLUS from '../../assets/img/nav/PlusCircle.png'
import CAR from '../../assets/img/nav/CarProfile.png'
import CHAT from '../../assets/img/nav/ChatsCircle.png'
import PROFILE from '../../assets/img/nav/UserCircle.png'
import {useContext, useEffect, useState} from "react";
import useApiService, {getAccessToken, NotificationEndpoints} from "../services/api";
import {NotificationContext} from "./notificationCountContenxt";


export default function Navigation({ navigation, activeButton }) {
    const { notificationCount } = useContext(NotificationContext);
    const { t } = useTranslation();
    const [data, setResponseData] = useState(null);
    const { width } = Dimensions.get('window');
    const fontSize = width < 340 ? 10 : 12;
    const { GetApi } = useApiService();


    let [fontsLoaded] = useFonts({
         NotoSans_500Medium
    });










    const buttonDetails = [
        { icon: SEARCH , route: 'HomeScreen', label: 'search' },
        { icon: PLUS, route: 'AddRideCheck', label: 'publish' },
        { icon: CAR, route: 'RideHistory', label: 'your_rides' },
        { icon: CHAT, route: 'NotificationsScreen', label: 'inbox' },
        { icon: PROFILE, route: 'Profile', label: 'profile', params: { IsUserOrder: 1, navigation: navigation } }
    ];

    const buttonStyle = { marginTop: -8, height: 70,width:70, borderRadius:999, textAlign: 'center', backgroundColor:'transparent', zIndex: 2,  };

    const textStyle = {
        zIndex: 1,
        marginTop: -16,
        fontSize: fontSize,
        textAlign: 'center',
        marginLeft: -1,
        fontFamily: 'NotoSans_500Medium',
        position: 'absolute',
        bottom: -2,
        width: 70,
    };
    async function checkAccessToken(route, params) {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            if (!accessToken) {
                navigation.navigate('AuthScreen');
            } else {
                navigation.navigate(route,params);
            }
        } catch (error) {

        }
    }

    async function action(route, params) {
        setResponseData(null)
        checkAccessToken(route, params);
    }

    return (
        <View style={{ position: 'absolute', bottom: 0,

           }}>
            { fontsLoaded && <View style={{ height: 66, width: '101%', justifyContent: 'space-around', backgroundColor: 'rgba(252, 252, 253, 1)', flexDirection: 'row', paddingRight: 4 ,

                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 18,
                },
                shadowOpacity:  0.25,
                shadowRadius: 20.00,
                elevation: 24

            }}>
                {buttonDetails.map((button, index) => (
                    <View key={index} style={buttonStyle}>
                        <TouchableHighlight style={[buttonStyle]} onPress={() =>  action(button.route, button?.params)}
                                            underlayColor={activeButton === button.route ?'rgba(255, 90, 95, 0.05)':'rgba(128, 128, 128, 0.1)'}
                        >
                            <View>
                                <Text> </Text>
                                { button.route === 'NotificationsScreen' && notificationCount > 0 &&

                                    <View style={{position:'absolute', top:20, left:44, backgroundColor: '#fe2352', width: 13, height: 13, borderRadius:999, borderStyle:'solid', borderWidth:2, borderColor:'#fff',zIndex:99}}></View>
                                }
                                <Text></Text>
                            </View>
                        </TouchableHighlight>
                        <IconButton
                            style={[buttonStyle,{marginHorizontal: 0, position:'absolute', pointerEvents:'none', top:2}]}
                            icon={button.icon}
                            iconColor={activeButton === button.route ? '#FF5A5F' : '#7a7a7a'}
                            size={28}

                        />
                        <View style={{ pointerEvents:'none',}}>
                            <Text allowFontScaling={false} style={[textStyle, { color: activeButton === button.route ? '#FF5A5F' : '#7a7a7a'}]}>{t(button.label)}</Text>
                        </View>

                    </View>
                ))}
            </View>}


        </View>
    );
}

