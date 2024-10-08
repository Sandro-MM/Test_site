import {Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import ONE from "../../../assets/img/art1.png"
import TWO from "../../../assets/img/art2.png"
import THREE from "../../../assets/img/art3.png"
import START from "../../../assets/img/start.png"
import MID from "../../../assets/img/mid.png"
import END from "../../../assets/img/end.png"
import {NotoSans_400Regular, NotoSans_800ExtraBold, useFonts} from "@expo-google-fonts/noto-sans";
import {useTranslation} from "react-i18next";
import {useRef, useState} from "react";
import {Inter_500Medium, Inter_600SemiBold} from "@expo-google-fonts/inter";
import * as SecureStore from "expo-secure-store";
import {ContainerMid, Logo, SearchBtn, SearchBtnText, VehicleBntText} from "../../styles/styles";
import {Divider} from "react-native-paper";
import {changeLanguage} from "i18next";

export default function First_login({route}) {
    const { welcomeShown } = route.params;
    const { t } = useTranslation();
    const [active, setActive] = useState(null);




    const ChangeLang =  (id) => {

        if (id === 1){
             setActive('en')
             changeLanguage('en')
             SecureStore.setItemAsync('userLanguage', 'en');

        } else if (id === 2){
             setActive('ka')
             changeLanguage('ka')
             SecureStore.setItemAsync('userLanguage', 'ka');
        } else if (id === 3){
             setActive('ru')
             changeLanguage('ru')
             SecureStore.setItemAsync('userLanguage', 'ru');
        }
    }




    let [fontsLoaded] = useFonts({
        NotoSans_400Regular,Inter_500Medium,Inter_600SemiBold,NotoSans_800ExtraBold
    });
    const Stack = createStackNavigator();
    const scrollViewRef = useRef(null);
    const { width } = useWindowDimensions();

    const scrollToNextScreen = () => {
        if (scrollViewRef.current) {
            const { contentOffset = { x: 0 } } = scrollViewRef.current;
            scrollViewRef.current.scrollTo({ x: contentOffset.x + width, animated: true });
        }
    };

    const scrollToFinalScreen = () => {
        if (scrollViewRef.current) {
            const { contentOffset = { x: 0 } } = scrollViewRef.current;
            scrollViewRef.current.scrollTo({ x: contentOffset.x + width * 2, animated: true });
        }
    };

    const skip = () => {
        welcomeShown(false)
        SecureStore.setItemAsync('welcomeShown', 'true')
    };


    if (fontsLoaded) return (
        <Stack.Navigator>
            <Stack.Screen name="Language" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <ContainerMid>
                        <Logo source={require("../../../assets/img/logos.png")}/>
                        {/*<Title>{t('sample_text')}</Title>*/}



                            <TouchableHighlight
                                style={{width:'90%', marginVertical:12}}
                                underlayColor="transparent"
                                onPress={() => ChangeLang(1)}>
                                <Text style={{color: active === 'en' ? '#FF5A5F' : '#0F0D13', fontFamily:'Inter_500Medium', fontSize: 28, lineHeight:44, textAlign:'center' }}>English</Text>
                            </TouchableHighlight>
                        <Divider  horizontalInset={true} bold={true} style={{width:'90%'}} />
                            <TouchableHighlight
                                style={{width:'90%', marginVertical:12}}
                                underlayColor="transparent"
                                onPress={() => ChangeLang(2)}>
                                <Text style={{color: active === 'ka' ? '#FF5A5F' : '#0F0D13', fontFamily:'Inter_500Medium', fontSize: 28, lineHeight:44, textAlign:'center' }}>ქართული</Text>
                            </TouchableHighlight>
                            <Divider horizontalInset={true} bold={true} style={{width:'90%'}} />
                            <TouchableHighlight
                                style={{width:'90%', marginVertical:12}}
                                underlayColor="transparent"
                                onPress={() => ChangeLang(3)}>
                                <View>
                                    <Text style={{color: active === 'ru' ? '#FF5A5F' : '#0F0D13', fontFamily:'Inter_500Medium', fontSize: 28, lineHeight:44, textAlign:'center' }}>Русский</Text>
                                </View>
                            </TouchableHighlight>







                        <View style={{width:'94%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:45, marginHorizontal:16, position:'absolute', bottom:30}}>

                            <SearchBtn contentStyle={{ height: 44, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                                       onPress={() => navigation.navigate('Welcome')}
                            >
                                <SearchBtnText style={{fontFamily:'Inter_600SemiBold'}}>{t('select')}</SearchBtnText>
                            </SearchBtn>
                        </View>
                    </ContainerMid>
                )}
            </Stack.Screen>
            <Stack.Screen name="Welcome" options={{ headerShown: false }}>
                {({ navigation }) => (
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                style={{ flex: 1}}
                alwaysBounceHorizontal={false}
                alwaysBounceVertical={false}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                contentContainerStyle={{ flexGrow: 1 , width:'300%'}}
        >
            {/* First Screen */}
            <View style={{ flexDirection: 'row' }}>
                <View style={{width:'33.3%', height:'100%'}}>
                    <Image resizeMode={"contain"} style={{width:'100%', flex:0.5}} source={ONE}/>
                    <View style={{width:'90%', position:'absolute', top:'50%', left:'5%', alignItems:'center'}}>
                        <Text style={{color:'#0F0D13', fontFamily:'NotoSans_800ExtraBold', fontSize: 36, lineHeight:44, textAlign:'center' }}>{t('ride_t')}</Text>
                        <Text style={{color:'#1D1B20',  fontFamily:'NotoSans_400Regular', fontSize: 18, lineHeight:28, textAlign:'center', marginTop:16 }}>{t('ride_t_desc')}</Text>
                        <Image style={{width:49, height:20, marginTop:32}} source={START}/>
                        <View style={{flexDirection:'row', gap:12, paddingTop:'9%'}}>
                            <TouchableOpacity
                                onPress={skip}
                                style={{
                                    width: '48%',
                                    backgroundColor: '#F2F4F7',
                                    paddingHorizontal:28,
                                    paddingVertical:16,
                                    height:60,
                                    borderRadius:12,
                                    borderStyle:'solid',
                                    borderBottomWidth:3,
                                    borderLeftWidth:0.1,
                                    borderRightWidth:0.1,
                                    borderColor:'#D0D5DD',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#344054', fontSize:18}}>{t('skip')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={scrollToNextScreen}
                                style={{
                                    width: '48%',
                                    backgroundColor: '#FF5A5F',
                                    paddingHorizontal:28,
                                    paddingVertical:16,
                                    height:60,
                                    borderRadius:12,
                                    borderStyle:'solid',
                                    borderBottomWidth:3,
                                    borderLeftWidth:0.1,
                                    borderRightWidth:0.1,
                                    borderColor:'#EB2931',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#fff', fontSize:18}}>{t('next')}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                </View>

                <View style={{ width: '33.3%', height: '100%' }}>
                    <Image resizeMode={"contain"} style={{ width: '100%', flex: 0.5 }} source={TWO}/>
                    <View style={{width:'80%', position:'absolute', top:'50%', left:'12%', alignItems:'center'}}>
                        <Text style={{color:'#0F0D13', fontFamily:'NotoSans_800ExtraBold', fontSize: 36, lineHeight:44, textAlign:'center' }}>{t('comp_t')}</Text>
                        <Text style={{color:'#1D1B20',  fontFamily:'NotoSans_400Regular', fontSize: 18, lineHeight:28, textAlign:'center', marginTop:16 }}>{t('comp_t_desc')}</Text>
                        <Image style={{width:49, height:20, marginTop:32}} source={MID}/>
                        <View style={{flexDirection:'row', gap:12, paddingTop:'9%'}}>
                            <TouchableOpacity
                                onPress={skip}
                                style={{
                                    width: '48%',
                                    backgroundColor: '#F2F4F7',
                                    paddingHorizontal:28,
                                    paddingVertical:16,
                                    height:60,
                                    borderRadius:12,
                                    borderStyle:'solid',
                                    borderBottomWidth:3,
                                    borderLeftWidth:0.1,
                                    borderRightWidth:0.1,
                                    borderColor:'#D0D5DD',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#344054', fontSize:18}}>{t('skip')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={scrollToFinalScreen}
                                style={{
                                    width: '48%',
                                    backgroundColor: '#FF5A5F',
                                    paddingHorizontal:28,
                                    paddingVertical:16,
                                    height:60,
                                    borderRadius:12,
                                    borderStyle:'solid',
                                    borderBottomWidth:3,
                                    borderLeftWidth:0.1,
                                    borderRightWidth:0.1,
                                    borderColor:'#EB2931',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#fff', fontSize:18}}>{t('next')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                <View style={{ width: '33.3%', height: '100%' }}>
                    <Image resizeMode={"contain"} style={{ width: '100%', flex: 0.5 }} source={THREE} />
                    <View style={{width:'80%', position:'absolute', top:'50%', left:'12%', alignItems:'center'}}>
                        <Text style={{color:'#0F0D13', fontFamily:'NotoSans_800ExtraBold', fontSize: 36, lineHeight:44, textAlign:'center' }}>{t('tap_t')}</Text>
                        <Text style={{color:'#1D1B20',  fontFamily:'NotoSans_400Regular', fontSize: 18, lineHeight:28, textAlign:'center', marginTop:16 }}>{t('tap_t_desc')}</Text>
                            <Image style={{width:49, height:20, marginTop:32}} source={END}/>
                        <TouchableOpacity
                            onPress={skip}
                            style={{
                                marginTop:'9%',
                                width: '100%',
                                backgroundColor: '#FF5A5F',
                                paddingHorizontal:28,
                                paddingVertical:16,
                                height:60,
                                borderRadius:12,
                                borderStyle:'solid',
                                borderBottomWidth:3,
                                borderLeftWidth:0.1,
                                borderRightWidth:0.1,
                                borderColor:'#EB2931',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#fff', fontSize:18}}>{t('launch')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
