import {AppState, FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as React from "react";
import useApiService, {
    getAccessToken,
    NotificationEndpoints,

} from "../../services/api";
import {useCallback, useEffect, useState} from "react";
import {
    BtnTextAuth,
    ContainerTop,
    RedBtn, Subtitle,
} from "../../styles/styles";
import Loading from "../../components/loading";
import LoadingSmall from "../../components/loading-small";
import Navigation from "../../components/navigation";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import {debounce} from "lodash";
import INFO from "../../../assets/img/notification/info.png";
import REPORT from "../../../assets/img/notification/report.png";
import REVIEW from "../../../assets/img/notification/review.png";
import DRIVER from "../../../assets/img/notification/ride_update_driver.png";
import PASSENGER from "../../../assets/img/notification/ride_update_passinger.png";
import {
    NotoSans_400Regular,

    useFonts
} from "@expo-google-fonts/noto-sans";
import DeleteConfirmationModal from "../../components/modal";

const monthNames = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
};

export const getFormattedDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = monthNames[date.getMonth() + 1];
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
};
export const getStatusImg = (statusName) => {
    switch (statusName) {
        case 2:
            return DRIVER;
        case 3:
            return PASSENGER;
        case 4:
            return REVIEW;
        case 5:
            return REPORT;
        default:
            return INFO;
    }
};
export default function NotificationsScreen({navigation}) {

    const { GetApi } = useApiService();
    const { PatchApi } = useApiService();

    const { t } = useTranslation();
    const [responseData, setResponseData] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isEndOfItems, setIsEndOfItems] = useState(false);
    const [activeColor, setActiveColor] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const [modalMessage, setModalMessage] = useState('');

    let [fontsLoaded] = useFonts({
        NotoSans_400Regular
    });
    const showModal = (text) => {
        setModalVisible(true);
        setModalMessage(text)
    }

    const hideModal = () => setModalVisible(false);









    const renderItem = ({ item, index }) => (
        <TouchableHighlight style={{width:'100%'}} key={`${item.Id}_${index}`}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={()=>notificationAction(item.Id , item.Text,item.Type, item.Order)}
        >

            <View style={{ alignItems:'center', backgroundColor:'white', borderRadius:25,  marginHorizontal:20, marginVertical:8, flexDirection:'row', height:'auto', paddingLeft: 16, paddingRight: 24,paddingTop:10, marginVertical:6, paddingBottom:24,


                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity:  0.18,
                shadowRadius: 4.59,
                elevation: 7

            }}>
                <Image style={{width:48, height:48 }} source={getStatusImg(item.Type)}/>
                {!item.Seen &&  <View style={{position:'absolute', top:45, left:50, backgroundColor: '#FE2352', width: 16, height: 16, borderRadius:999, borderStyle:'solid', borderWidth:2, borderColor:'#fff'
                }}></View>}
                <Text style={{marginHorizontal:15, marginTop:10, paddingRight:20, fontFamily:'NotoSans_400Regular', fontSize:14}}> {item.Text}</Text>

                    <Text style={{marginHorizontal:15, marginTop:30, position:'absolute', bottom:4, right:0, color: '#7D848D', fontFamily:'NotoSans_400Regular', fontSize:14}}>{getFormattedDate(item.CreateDate)}</Text>

            </View>
        </TouchableHighlight>

    );

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        console.log(responseData.Page)
        const maxPage = responseData.PageCount;
        console.log(maxPage)

        if (responseData.Page < maxPage-1) {
            const nextPage = responseData.Page + 1;
            debouncedFetchData(nextPage, 15)
                .finally(() => setTimeout(()=>(setIsLoadingMore(false)),1000));
        } else if (responseData.Page === maxPage-1) {
            debouncedFetchData(maxPage, 15)
                .finally(() => setTimeout(()=>(setIsLoadingMore(false)),1000));
            setIsEndOfItems(true);
        }
    };

    const toggleRideType =(number) =>{
        setResponseData(null)
        setActiveColor(number)
            if (number === 1){
                debouncedFetchData(1, 15, number);
            }
    }


    const fetchData = useCallback(async (page, offset, type) => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await GetApi(`${NotificationEndpoints.Get}?Page=${page}&Offset=${offset}&`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setResponseData(prevData => {
                if (page > 1) {
                    return {
                        ...prevData,
                        Data: [...prevData.Data, ...fetchedData.Data],
                        Page: fetchedData.Page
                    };
                } else {
                    const newData = fetchedData;
                    const isLastPage = newData.PageCount === 1;
                    setIsEndOfItems(isLastPage);
                    return newData;
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    const debouncedFetchData = useCallback(debounce(fetchData, 1000), [fetchData]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active' && navigation.isFocused()) {
                debouncedFetchData(1, 15, 1); // Update with appropriate parameters if needed
            }
        };

        const focusListener = navigation.addListener('focus', () => debouncedFetchData(1, 15, 1));
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            focusListener();
            appStateSubscription.remove();
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData, navigation]);

    useEffect(() => {
        debouncedFetchData(1, 15, 1);
    }, [debouncedFetchData]);


    const readNotifications = async () => {
        try {
            const accessToken = await getAccessToken();
    const radNotification =  PatchApi(`${NotificationEndpoints.Read}`, null ,{
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            debouncedFetchData(1, 15, 1);
        }
    }
    const notificationAction = async (id, text, type, orderid) => {
        if (type === 2 || type === 3){
            navigation.navigate('Order',{item:orderid.Id, navigation:navigation,  destination:'RideHistory'})
        } else if (type === 4){
            navigation.navigate('RatingsSetting')
        } else if (type === 5){
            navigation.navigate('Passengers', {routeId:orderid.Id, routeStatus:'Manage', navigation:navigation})
        } else {
            debouncedFetchData(1, 15, 1);
        }

        try {
            const accessToken = await getAccessToken();
            const response =  PatchApi(`${NotificationEndpoints.ReadOne}${id}&`, null ,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }


    }



    if(fontsLoaded)  return (
        <View style={{flex:1}}>



            <DeleteConfirmationModal
                isVisible={isModalVisible}
                onCancel={hideModal}
            >
                        <View style={{padding:10, minHeight:180}}>
                           <Text>{modalMessage}</Text>
                        </View>
            </DeleteConfirmationModal>














            { responseData || activeColor === 2 ?
                <ContainerTop>
                    <View style={{width:'100%', height:50, backgroundColor:'white', marginTop:35, flexDirection:'row'}}>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===1?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={() => toggleRideType(1)}>

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:18, fontWeight:'500', marginTop:8}}>{t('notifications')}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===2?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={() => toggleRideType(2)}>
                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center',alignItems:'center', marginTop:8}}>
                                <Text style={{color:'black', fontSize:18, fontWeight:'500'}}>{t('chat')}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    {
                        activeColor === 1 &&
                        <TouchableHighlight
                            onPress={()=>readNotifications()}
                            style={{height:40, backgroundColor:'#fff', justifyContent:'center', alignItems:'center', width:'100%'}}
                            underlayColor="rgba(128, 128, 128, 0.2)">
                            <View>
                                <Text style={{color: '#EB6663', fontFamily:'NotoSans_400Regular', fontSize:14,}}>{t('mark_all_as_read')}</Text>
                            </View>
                        </TouchableHighlight>

                    }
                    {
                        activeColor === 1 &&
                    <FlatList
                        style={{width:'100%', marginBottom:50}}
                        data={responseData.Data}
                        renderItem={renderItem}
                        ListFooterComponent={() => (
                            <View style={{width:'100%', height:60, justifyContent:'center', alignItems:'center', marginTop:30}}>
                                {isLoadingMore && <LoadingSmall />}
                                {(!isLoadingMore && !isEndOfItems) && (
                                    <RedBtn
                                        style={{ position: 'absolute', bottom: 0, width:180 }}
                                        buttonColor='#FF5A5F'
                                        mode="contained"
                                        onPress={handleLoadMore}
                                    >
                                        <BtnTextAuth>{t('load_more')}</BtnTextAuth>
                                    </RedBtn>
                                )}
                            </View>
                        )}
                        keyExtractor={(item) => item.Id.toString()}
                    />
                    }
                    {
                        activeColor === 2 &&
                    <View style={{paddingTop:30}}>
                        <Subtitle>
                            {t('chat_will_add_soon')}
                        </Subtitle>
                    </View>
                    }
                </ContainerTop> : <Loading/>
            }
            {/*{error && <ErrorView style={{marginBottom:50}}>*/}
            {/*    <ErrorText>{error}</ErrorText>*/}
            {/*    <XIcon*/}
            {/*        icon="window-close"*/}
            {/*        iconColor='#FFF'*/}
            {/*        size={20}*/}
            {/*        onPress={() => setError(null)}*/}
            {/*    />*/}
            {/*</ErrorView>}*/}
            <Navigation navigation={navigation} activeButton={'NotificationsScreen'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
