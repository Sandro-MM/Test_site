import {Image, ImageBackground, ScrollView, Text, TouchableHighlight, View} from 'react-native';
import {
    AboutMe,
    Container, ErrorText, ErrorView,
    ListPic, SearchBtn, SearchBtnText, XIcon,
} from "../../styles/styles";
import useApiService, { getAccessToken, headersTextToken, OrderEndpoints} from "../../services/api";
import {useEffect, useState} from "react";
import UserNoIMage from "../../../assets/img/default_user.png";
import {IconButton} from "react-native-paper";
import {
    ListDisplayMapping,
    OrderIconMapping,
} from "../../styles/vehicleMappings";
import Loading from "../../components/loading";
import GO from "../../../assets/img/chevron-right.png";
import BACK from "../../../assets/img/Button_back.png";
import CAR from "../../../assets/img/Car.png"
import TicketIMage from "../../../assets/img/tickett.png";
import DOT from "../../../assets/img/blue-big.png";


import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import {
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    useFonts
} from "@expo-google-fonts/noto-sans";

import DropShadow from "react-native-drop-shadow";

export default function Order({route}) {
    const { GetApi } = useApiService();
    const { DelApi } = useApiService();
    const { PostApi } = useApiService();
    const { t } = useTranslation();
    const { item } = route.params;
    const { destination } = route.params;
    const { navigation } = route.params;
    const [data, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [dissable, setDissable] = useState(false)

    let [fontsLoaded] = useFonts({
        NotoSans_400Regular, NotoSans_600SemiBold, NotoSans_500Medium,NotoSans_700Bold
    });

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const responseData = await GetApi(`${OrderEndpoints.get.order}?orderId=${item}&`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setResponseData(responseData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const onSubmit = async () => {
        const language = await SecureStore.getItemAsync('userLanguage');
        try {
            setDissable(true)
            setResponseData(null)
            const accessToken = await getAccessToken();
            if (accessToken === null){
                navigation.navigate('AuthScreen')
            }else {
                const orderId = await PostApi(`${OrderEndpoints.post.order}${item}/order-bind`, null, {
                    headers: {
                        'Accept-Language': language,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(orderId)
                fetchData();
            }

        } catch (error) {
            await fetchData();
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {

            setDissable(false)
        }
    };


    const cancelRide = async () => {
        try {
            setDissable(true)
            setResponseData(null)
            const accessToken = await getAccessToken();
            const orderId = await PostApi(`${OrderEndpoints.post.order}${item}/order-bind`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(orderId)
            fetchData();
        } catch (error) {
            await fetchData();
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {

            setDissable(false)
        }
    };

    const withdrawRide = async () => {
        const language = await SecureStore.getItemAsync('userLanguage');
        try {
            setDissable(true)
            setResponseData(null)
            const accessToken = await getAccessToken();
            const orderId = await DelApi(`${OrderEndpoints.delete.cancelRideRequest}`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            },  item);
            console.log(orderId)
            fetchData();
        } catch (error) {
            await fetchData();
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {

            setDissable(false)
        }
    };

    const deleteOrder = async () =>{
        const language = await SecureStore.getItemAsync('userLanguage');
        const accessToken = await getAccessToken();
        try{
            const fetchedData = await DelApi(`${OrderEndpoints.delete.cancelOrder}${item}/cancel-order?id=${item}`, {
                headers: {
                    'Accept-Language': language,
                    ...headersTextToken.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigation.navigate('RideHistory')
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        }

    }





    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    const formatDuration = (durationInMinutes) => {
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = Math.round(durationInMinutes % 60);
        return `${hours}h ${minutes}m`;
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const getOrderDescription = (orderDescriptionTypes) => {
        return orderDescriptionTypes.map(type => <Icon key={type.Id} id={type} />);
    };


    const Icon = ({ id }) => (
        <View style={{flexDirection:'row', height:25, marginVertical:7, width:'100%', marginLeft:-15, display:ListDisplayMapping[id.Id]}}>
            <IconButton
                style={{marginTop:0, marginBottom:0, height:20}}
                iconColor={'#667085'}
                size={20}
                icon={OrderIconMapping[id.Id]}
            />
            <Text style={{fontSize:16, color:'#667085', fontFamily:'NotoSans_500Medium', lineHeight:20}}>{t(id.Name)}</Text>
        </View>

    );


    if(fontsLoaded) return (
        <Container>

            { data &&
                <ScrollView>


                    <View style={{flex:1, paddingTop:'0'}}>
                        <View style={{ backgroundColor:'#FFF', height:50}}>
                            <IconButton
                                style={{position:'absolute', top: -5, left:0, zIndex:3}}
                                icon={BACK}
                                iconColor={null}
                                size={36}
                                onPress={() => navigation.navigate(destination)}
                            />
                            <Text  style={{textAlign:'center', fontFamily:'NotoSans_600SemiBold', fontSize:22, marginVertical:'2%'}}>{formatDate(data.PickUpTime)}</Text>
                        </View>

                        <View style={{marginHorizontal:14, marginTop:8, flex:1 }}>
                            <View
                                style={{flex:1, width:'100%', zIndex:10, backgroundColor:'#fff',   shadowColor: "#000000", borderStyle:'solid', borderColor:'#EAECF0', borderTopWidth:1, borderLeftWidth:1, borderRightWidth:1,
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity:  0.18,
                                    shadowRadius: 4.59,
                                    elevation: 5 }}
                            >

                                <View style={{flexDirection:'row'}}>
                                    <View style={{marginTop:8, marginLeft:12}}>
                                        <Text style={{fontFamily:'NotoSans_600SemiBold',color: '#1D2939', fontSize: 18, textAlign:'right', marginRight:20}}>{formatTime(data.PickUpTime)}</Text>
                                        <Text style={{color: '#667085', fontFamily:'NotoSans_500Medium', fontSize:14, marginTop:26}}>{formatDuration(data.Duration)}in</Text>
                                        <Text style={{color: '#667085', fontFamily:'NotoSans_500Medium', fontSize:12 }}>{data.Distnace} km</Text>
                                        <Text style={{fontFamily:'NotoSans_600SemiBold',color: '#1D2939', fontSize: 18, marginTop:16, textAlign:'right', marginRight:20}}>{formatTime(data.ArrivalTime)}</Text>
                                    </View>

                                    <View style={{width:20, height:'100%', paddingTop:24, paddingBottom:24, justifyContent:'center', alignItems:'center'}}>
                                        <Image style={{width: 18, height: 18}} source={DOT}/>
                                        <View style={{width:3, height:'80%', backgroundColor:'#0592FB', marginVertical:2, borderRadius:999}}/>
                                        <Image style={{width: 18, height: 18}} source={DOT}/>
                                    </View>

                                    <View style={{marginTop:4, marginLeft:10, width: '62%'}}>
                                        <TouchableHighlight   onPress={()=> navigation.navigate('MapPointViewScreen',{title:'Departure', startPoint:{latitude: data.DepartureLatitude, longitude: data.DepartureLongitude}, startAddress:data.Departure})}
                                                              underlayColor="rgba(128, 128, 128, 0.2)">
                                            <View>
                                                <IconButton
                                                    style={{position:'absolute', top: -8, right: -31, zIndex:3}}
                                                    icon={GO}
                                                    iconColor={'#EB2931'}
                                                    size={20}
                                                />
                                                <Text style={{color: '#1D2939', fontFamily:'NotoSans_700Bold', fontSize:18, paddingRight:'15%'}} numberOfLines={1}>{data.Departure}</Text>
                                                <Text style={{color: '#475467', fontFamily:'NotoSans_400Regular', fontSize:14, marginTop:-4}}>{data.DepartureParent}</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{marginTop:60}} onPress={()=> navigation.navigate('MapPointViewScreen',{title:'Destination', startPoint:{latitude: data.DestinationLatitude, longitude: data.DestinationLongitude}, startAddress:data.Destination})}
                                                            underlayColor="rgba(128, 128, 128, 0.2)">
                                            <View>
                                                <IconButton
                                                    style={{position:'absolute', bottom: -12, right: -31, zIndex:3}}
                                                    icon={GO}
                                                    iconColor={'#EB2931'}
                                                    size={20}

                                                />
                                                <Text style={{color: '#475467', fontFamily:'NotoSans_400Regular',  fontSize:14}}>{data.DestinationParent}</Text>
                                                <Text style={{color: '#1D2939', fontFamily:'NotoSans_700Bold',  fontSize:18, paddingRight:'15%', marginTop:-6}} numberOfLines={1}>{data.Destination}</Text>
                                            </View>
                                        </TouchableHighlight>

                                    </View>
                                </View>


                            </View>
                            <ImageBackground
                                source={TicketIMage}
                                style={{flex:1, width:'101.9%', height: 45, zIndex:10, marginLeft:'-2%', }}
                                resizeMode="stretch"
                            ></ImageBackground>
                            <View
                                style={{backgroundColor: '#fff', borderStyle:'solid', borderColor:'#EAECF0', borderBottomWidth:1, borderLeftWidth:1, borderRightWidth:1, width:'100%', marginTop:0, paddingHorizontal:'4%', borderBottomLeftRadius:20, borderBottomRightRadius:20, paddingBottom:3, marginBottom:60,

                                    shadowColor: "#000000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity:  0.18,
                                    shadowRadius: 4.59,
                                    elevation: 5

                                }}
                            >



                                <View style={{justifyContent:'space-between', flexDirection:'row', marginTop:-24}}>
                                    <Text style={{fontSize:20, fontWeight:'600', color:'#667085', marginTop:15, fontFamily:'NotoSans_600SemiBold'}}>
                                        {t('price_per_passenger')}
                                    </Text>
                                    <Text style={{fontWeight:'600', color:'#1D2939', fontSize:30, marginTop:15,}}>
                                        ₾ {data.Price}
                                    </Text>
                                </View>




                                <TouchableHighlight
                                    style={{ marginTop:16}}
                                    onPress={()=>navigation.navigate('Profile',{IsUserOrder: data.UserStatus, userName:data.User.UserName,  orderId:item, orderStatus:data.StatusId})}
                                    underlayColor="rgba(128, 128, 128, 0.2)"
                                >
                                    <View style={{flexDirection:'row', height:60, alignItems:'center'}}>
                                        { data.User.FileDownloadUrl !== null &&
                                            <ListPic
                                                source={{ uri: data.User.FileDownloadUrl}} style={{height: 55, width: 55}}
                                            />}
                                        { data.User.FileDownloadUrl == null &&
                                            <ListPic
                                                source={UserNoIMage} style={{height: 55, width: 55}}
                                            />}
                                        <View style={{ marginLeft:'4%',marginTop:8, flexDirection:'column', gap:3}}>
                                            <Text style={{color: '#344054',fontSize:17, fontFamily:'NotoSans_600SemiBold', fontWeight:600, marginBottom:4}}>{data.User.FirstName} {data.User.LastName}</Text>
                                            <View style={{flexDirection:'row', marginTop:-4}}>
                                                <Text style={{fontSize:14, color: '#475467',  fontFamily:'NotoSans_400Regular', fontWeight:400}}>
                                                    {data.User.StarRatingAmount}  </Text>
                                                <IconButton
                                                    style={{marginTop: -4, marginLeft:-12}}
                                                    iconColor='#FDB022'
                                                    size={18}
                                                    icon='star'
                                                />
                                                <Text style={{fontSize:18}}>
                                                    {data.User.PhoneNumber}  </Text>
                                            </View>
                                        </View>
                                        <IconButton
                                            style={{width:20, height:20, position:'absolute', top:4,right:-9}}
                                            iconColor={'#EB2931'}
                                            size={20}
                                            icon={GO}
                                        />
                                    </View>
                                </TouchableHighlight>

                                <AboutMe style={{ color:'#475467', fontFamily:'NotoSans_400Regular', marginTop:19, fontSize:17 ,fontStyle: 'italic'}}  numberOfLines={3} ellipsizeMode="tail">
                                “ {data?.Description || 'Empty'} ”
                                </AboutMe>
                                <View style={{width:'100%', height:1, backgroundColor:'#EAECF0', marginTop:16}}/>
                                <Text style={{fontSize:18, fontWeight:'600', color:'#667085', marginTop:16, fontFamily:'NotoSans_600SemiBold', marginBottom:10}}>
                                    {t('about_driver')}
                                </Text>
                                <View style={{flexDirection:'row'}}>
                                    <IconButton
                                        style={{width:22, height:22, marginTop:4, marginRight:12, marginLeft:0}}
                                        color='#667085'
                                        size={22}
                                        icon={CAR}
                                    />
                                    <View>
                                        <Text style={{color:'#344054', fontSize:17, marginTop: -4, fontFamily:'NotoSans_600SemiBold'}}>{data?.UserOrderCar?.Manufacturer.Name} {data?.UserOrderCar?.Model.Name}</Text>
                                        <Text style={{fontSize:15, color:'#667085', fontFamily:'NotoSans_400Regular', marginTop:-7}}>{data?.UserOrderCar?.Color.Name} </Text>
                                    </View>
                                </View>
                                <View style={{width:'100%', height:1, backgroundColor:'#EAECF0', marginTop:16}}/>
                                <View  style={{ width:'100%', justifyContent:'flex-start', marginTop:10, marginBottom:10}}>
                                    {getOrderDescription(data.OrderDescriptionTypeIds)}
                                </View>
                                {
                                    data?.ApprovePassangers?.length > 0 &&
                                    <View>
                                        <View style={{width:'100%', height:1, backgroundColor:'#EAECF0', marginBottom: 16}}/>
                                        <Text style={{fontSize:18, fontWeight:'600', color:'#667085', marginTop:-9,marginBottom:10, fontFamily:'NotoSans_600SemiBold'}}>
                                            {t('passengers')}
                                        </Text>
                                        { data?.ApprovePassangers?.map( (passenger, index) => (
                                            <TouchableHighlight
                                                key={index}
                                                onPress={()=>navigation.navigate('Profile',{IsUserOrder: (passenger?.PassangerProfileViewer || 2), userName:passenger.UserName, orderId:item})}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                            >
                                                <View style={{flexDirection:'row', height:60, alignItems:'center'}}>
                                                    { passenger.ProfilePictureUrl !== null &&
                                                        <ListPic
                                                            source={{ uri: passenger.ProfilePictureUrl}}
                                                        />}
                                                    { passenger.ProfilePictureUrl == null &&
                                                        <ListPic
                                                            source={UserNoIMage}
                                                        />}
                                                    <View style={{ marginLeft:'4%',marginTop:0}}>
                                                        <Text style={{color: '#344054',fontSize:16, fontFamily:'NotoSans_500Medium', fontWeight:500}}>{passenger.FirstName} {passenger.LastName.charAt(0)}.</Text>
                                                    </View>
                                                    <IconButton
                                            style={{width:20, height:20, position:'absolute', top:12,right:-9}}
                                            iconColor={'#EB2931'}
                                            size={20}
                                            icon={GO}
                                        />
                                                </View>
                                            </TouchableHighlight>
                                        ) ) }
                                    </View>
                                }
                                { data.PassengerCount > 0 && !data?.ApprovePassangers &&
                                    <View style={{marginBottom:20}}>
                                        <Text style={{color: '#667085',fontSize:16, fontFamily:'NotoSans_500Medium', fontWeight:500}}>{t('passengercount')}: {data?.PassengerCount}</Text>
                                    </View>
                                }

                            </View>

                        </View>
                    </View>


                </ScrollView>
            }
            {
                data == null  &&
                <Loading/>
            }


            { data && data?.UserStatus === 0 &&
                <View style={{width:'92%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:'4%', position:'absolute', bottom:2}}>
                    <SearchBtn disabled={dissable} contentStyle={{ height: 48, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                               onPress={onSubmit}>
                        <SearchBtnText style={{fontSize: 20, textAlign: 'center', fontFamily:'NotoSans_600SemiBold'}}>{t('ride')}</SearchBtnText>
                    </SearchBtn>
                </View>
            }
            {  data && (data?.UserStatus === 1) && (data.StatusId === 1) && data.PassengerCount === 0 &&
                <View style={{width:'92%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:'4%', position:'absolute', bottom:2}}>
                    <SearchBtn disabled={dissable} contentStyle={{ height: 48, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                               onPress={()=> deleteOrder()}>
                        <SearchBtnText style={{fontSize: 20, textAlign: 'center', fontFamily:'NotoSans_600SemiBold'}}>{t('cancel_order')}</SearchBtnText>
                    </SearchBtn>
                </View>
            }

            {  data && (data?.UserStatus === 1) && (data.StatusId === 1) && data.PassengerCount > 0 &&
                <View style={{width:'92%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:'4%', position:'absolute', bottom:2}}>
                    <SearchBtn disabled={dissable} contentStyle={{ height: 48, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                               onPress={()=> navigation.navigate('CancelReasonOwner',{navigation:navigation, itemId:item})}>
                        <SearchBtnText style={{fontSize: 20, textAlign: 'center', fontFamily:'NotoSans_600SemiBold'}}>{t('cancel_order')}</SearchBtnText>
                    </SearchBtn>
                </View>
            }


            {  data && data?.UserStatus === 2  &&
                <View style={{width:'92%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:'4%', position:'absolute', bottom:2}}>
                    <SearchBtn disabled={dissable} contentStyle={{ height: 48, width:'100%' , justifyContent: 'center', fontFamily:'NotoSans_600SemiBold'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                               onPress={()=> navigation.navigate('CancelReason',{navigation:navigation, itemId:item})}>
                        <SearchBtnText style={{fontSize: 20, textAlign: 'center'}}>{t('cancel_ride')}</SearchBtnText>
                    </SearchBtn>
                </View>
            }
            {  data && data?.UserStatus === 3 &&
                <View style={{width:'92%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:'4%', position:'absolute', bottom:2}}>
                    <SearchBtn disabled={dissable} contentStyle={{ height: 48, width:'100%' , justifyContent: 'center', fontFamily:'NotoSans_600SemiBold'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                               onPress={withdrawRide}>
                        <SearchBtnText style={{fontSize: 20, textAlign: 'center'}}>{t('withdraw_request')}</SearchBtnText>
                    </SearchBtn>
                </View>
            }
            {  data && data?.UserStatus === 4 &&
                <Text style={{fontSize: 20, textAlign: 'center', color: 'red',marginBottom: 10 }}>{t('ride_canceled')}</Text>
            }
            {  data && data?.UserStatus === 5 &&
                <Text style={{fontSize: 20, textAlign: 'center', color: 'red',marginBottom: 10 }}>{t('user_rejected')}</Text>
            }
        </Container>
    );
}
