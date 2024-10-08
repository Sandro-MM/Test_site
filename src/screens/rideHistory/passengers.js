import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableHighlight, View} from "react-native";
import {Container, ListPic, Subtitle, Title} from "../../styles/styles";
import useApiService, { getAccessToken, headersText, OrderEndpoints} from "../../services/api";
import UserNoIMage from "../../../assets/img/default_user.png";
import {Divider, IconButton} from "react-native-paper";
import DeleteConfirmationModal from "../../components/modal";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import Loading from "../../components/loading";



export  const Passengers = ({route}) => {

    const { GetApi } = useApiService();
    const { PatchApi } = useApiService();
    const { DelApi } = useApiService();

    const { t } = useTranslation();
    const [responseData, setResponseData] = useState(null);
    const [isDelModalVisible, setDelModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(() => null);
    const {routeId} = route.params;
    const {routeStatus} = route.params;
    const {navigation} = route.params;
    useEffect(() => {
        fetchData(routeId);
    }, []);

    const showDelModal = (messege, action) => {
        setModalMessage(messege)
        setConfirmAction(() => action)
        setDelModalVisible(true);
    }
    const hideDelModal = () => setDelModalVisible(false);
    const fetchData = async (id) => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await GetApi(`${OrderEndpoints.get.getPassengerRequests}${id}`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setResponseData(fetchedData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const bindPassenger = async (id) => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await PatchApi(OrderEndpoints.patch.bind, {

                orderId: routeId,
                userId: id
            },{
                headers: {
                    ...headersText.headers,
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setResponseData(null)
            fetchData(routeId)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const rejectPassenger = async (id) => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await DelApi(`${OrderEndpoints.delete.cancelOrder}${routeId}?userId=${id}&`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setResponseData(null)
            fetchData(routeId)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const PassengerList = ({ title, data }) => {
        const [isSubtitlePressed, setIsSubtitlePressed] = useState(false);

        return(

            <View>
                {data && data.length > 0 &&
                    <TouchableHighlight
                        style={{ marginVertical: '1%' }}
                        onPress={() => setIsSubtitlePressed(!isSubtitlePressed)}
                        underlayColor="rgba(128, 128, 128, 0.2)"
                    ><View style={{flexDirection:'row'}}>
                        <IconButton style={{ position:'absolute', left:-10, top:5}} size={30} icon={isSubtitlePressed?'chevron-down':'chevron-up'}/>
                        <Subtitle style={{textAlign:'center', width:'100%', color: '#FF5A5F'}}>{title}</Subtitle>
                    </View>
                    </TouchableHighlight>
                }
                <View>
                    {data.length > 0 && !isSubtitlePressed && data.map(passenger => (
                        <TouchableHighlight
                            key={passenger.Id}
                            style={{ marginVertical: '1%' }}
                            onPress={() => navigation.navigate('Profile', { userName: passenger.UserName })}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                        >
                            <View style={{ flexDirection: 'row', marginLeft: 16, height: 60, alignItems: 'center', width: '100%' }}>
                                {passenger.ProfilePictureUrl ? (
                                    <ListPic
                                        source={{ uri: passenger.ProfilePictureUrl }}
                                    />
                                ) : (
                                    <ListPic
                                        source={UserNoIMage}
                                    />
                                )}
                                <View style={{ marginLeft: 16, marginTop: 10 }}>
                                    <Text style={{ fontSize: 16 }}>{passenger.FirstName} {passenger.LastName}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: "1.2%" }}>
                                        <Text style={{ fontSize: 18 }}>
                                            {passenger.RatingsCount || 0}  </Text>
                                        <IconButton
                                            style={{ marginTop: -8, marginLeft: -12 }}
                                            iconColor='#FDB022'
                                            size={25}
                                            icon='star'
                                        />
                                        <Text style={{ fontSize: 18 }}>
                                            {passenger.PhoneNumber}  </Text>
                                    </View>
                                </View>
                                {routeStatus === 'Manage' && data === responseData.PendingPassangers &&
                                    <IconButton
                                        onPress={() => showDelModal(  'are_you_sure_you_want_to_bind_this_passenger', () => bindPassenger(passenger.Id))}
                                        style={{ width: 35, height: 35, position: 'absolute', top: 6, right: 65 }}
                                        color='#1B1B1B'
                                        size={30}
                                        icon={'check'}
                                    />}
                                {routeStatus === 'Manage' && data === responseData.PendingPassangers &&
                                    <IconButton
                                        onPress={() => showDelModal('are_you_sure_you_want_to_reject_this_passenger', () => rejectPassenger(passenger.Id))}
                                        style={{ width: 35, height: 35, position: 'absolute', top: 6, right: 30 }}
                                        color='#1B1B1B'
                                        size={30}
                                        icon={'close'}
                                    />}
                                {routeStatus === 'Manage' && data === responseData.ApprovePassangers &&
                                    <IconButton
                                        style={{ width: 35, height: 35, position: 'absolute', top: 6, right: 30 }}
                                        color='#1B1B1B'
                                        size={30}
                                        icon={'account-check'}
                                    />}
                                {routeStatus === 'Manage' && data === responseData.CancelledPassangers &&
                                    <IconButton
                                        style={{ width: 35, height: 35, position: 'absolute', top: 6, right: 30 }}
                                        color='#1B1B1B'
                                        size={30}
                                        icon={'account-arrow-left'}
                                    />}
                                {routeStatus === 'Manage' && data === responseData.RejectedPassangers &&
                                    <IconButton
                                        style={{ width: 35, height: 35, position: 'absolute', top: 6, right: 30 }}
                                        color='#1B1B1B'
                                        size={30}
                                        icon={'account-cancel'}
                                    />}
                                <Divider style={{ width: '90%', marginBottom: '2%', position: 'absolute', bottom: -10, left: -15 }} horizontalInset={true} bold={true} />
                                <DeleteConfirmationModal
                                    isVisible={isDelModalVisible}
                                    onCancel={hideDelModal}
                                    confirmButton={{
                                        title: t('confirm'),
                                        onPress: async () => {
                                            hideDelModal();
                                            await confirmAction(passenger.Id);
                                        },
                                        color: 'red'
                                    }}
                                    cancelButton={{
                                        title: t('cancel'),
                                        onPress: hideDelModal,
                                        color: 'blue',
                                    }}
                                >
                                    <Subtitle>{t(modalMessage)}</Subtitle>
                                </DeleteConfirmationModal>
                            </View>
                        </TouchableHighlight>
                    ))}
                </View>
            </View>
        );
    }


    return (
        <Container style={{ justifyContent:'flex-start'}}>
            {
                responseData &&
            <Title style={{marginBottom:-40, marginTop:-30}}>{t(routeStatus === 'Manage'? 'manage_passengers':'view_passengers')} </Title>
            }


            {responseData?.PendingPassangers.length === 0 && responseData?.ApprovePassangers.length === 0 && responseData?.CancelledPassangers.length === 0 && responseData?.RejectedPassangers.length === 0 &&
                <View style={{}}>

                    <Subtitle style={{textAlign:'center', marginTop: 60 }}>{t('no_passengers')}</Subtitle>

                </View>}

            {
                responseData?
                    <ScrollView>
                    {responseData && responseData.PendingPassangers && (
                        <PassengerList data={responseData.PendingPassangers} title={t('pending')} />
                    ) }
                    {responseData && responseData.ApprovePassangers && (
                        <PassengerList data={responseData.ApprovePassangers} title={t('approved')} />
                    )}
                    {responseData && responseData.CancelledPassangers && (
                        <PassengerList data={responseData.CancelledPassangers} title={t('cancelled')} />
                    )}
                    {responseData && responseData.RejectedPassangers && (
                        <PassengerList data={responseData.RejectedPassangers} title={t('rejected')} />
                    )}
                </ScrollView>: <Loading/>
            }

        </Container>
    );
};


