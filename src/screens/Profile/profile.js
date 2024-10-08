import {
    ProfileContainer,
    ProfilePic,
    ProfileName,
    ProfileSocialMedia,
    IconView,
    SmallRedBtn,
    ListPic,
    VehicleFuel, Container, SearchBtn, SearchBtnText,
} from "../../styles/styles";
import {Icon, IconButton, Surface} from "react-native-paper";
import * as React from "react";
import {AppState, Image, ImageBackground, Linking, ScrollView, Text, TouchableHighlight, View} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import useApiService, {accEndpoints, getAccessToken, headersTextToken} from "../../services/api";
import {
    iconMapping,
    socialMediaMapping,
} from "../../styles/vehicleMappings";
import Navigation from "../../components/navigation";
import UserNoIMage from "../../../assets/img/default_user.png";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import BG from "../../../assets/img/hills.png";
import CAR from "../../../assets/img/profile_car.png";
import SETTING from "../../../assets/img/settings.png";
import PERSON from "../../../assets/img/profile_person.png";
import STAR from "../../../assets/img/star.png";
import ABOUT_ME from "../../../assets/img/about.png";
import INFO from "../../../assets/img/info.png";
import VERIFY from "../../../assets/img/Verifiedtick.png";
import UNVERIFIED from "../../../assets/img/seal-question-fill.png";
import REVIEW from "../../../assets/img/review.png";
import CAR2 from "../../../assets/img/CarProfile.png";
import GAS from "../../../assets/img/Gas.png";
import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts} from "@expo-google-fonts/inter";
import {useNavigation, useRoute} from "@react-navigation/native";
import {debounce} from "lodash";
import TicketIMage from "../../../assets/img/tickett.png";
import ARROW from "../../../assets/img/warning-2.png";
import GEORGIAN_FLAG from "../../../assets/img/GE.png";
import CHAT from "../../../assets/img/ChatsTeardrop.png";
import WriteReview from "./write_review";
import Loading from "../../components/loading";

export default function Profile() {
    const { GetApi } = useApiService();

    const { t } = useTranslation();
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    });
    const scrollViewRef = useRef(null);
    const elementRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const profileType = route.params.IsUserOrder === 1;
    const userName = route.params?.userName;
    const orderId = route.params?.orderId || null;
    const orderStatus = route.params?.orderStatus || null;
    const expoPushToken = route.params?.expoPushToken || null;




    const [responseData, setResponseData] = useState(null);

    const [phoneNumber, setPhoneNumber] = useState(null);
    const [canWriteReview, setCanWriteReview] = useState(false);


    const [selectedTab, setSelectedTab] = useState('info');

    const renderContent = () => {
        switch (selectedTab) {
            case 'about_me':
                return  <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={{width:51, height:51}} source={ABOUT_ME}/>
                        <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_500Medium', marginLeft:14, marginTop:8}}>{ profileType? t('about_me'):`${t('about')} ${responseData.FirstName}`}</Text>
                    </View>

                    <Text style={{marginTop:20, color:'#475467', fontSize:16, fontFamily:'Inter_400Regular',fontStyle:'italic'}}>
                    “ {responseData?.UserDetail.Description || t('empty')} ”
                    </Text>
                </View>
            case 'info':
                return <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={{width:51, height:51}} source={INFO}/>
                        <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_500Medium', marginLeft:14, marginTop:8}}>{t('info')}</Text>
                    </View>

                    <Text style={{color: '#667085', fontSize:15, fontFamily:'Inter_500Medium', marginTop:23}}>{t('Location')}</Text>

                    <View style={{flexDirection:'row', alignItems:'center', marginTop: 8}}>
                        <Image style={{width:21, height:21}} source={GEORGIAN_FLAG}/>
                        <Text style={{color:'#101828', fontSize:16,fontFamily:'Inter_500Medium', marginLeft:9}}>{t('Georgia')}</Text>
                    </View>

                    <View style={{marginTop:18, flexDirection:'row' , alignItems:'center', marginLeft:-8, gap:4}}>
                        <View style={{width:35}}>
                                <IconButton
                                    style={{marginHorizontal:0}}
                                    iconColor={null}
                                    size={22}
                                    icon={VERIFY}/>
                        </View>
                        <Text style={{color: '#667085', fontSize:16, fontFamily:'Inter_600SemiBold'}}>
                            {responseData.Age } {t('YEARS')}
                        </Text>
                    </View>
                    <View style={{marginTop:-15, flexDirection:'row' , alignItems:'center', marginLeft:-8, gap:4}}>
                        <View style={{width:35}}>
                                <IconButton
                                    style={{marginHorizontal:0}}
                                    iconColor={null}
                                    size={22}
                                    icon={responseData?.IsEmailVerified ? VERIFY : UNVERIFIED}/>
                        </View>
                        <Text style={{color: '#667085', fontSize:16, fontFamily:'Inter_600SemiBold'}}>
                            {responseData.Email || (responseData?.IsEmailVerified ? t("verified_email"):t('email_not_verified'))}
                        </Text>
                    </View>
                    <View style={{marginTop:-15, marginBottom: - 15, flexDirection:'row' , alignItems:'center', marginLeft:-8, gap:4}}>
                        <View style={{width:36}}>
                                <IconButton
                                    style={{marginHorizontal:0}}
                                    iconColor={null}
                                    size={22}
                                    icon={responseData?.IsPhoneNumberVerified ? VERIFY : UNVERIFIED}/>
                        </View>


                        <Text style={{color: '#667085', fontSize:16, fontFamily:'Inter_600SemiBold'}}>
                            {phoneNumber || responseData?.PhoneNumber || t('no_phone_number')}
                        </Text>

                        {
                            (profileType && responseData?.PhoneNumber && responseData.IsPhoneNumberVerified === false) && <SmallRedBtn style={{marginTop:-3, marginLeft:-8}} mode="text" onPress={handlePressPhoneNumber}>
                                <Text allowFontScaling={false} style={{color:'#FF5A5F', fontSize:16, fontFamily:'Inter_400Regular'}}>{t('verify_number')}</Text>
                            </SmallRedBtn>
                        }
                        {
                            (!profileType && responseData?.PhoneNumber && !phoneNumber) && <SmallRedBtn   style={{marginTop:-3, marginLeft:-8}} mode="text" onPress={()=> getPhoneNumber()}>
                                <Text allowFontScaling={false} style={{color:'#FF5A5F', fontSize:16, fontFamily:'Inter_400Regular'}}>{t('reveal_number')}</Text>
                            </SmallRedBtn>
                        }
                    </View>

                        {
                            responseData.UserDetail.UserContacts.length> 0 &&
                            <View style={{marginTop:25}}>
                                <Text style={{color: '#667085', fontSize:15, fontFamily:'Inter_500Medium'}}>
                                    { t("socials")}
                                </Text>
                            <ProfileSocialMedia style={{marginLeft:-6, marginBottom: -10, marginTop: -5}}>
                                {responseData.UserDetail.UserContacts.map(contact => (
                                    <IconButton
                                        style={{width:26}}
                                        key={contact.Id}
                                        icon={socialMediaMapping[contact.Name]}
                                        iconColor={null}
                                        size={29}
                                        onPress={() => Linking.openURL(contact.ContactData)}
                                    />
                                ))}
                            </ProfileSocialMedia>
                            </View>
                        }


                </View>
            case 'cars':
                return <View style={{paddingTop:10}}>
                    {
                        responseData?.UserCarReponseModels.length > 0 &&
                        responseData?.UserCarReponseModels.map((item, index)=>(

                                <View style={{marginVertical:12, width:'100%', height:310, borderRadius:16, borderColor:'#D0D5DD', borderStyle:'solid', borderWidth:1, borderBottomWidth:3}}>
                                    <TouchableHighlight key={index}
                                                        onPress={()=> navigation.navigate('CarGallery',{data:item.CarPictureUrls, navigation:navigation})}
                                                        underlayColor="rgba(128, 128, 128, 0.2)">
                                    <Image
                                        style={{width:'100%', height: 180, borderTopRightRadius:16, borderTopLeftRadius:16}}
                                        source={{
                                            uri: item.CarPictureUrls[0]?.Name,
                                        }}
                                    />
                                    </TouchableHighlight>
                                    <View style={{marginTop:22, marginHorizontal:16}}>
                                        <Text style={{color:'#344054', textAlign:'center',marginTop:-10, paddingBottom:10, fontFamily:'Inter_600SemiBold', fontSize:16}}> {item.Manufacturer.Name} {item.Model?.Name}
                                        </Text>
                                        <Text style={{color:'#344054', fontFamily:'Inter_600SemiBold'}}> {item.ReleaseDate}</Text>
                                        <Text style={{color:'#667085', fontFamily:'Inter_400Regular'}}> {item.Color?.Name} </Text>
                                        <Text style={{color: '#101828', fontFamily:'Inter_700Bold', fontSize:17, position:'absolute', top:20, right:0}}>{item.PlateNumber}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: -15 }}>
                                            <VehicleFuel
                                                contentStyle={{ height: 38, justifyContent: 'flex-start' }}
                                                mode="text"
                                            >
                                                <Icon
                                                    source={GAS}
                                                    color="#343330"
                                                    size={20}
                                                />
                                                <Text style={{color:'#475467',  fontSize:16, fontFamily:'Inter_400Regular'}}> {item.FuelType?.Name} </Text>
                                            </VehicleFuel>
                                            <VehicleFuel
                                                contentStyle={{ height: 38, justifyContent: 'flex-start' }}
                                                mode="text"
                                            >
                                                <Icon
                                                    source={CAR2}
                                                    color="#343330"
                                                    size={20}
                                                />
                                                <Text style={{color:'#475467',  fontSize:16, fontFamily:'Inter_400Regular'}}>  {item.CarType?.Name} </Text>
                                            </VehicleFuel>
                                        </View>
                                    </View>
                                </View>

                        ))}


                </View>
            case 'reviews':
                return <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={{width:51, height:51}} source={REVIEW}/>
                        <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_500Medium', marginLeft:14, marginTop:8}}>{t('reviews')}</Text>
                        <View style={{flexDirection:'row', alignItems:'center', position:'absolute', right:0, top:16}}>
                            <Image style={{width:24, height:24, resizeMode:'contain'}} source={STAR}/>
                            <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_700Bold'}}>{responseData.StarRatingAmount}</Text>
                            <Text style={{color:'#667085', fontSize:12, fontFamily:'Inter_400Regular'}}> ({responseData.UserRatingCount})</Text>
                        </View>

                    </View>

                    {
                        responseData?.UserRatingResponseModels && responseData?.UserRatingResponseModels.map((item, index)=>(
                            <View key={index} style={{marginTop:24}}>
                                <View style={{width:'100%', height:1, backgroundColor:'#EAECF0', marginBottom: 24}}/>
                                <ListPic
                                    source={UserNoIMage}
                                />
                                <View style={{flexDirection:'row', position:'absolute', top:25, left:56}}>
                                    {Array.from({ length: item.StarCount }).map((_, starIndex) => (
                                        <Image
                                            key={starIndex}
                                            style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                            source={STAR}
                                        />
                                    ))}
                                </View>
                                <Text style={{marginTop:24, color:'#344054',fontSize:16, fontFamily:'Inter_400Regular'}}>{item.Review}</Text>
                            </View>
                        ))}
                </View>
            default:
                return null;
        }
    };



    const handleTabPress = (tab) => {
        setSelectedTab(tab);
        elementRef.current?.measureLayout(
            scrollViewRef.current,
            (x, y) => {
                scrollViewRef.current?.scrollTo({ y: y - 10, animated: true });
            },
            (error) => console.log(error)
        );
    };


    const getPhoneNumber = async () => {
        try {
            let phoneNumber;
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');

            phoneNumber = await GetApi(`${accEndpoints.get.ComProfPhoneNum}?userId=${responseData.Id}`, {
                headers: {
                    'Accept-Language': language,
                    ...headersTextToken.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setPhoneNumber(phoneNumber.PhoneNumber)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active' && navigation.isFocused()) {
                debouncedFetchData();
            }
        };

        const focusListener = navigation.addListener('focus', debouncedFetchData);
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);


        return () => {
            focusListener();
            appStateSubscription.remove();
            debouncedFetchData.cancel();
        };


    }, [debouncedFetchData, navigation]);


    const fetchData = useCallback(async () => {
        const language = await SecureStore.getItemAsync('userLanguage');
        setResponseData(null)
        try {
            let responseData;
            if (profileType) {
                const accessToken = await getAccessToken();
                responseData = await GetApi(accEndpoints.get.Profile, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else {

                responseData = await GetApi(`${accEndpoints.get.CommonProfile}?userName=${userName}&`, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                    },
                });


                if (orderStatus === 2 || orderStatus === 3){
                    const accessToken = await getAccessToken();
                    let carReview = await GetApi(`${accEndpoints.get.CheckForReviews}?userid=${responseData.Id}&orderId=${orderId}`, {
                        headers: {
                            'Accept-Language': language,
                            ...headersTextToken.headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setCanWriteReview(carReview)
                }

            }
            setResponseData(responseData);
            console.log(responseData?.UserDetail?.UserContacts); // Conditional chaining for safer access
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [profileType, userName]);

    const debouncedFetchData = useCallback(debounce(fetchData, 1000), [fetchData]);




    const createDate = new Date(responseData?.CreateDate);
    const year = createDate.getFullYear();

    const handlePressPhoneNumber = () => {
        if (!responseData?.IsPhoneNumberVerified) {
            navigation.navigate('VerifyPhoneNumber', { phoneNumber: responseData.PhoneNumber});
        }
    };
    if (fontsLoaded)  return (
        <ProfileContainer>
            {responseData ? <Container>
                <ScrollView ref={scrollViewRef}>
                    { profileType &&
                        <IconButton
                            rippleColor="rgba(128, 128, 128, 0.2)"
                            style={{position:'absolute', top:132, right:0 , zIndex:3}}
                            icon={SETTING}
                            iconColor={null}
                            size={40}
                            onPress={() =>  navigation.navigate('SettingsPage',{userData:responseData, setUserData:setResponseData})}
                        />}

                    <Image style={{height:120, width:'100%'}} source={BG}/>

                    <View style={{width:'100%', justifyContent:'center', alignItems:'center', marginTop:-71, marginBottom:50}}>
                        <Surface style={{width:142, height:142, backgroundColor:"#fff", borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                            {  responseData.ProfilePictureUrl !== null &&
                                <ProfilePic style={{width:135, height: 135}}
                                    source={{ uri: responseData.ProfilePictureUrl } ||  require("../../../assets/img/default_user.png")}
                                />}
                            {  responseData.ProfilePictureUrl == null &&
                                <ProfilePic style={{width:135, height: 135}}
                                    source={UserNoIMage}
                                />}
                        </Surface>
                        <ProfileName style={{fontFamily:'Inter_700Bold'}}>
                            {responseData.FirstName} {responseData.LastName}
                        </ProfileName>
                        <View style={{paddingHorizontal:16, marginVertical:24, gap:16, flexDirection:'row'}}>
                            <View style={{height:114,backgroundColor: '#F2F4F7', width:'32%', maxWidth:104, paddingHorizontal:8, paddingVertical:12, borderRadius:16,  alignItems:'center',}}>
                                <Image style={{width:24, height:24, resizeMode:'contain', marginTop:12}} source={PERSON}/>
                                <Text style={{fontSize:12, marginTop:12, fontFamily:'Inter_500Medium', color: '#475467'}}>
                                    {t('since')}
                                </Text>
                                <Text style={{color:'#101828', fontSize:20, fontFamily:'Inter_700Bold'}}>
                                    {year}
                                </Text>
                            </View>
                            <View style={{height:114,backgroundColor: '#F2F4F7', width:'32%', maxWidth:104, paddingHorizontal:8, paddingVertical:12, borderRadius:16,  alignItems:'center',}}>
                                <Image style={{width:24, height:24, resizeMode:'contain', marginTop:12}} source={CAR}/>
                                <Text style={{fontSize:12, marginTop:12, fontFamily:'Inter_500Medium', color: '#475467'}}>
                                    {t('rides')}
                                </Text>
                                <Text style={{color:'#101828', fontSize:20, fontFamily:'Inter_700Bold'}}>
                                    {responseData?.PerformedRides || 0}
                                </Text>
                            </View>
                            <View style={{height:114,backgroundColor: '#F2F4F7', width:'32%', maxWidth:104, paddingHorizontal:8, paddingVertical:12, borderRadius:16,  alignItems:'center',}}>
                                <Image style={{width:24, height:24, resizeMode:'contain', marginTop:12}} source={STAR}/>
                                <Text style={{fontSize:12, marginTop:12, fontFamily:'Inter_500Medium', color: '#475467'}}>
                                    {t('reviews')}
                                </Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{color:'#101828', fontSize:20, fontFamily:'Inter_700Bold'}}>{responseData.StarRatingAmount}</Text>
                                    <Text style={{fontSize:12, fontFamily:'Inter_400Regular', color: '#667085', marginTop:6}}> ({responseData.UserRatingCount})</Text>
                                </View>

                            </View>
                        </View>
                        <View style={{paddingHorizontal:16, width:'100%', alignItems:'center', height:70}}>
                            <IconView style={{ flexDirection: 'row', alignItems:'center'}}>
                                <Text style={{position:'absolute', fontSize:12, fontFamily:'Inter_500Medium', color: '#475467', top:12, left:16}}>{t('my_preferences')}</Text>
                                {responseData.UserDetail.UserDescriptionResponseModel.map(contact => (
                                    <View style={{marginTop:26}}   key={contact.Id}>
                                        <Icon
                                            key={contact.Id}
                                            source={iconMapping[contact.Name]}
                                            color='#7a7a7a'
                                            size={18}
                                        />
                                    </View>
                                ))}
                            </IconView>
                        </View>



                        {
                            !profileType &&

                            <View style={{width:'94%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:16, marginTop:24}}>
                            {/* <IconButton size={22} iconColor={'#FFFFFF'} style={{position:'absolute', zIndex:3, width:22, height:22, left:95, top:10 }} icon={'ARROW'}/> */}
                            <SearchBtn contentStyle={{ height: 48, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor: '#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                                       onPress={()=> navigation.navigate('ReportReason',{itemId:responseData.Id, navigation:navigation})}
                            >
                                <SearchBtnText style={{fontFamily:'Inter_600SemiBold', color:'#FFFFFF'}}>{t('report_user')}</SearchBtnText>
                            </SearchBtn>
                        </View>


                        }

                        {
                            canWriteReview &&

                            <View style={{width:'94%', backgroundColor:'#D0D5DD', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:16, marginTop:24}}>
                                <IconButton size={22} iconColor={'#344054'} style={{position:'absolute', zIndex:3, width:26, height:24, left:95, top:7 }} icon={CHAT}/>
                                <SearchBtn contentStyle={{ height: 48, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor: '#F2F4F7', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#D0D5DD' mode="text"
                                           onPress={()=> navigation.navigate('WriteReview',{itemId:responseData.Id, navigation:navigation, orderId:orderId})}
                                >
                                    <SearchBtnText style={{fontFamily:'Inter_600SemiBold', color:'#344054'}}>    {t('write_review')}</SearchBtnText>
                                </SearchBtn>
                            </View>

                        }




                        <View style={{ width:'100%', paddingHorizontal:14, paddingTop:26,}}>
                            <View ref={elementRef} style={{flexDirection:'row', height:48, width:'100%', backgroundColor:'#FFF', borderStyle:'solid', borderColor:'#EAECF0', borderWidth:1, paddingHorizontal:16, paddingTop:16, gap:16,

                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 0,
                                    height: 18,
                                },
                                shadowOpacity:  1,
                                shadowRadius: 20.00,
                                elevation: 24,


                            }}>

                                <TouchableHighlight
                                    style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'info' ? 2 : 0}}
                                    onPress={() => handleTabPress('info')}
                                    underlayColor='rgba(128, 128, 128, 0.5)'
                                >
                                    <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'info' ? '#FF5A5F' : '#667085'}}>
                                        {t('info')}
                                    </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'about_me' ? 2 : 0}}
                                    onPress={() => handleTabPress('about_me')}
                                    underlayColor='rgba(128, 128, 128, 0.5)'
                                >
                                    <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'about_me' ? '#FF5A5F' : '#667085'}}>
                                        { profileType? t('about_me'):`${t('about')}`}
                                    </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'cars' ? 2 : 0}}
                                    onPress={() => handleTabPress('cars')}
                                    underlayColor='rgba(128, 128, 128, 0.5)'
                                >
                                    <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'cars' ? '#FF5A5F' : '#667085'}}>
                                        {t('cars')}
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'reviews' ? 2 : 0}}
                                    onPress={() => handleTabPress('reviews')}
                                    underlayColor='rgba(128, 128, 128, 0.5)'
                                >
                                    <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'reviews' ? '#FF5A5F' : '#667085'}}>
                                        {t('reviews')}
                                    </Text>
                                </TouchableHighlight>
                            </View>
                            <ImageBackground
                                source={TicketIMage}
                                style={{flex:1, width:'101.90%', zIndex:2, height:45, marginLeft:'-1.9%', marginTop:0  }}
                                resizeMode="stretch"
                            />
                            <View style={{

                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 0,
                                    height: 3,
                                },
                                shadowOpacity:  0.18,
                                shadowRadius: 4.59,
                                elevation: 5,



                                backgroundColor: '#fff', borderStyle:'solid', borderColor:'#EAECF0', borderBottomWidth:1, borderLeftWidth:1, borderRightWidth:1, width:'100.2%', marginTop:-10, paddingHorizontal:16, borderBottomLeftRadius:20, borderBottomRightRadius:20, paddingBottom:16, marginBottom:60}}>
                                {renderContent()}
                            </View>

                        </View>

                    </View>

                </ScrollView>
            </Container> : <Loading/>
            }
            { profileType &&
                <Navigation navigation={navigation} activeButton={'Profile'}/>
            }

        </ProfileContainer>
    );
}
