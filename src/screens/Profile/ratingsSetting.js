import {FlatList, Image, Text, TouchableHighlight, TouchableWithoutFeedback, View} from 'react-native';
import * as React from "react";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {useEffect, useRef, useState} from "react";
import {
    AboutMe, Agreement,
    BtnTextAuth,
    ContainerTop, ListPic,
    RedBtn,
} from "../../styles/styles";
import Loading from "../../components/loading";
import LoadingSmall from "../../components/loading-small";
import DeleteConfirmationModal from "../../components/modal";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import STAR from "../../../assets/img/star.png";
import UserNoIMage from "../../../assets/img/default_user.png";

export default function RatingsSetting(props) {
    const { t } = useTranslation();

    const { GetApi } = useApiService();

    const [responseData, setResponseData] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isEndOfItems, setIsEndOfItems] = useState(false);
    const [activeColor, setActiveColor] = useState(1);
    const [visibleItemIndex, setVisibleItemIndex] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const aboutMeRefs = useRef([]);



    const showDeleteModal = (index) => {
        setVisibleItemIndex(index);
        const lines = aboutMeRefs.current[index];
        if (lines > 3) {
            setIsModalVisible(true);
        } else {
            setIsModalVisible(false);
        }
    };

    const hideModal = () => {
        setVisibleItemIndex(null);
        setIsModalVisible(false);
    };

    const handleAboutMeLayout = (event, index) => {
        const { lines } = event.nativeEvent;
        aboutMeRefs.current[index] = lines.length;
    };



    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString).toLocaleDateString('en-GB', options);

        // Manually replace the default delimiters with slashes
        return date.replace(/-/g, '/');
    };

    useEffect(() => {
        fetchData(1, 15,1);
    }, []);

    const renderItem = ({ item, index }) => (
            <View style={{justifyContent:'center', alignItems:'center', borderRadius:15, marginHorizontal:12, marginVertical:8,

            }}>

                <TouchableWithoutFeedback onPress={() => showDeleteModal(index)}>
                    <View style={{ backgroundColor:'white', borderRadius:15,  marginHorizontal:12, marginVertical:8, minHeight:72, paddingLeft: 16, paddingRight: 24,paddingTop:12, paddingBottom:12,

                        width:'100%',

                        shadowColor: "#000000",
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity:  0.18,
                        shadowRadius: 4.59,
                        elevation: 5

                    }}>
                        <AboutMe                       onTextLayout={(event) => handleAboutMeLayout(event, index)}
                                                       style={{lineHeight:21, fontSize:18, marginBottom:20}} numberOfLines={3} ellipsizeMode="tail">"{item.Review}"</AboutMe>

                        <View style={{width:'113%', marginLeft:-15, height:1, backgroundColor:'rgba(112,112,112,0.29)', marginVertical:10}}></View>


                        {
                            item.CreatedFor &&
                            <TouchableHighlight
                            onPress={()=>props.navigation.navigate('Profile',{userName:item.CreatedFor.UserName})}
                            style={{ height:50, marginBottom:0, width:'100%', marginTop:0}}
                            underlayColor="rgba(128, 128, 128, 0.2)">
                            <View style={{flexDirection:'row', height:40, width:'100%', marginBottom:-10}}>
                                { item.CreatedFor.ProfilePictureUrl !== null &&
                                    <ListPic
                                        source={{ uri:item.CreatedFor.ProfilePictureUrl}}
                                    />}
                                { item.CreatedFor.ProfilePictureUrl == null &&
                                    <ListPic
                                        source={UserNoIMage}
                                    />}
                                <View style={{ marginLeft:16, marginTop:5}}>
                                    <Text style={{fontSize:16, color:'#344054', fontFamily:'NotoSans_500Medium'}}>{item.CreatedFor.FirstName} {item.CreatedFor.LastName}</Text>
                                </View>

                            </View>
                        </TouchableHighlight>
                        }






                        <View style={{ width: '100%' }}>


                                <View style={{flexDirection:'row'}}>
                                    {Array.from({ length: item.StarCount }).map((_, starIndex) => (
                                        <Image
                                            key={starIndex}
                                            style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                            source={STAR}
                                        />
                                    ))}
                                </View>




                            <AboutMe style={{ position: 'absolute', left: '70%', top: 3 }}> {formatDate(item.CreateDate)}</AboutMe>
                        </View>
                        {visibleItemIndex === index && isModalVisible && (
                            <DeleteConfirmationModal isVisible={true} onCancel={hideModal}>
                                <Agreement> {item.Review}</Agreement>
                            </DeleteConfirmationModal>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
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
        setIsLoadingMore(false);
    };

    const toggleRideType =(number) =>{
        setResponseData(null)
        setActiveColor(number)
        fetchData(1, 15, number)
    }


    const fetchData = async (page, offset, type) => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const ulr = type === 1?  accEndpoints.get.UserReview : accEndpoints.get.UserSendReview
            const fetchedData = await GetApi(`${ulr}?Page=${page}&Offset=${offset}&sortingField=PickUpTime&sortDirection=1&MyOrderTypes=${type}`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(fetchedData.Rating.Data[0],'setResponseData')


            setResponseData(prevData => {
                if (page > 1) {
                    return {
                        ...prevData,
                        Data: [...prevData?.Data, ...fetchedData.Rating.Data],
                        Page: fetchedData.Page
                    };
                } else {
                    console.log(1)
                    const newData = fetchedData.Rating.Data;
                    const isLastPage = newData.PageCount === 1;
                    setIsEndOfItems(isLastPage);
                    return newData;
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    return (
        <View style={{flex:1}}>
            { responseData ?
                <ContainerTop>
                    <View style={{width:'100%', height:50, backgroundColor:'white', marginTop:35, flexDirection:'row'}}>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===1?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={() => toggleRideType(1)}>

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:18, fontWeight:'500', marginTop:8}}>{t('my_rating')}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===2?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.2)"
                            onPress={() =>toggleRideType(2)}>

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black', fontSize:18, fontWeight:'500', marginTop:8}}>{t('rating_given')}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <FlatList
                        style={{width:'100%', marginBottom:50}}
                        data={responseData}
                        renderItem={renderItem}
                        ListFooterComponent={() => (
                            <View style={{width:'100%', height:60, justifyContent:'center', alignItems:'center', marginTop:30}}>
                                {isLoadingMore && <LoadingSmall />}
                                {(!isLoadingMore && !isEndOfItems && responseData?.TotalItemCount > 0) && (
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
                        keyExtractor={(item) => item.CreateDate.toString()}
                    />
                </ContainerTop> : <Loading/>
            }
        </View>
    );
}
