// ErrorDisplay.js
import React, {useContext, useEffect} from 'react';
import {ErrorContext} from "./errorContext";
import {ErrorText, ErrorView, XIcon} from "../styles/styles";
import {Image, Text, TouchableHighlight, View} from "react-native";
import {getFormattedDate, getStatusImg} from "../screens/notifications/notifications";
import {
    NotoSans_400Regular,

    useFonts
} from "@expo-google-fonts/noto-sans";
import {useNavigation} from "@react-navigation/native";

const ErrorDisplay = () => {
    const navigation = useNavigation()
    let [fontsLoaded] = useFonts({
        NotoSans_400Regular
    });
    const { error, clearError } = useContext(ErrorContext);

    const press = () =>{
        navigation.navigate('NotificationsScreen');
        clearError();
    }

    useEffect(() => {
        clearAuto()
    }, [error]);
    const clearAuto = () =>{
        setTimeout(()=>clearError(),5000)
    }

    if (!error) return null;

    if(fontsLoaded)  return (
        <View style={{zIndex:1000, position:'absolute', width:'100%',   ...(error?.type === 'error' ? { bottom: 0 } : { top: 0 })}}>
            {
                error?.type === 'error' &&
                <ErrorView style={{height:80}}>
                    <ErrorText>{error?.data.response?.data?.detail}</ErrorText>
                    <XIcon
                        icon="window-close"
                        iconColor='#FFF'
                        size={20} onPress={clearError}/>
                </ErrorView>
            }

            {
                error?.type === 'notification' &&
                <TouchableHighlight style={{height:72,width:'100%'}}
                                    underlayColor="transparent"
                                     onPress={press}
                >

                    <View style={{ alignItems:'flex-start', backgroundColor:'white', borderRadius:15, flexDirection:'row', height:72, paddingLeft: 16, paddingRight: 16,paddingTop:10, paddingBottom:10,
                        shadowColor: "#000000",
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity:  0.18,
                        shadowRadius: 4.59,
                        elevation: 5,
                        width: '100%',
                        position:'absolute',
                        top:5

                    }}>
                        <XIcon
                            icon="window-close"
                            iconColor='#000'
                            size={18} onPress={clearError}/>
                        <Image style={{width:48, height:48 }} source={getStatusImg(error?.data.type)}/>
                        <Text style={{marginHorizontal:15, marginTop:10, paddingRight:20, fontFamily:'NotoSans_400Regular', fontSize:14}}> {error?.data.message}</Text>
                    </View>
                </TouchableHighlight>
            }
                </View>

    );
};

export default ErrorDisplay;
