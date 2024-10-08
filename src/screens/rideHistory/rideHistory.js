import {AppState, FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as React from "react";
import useApiService, { getAccessToken, headersTextToken, OrderEndpoints} from "../../services/api";
import {useCallback, useEffect, useState} from "react";
import {
    BtnTextAuth,
    ContainerTop,

    RedBtn, Subtitle,

} from "../../styles/styles";
import Loading from "../../components/loading";
import {IconButton} from "react-native-paper";
import LoadingSmall from "../../components/loading-small";
import Navigation from "../../components/navigation";
import DeleteConfirmationModal from "../../components/modal";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import NODATA from "../../../assets/img/no_rides.png";
import {debounce} from "lodash";

export default function RideHistory({navigation}) {
    const { GetApi } = useApiService();
    const { DelApi } = useApiService();
    const { t } = useTranslation();
    const [responseData, setResponseData] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isEndOfItems, setIsEndOfItems] = useState(false);
    const [activeColor, setActiveColor] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isDelModalVisible, setDelModalVisible] = useState(false);
    const [ModalStatus, setModalStatus] = useState(null);
    const [error, setError] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(() => null);
    const showModal = (id, status, HasPassanger) => {
        setModalVisible(true);
        console.log(HasPassanger)
        setModalStatus({id:id, status:status, HasPassanger:HasPassanger})
    }
    const showDelModal = (messege, action) => {
        setModalMessage(messege)
        setConfirmAction(() => action)
        setDelModalVisible(true);
        setModalVisible(false);
    }
    const hideModal = () => setModalVisible(false);
    const hideDelModal = () => setDelModalVisible(false);

    const getStatusStyles = (statusName) => {
        switch (statusName) {
            case 'Waiting To Start':
                return { textColor: '#f79009', backgroundColor: '#fef0c7' };
            case 'Done':
                return { textColor: '#4ca30d', backgroundColor: '#d7ffb8' };
            case 'Cancelled':
                return { textColor: '#f04438', backgroundColor: '#fee4e2' };
            case 'Cancelled By System':
                return { textColor: '#667085', backgroundColor: '#d0d5dd' };
            case 'In Progress':
                return { textColor: '#0088cc', backgroundColor: '#c9eeff' };
            case 'Pending Completion':
                return { textColor: '#00ac89', backgroundColor: '#afeee1' };
            default:
                return { textColor: 'black', backgroundColor: 'white' }; // Default style
        }
    };

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

    const getFormattedDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = monthNames[date.getMonth() + 1];
        const year = date.getFullYear().toString().substr(-2);
        return `${day}/${month}/${year}`;
    };


    const renderItem = ({ item, index }) => (
        <TouchableHighlight style={{width:'100%'}} key={`${item.Id}_${index}`}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={()=>navigation.navigate('Order',{item:item.Id, navigation:navigation,  destination:'RideHistory'})}>

            <View style={{justifyContent:'center', alignItems:'center', height: 100, backgroundColor:'white', borderRadius:23, marginTop: index === 0 ? 16 : 0, marginHorizontal:22, marginVertical:11,
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity:  0.18,
                shadowRadius: 4.59,
                elevation: 8}}>
                <Text style={{marginHorizontal:15, marginTop:12, fontSize:16}}> {getFormattedDate(item.PickUpTime)}</Text>
                <View  style={{width:'100%', flexDirection:'row', height:60, justifyContent:'space-between'}}>
                    <Text style={{marginHorizontal:15, marginTop:18, fontSize:16}}>{item.From || 'no item'}</Text>
                    <Text style={{marginHorizontal:15, marginTop:18, fontSize:16}}>{item.To|| 'no item'}</Text>
                </View>
                <Text style={{
                    marginTop:-10,
                    marginBottom:15,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 15,
                    color: getStatusStyles(item.Status.Name).textColor,
                    backgroundColor: getStatusStyles(item.Status.Name).backgroundColor
                }}>{item.Status.Name}</Text>
                {
                    activeColor !== 2 &&
                    <IconButton
                        style={{position:'absolute', top:-3, left:-10}}
                        icon={'dots-vertical'}
                        onPress={()=> showModal(item.Id, item.Status.Name, item.HasPassanger)}
                    />
                }
            </View>
        </TouchableHighlight>

    );

    const handleLoadMore = () => {
        console.log(responseData.Page)
        const maxPage = responseData.PageCount;
        console.log(maxPage)
        setIsLoadingMore(true);
        if (responseData.Page < maxPage-1) {
            const nextPage = responseData.Page + 1;
            debouncedFetchData(nextPage, 15)
                .finally(() => setIsLoadingMore(false));
        } else if (responseData.Page === maxPage-1) {
            debouncedFetchData(maxPage, 15)
                .finally(() => setIsLoadingMore(false));
            setIsEndOfItems(true);
        }
    };

    const toggleRideType =(number) =>{
        setResponseData(null)
        setActiveColor(number)
        debouncedFetchData(1, 15, number)
    }


    const fetchData = useCallback( async (page, offset, type) => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await GetApi(`${OrderEndpoints.get.userOrders}?Page=${page}&Offset=${offset}&sortingField=PickUpTime&sortDirection=1&MyOrderTypes=${type}`, {
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
                    console.log(newData,'  console.log(newData)')
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
                debouncedFetchData(1, 15, 1);
            }
        };
        const focusListener1 = navigation.addListener('focus', () => setResponseData(null));
        const focusListener = navigation.addListener('focus', () => debouncedFetchData(1, 15, 1));
        const focusListener2 = navigation.addListener('focus', () =>  setActiveColor(1));
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            focusListener1()
            focusListener();
            appStateSubscription.remove();
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData, navigation]);

    useEffect(() => {
        debouncedFetchData(1, 15, 1);
    }, [debouncedFetchData]);

    const deleteOrder = async (status) =>{
        console.log(status.HasPassanger)
        if (status.HasPassanger === false){
            const accessToken = await getAccessToken();
            try{
                const fetchedData = await DelApi(`${OrderEndpoints.delete.cancelOrder}${status.id}/cancel-order?id=${status.id}&`, {
                    headers: {
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } catch (error) {
                const errorTitle = error.response.data.detail;
                setError(errorTitle);
            }
        } else {
            navigation.navigate('CancelReasonOwner',{navigation:navigation, itemId:status.id})
        }
        setResponseData(null)
        setModalVisible(false)
        debouncedFetchData(1, 15, 1);
    }
    const startOrder = async (id) =>{
        const accessToken = await getAccessToken();
        console.log(id)
        try{
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await GetApi(`${OrderEndpoints.get.startOrder}${id}&`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }catch (error){
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        }
        setResponseData(null)
        setModalVisible(false)
        debouncedFetchData(1, 15, 1);
    }



    return (
        <View style={{flex:1}}>
            <DeleteConfirmationModal
                isVisible={isModalVisible}
                onCancel={hideModal}
            >
                {
                    ModalStatus?.status === 'Waiting To Start' ?
                        <View style={{marginTop:10,marginBottom:-10}}>
                            <TouchableHighlight style={{width:'100%'}}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                                onPress={()=>{ navigation.navigate('EditRide',{id:ModalStatus.id, navigation:navigation}); hideModal()}}>
                                <View style={{flexDirection:'row', height:50, alignItems:'center', borderRadius:30}}>
                                    <IconButton style={{marginLeft:17}} size={30} icon={'pencil'}/>
                                    <Text style={{fontSize:20, marginLeft:-10}}> {t('edit')}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={{width:'100%'}}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                                onPress={()=> showDelModal('are_you_sure_you_want_to_start_your_ride', () => startOrder(ModalStatus.id))}>
                                <View style={{flexDirection:'row', height:50, alignItems:'center', borderRadius:30}}>
                                    <IconButton size={40} icon={'play'}/>
                                    <Text style={{fontSize:20, marginLeft:-10}}> {t('start')}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={{width:'100%'}}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                                onPress={() => showDelModal('are_you_sure_you_want_to_delete_your_ride',



                                                    () => deleteOrder(ModalStatus))}


                            >
                                <View style={{flexDirection:'row', height:50, alignItems:'center', borderRadius:30}}>
                                    <IconButton style={{marginLeft:15}} size={30} icon={'trash-can'}/>
                                    <Text style={{fontSize:20, marginLeft:-10}}> {t('cancel_order')}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={{width:'100%'}}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                                onPress={()=> console.log(4)}>
                                <View style={{flexDirection:'row', height:50, alignItems:'center', borderRadius:30}}>
                                    <IconButton style={{marginLeft:15}} size={30} icon={'package-variant-closed'}/>
                                    <Text style={{fontSize:20, marginLeft:-10}}> {t('manage_packages')}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={{width:'100%'}}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                                onPress={()=> {   hideModal(); navigation.navigate('Passengers', {routeId:ModalStatus.id, routeStatus:'Manage', navigation:navigation});}}>
                                <View style={{flexDirection:'row', height:50, alignItems:'center', borderRadius:30}}>
                                    <IconButton style={{marginLeft:15}} size={30} icon={'account-group'}/>
                                    <Text style={{fontSize:20, marginLeft:-10}}> {t('manage_passengers')}</Text>
                                </View>
                            </TouchableHighlight>
                        </View> :  <View style={{marginTop:10,marginBottom:-10}}>
                            <TouchableHighlight style={{width:'100%'}}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                                onPress={()=> console.log(4)}>
                                <View style={{flexDirection:'row', height:50, alignItems:'center', borderRadius:30}}>
                                    <IconButton style={{marginLeft:15}} size={30} icon={'package-variant-closed'}/>
                                    <Text style={{fontSize:20, marginLeft:-10}}> {t('view_packages')}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={{width:'100%'}}
                                                underlayColor="rgba(128, 128, 128, 0.2)"
                                                onPress={()=> {   hideModal(); navigation.navigate('Passengers', {routeId:ModalStatus.id, routeStatus:'view', navigation:navigation});}}>
                                <View style={{flexDirection:'row', height:50, alignItems:'center', borderRadius:30}}>
                                    <IconButton style={{marginLeft:15}} size={30} icon={'account-group'}/>
                                    <Text style={{fontSize:20, marginLeft:-10}}> {t('view_passengers')}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                }
            </DeleteConfirmationModal>
            <DeleteConfirmationModal
                isVisible={isDelModalVisible}
                onCancel={hideDelModal}
                confirmButton={{
                    title: t('confirm'),
                    onPress: async () => {
                        hideDelModal();
                        await confirmAction(ModalStatus.id);
                    },
                    color: 'red',
                }}
                cancelButton={{
                    title: t('cancel'),
                    onPress: hideDelModal,
                    color: 'blue',
                }}
            >
                <Subtitle>{t(modalMessage)}</Subtitle>
            </DeleteConfirmationModal>
            { responseData ?
                <ContainerTop>
                    <View style={{width:'100%', height:50, backgroundColor:'white', marginTop:35, flexDirection:'row'}}>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===1?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={() => toggleRideType(1)}>

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:18, fontWeight:'500', marginTop:8}}>{t('my_rides')}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===2?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={() =>toggleRideType(2)}>

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center',alignItems:'center', marginTop:8}}>
                                <Text style={{color:'black', fontSize:18, fontWeight:'500'}}>{t('rides_taken')}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    {
                        responseData?.TotalItemCount === 0 &&

                        <View style={{width:'100%'}}>
                            <Image resizeMode={'contain'} style={{width:'100%', height:300}} source={NODATA}/>
                            <Text style={{textAlign:'center', width:'100%', fontSize:20, color:'rgb(56,56,56)', fontWeight:'400'}}>{t('no_orders_found')}</Text>
                        </View>

                    }
                    <FlatList
                        style={{width:'100%', marginBottom:70}}
                        data={responseData.Data}
                        renderItem={renderItem}
                        ListFooterComponent={() => (
                            <View style={{width:'100%', height:60, justifyContent:'center', alignItems:'center', marginTop:30}}>
                                {isLoadingMore && <LoadingSmall />}
                                {(!isLoadingMore && !isEndOfItems && responseData?.TotalItemCount > 0) && (
                                    <RedBtn
                                        style={{ position: 'absolute', bottom: -14, width:180 }}
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
                </ContainerTop> : <Loading/>
            }



            <Navigation navigation={navigation} activeButton={'RideHistory'}/>
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
