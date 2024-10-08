import React, {useEffect, useRef, useState} from 'react';
import {View, FlatList,TouchableWithoutFeedback} from 'react-native';
import useApiService, {accEndpoints, getAccessToken, headersTextToken} from "../../services/api";
import {
    AboutMe, Agreement,
    Container,
    ProfileAge,
    ReviewBtn,
    SurfaceArea,
    VehicleSubtitle
} from "../../styles/styles";
import {Icon} from "react-native-paper";
import DeleteConfirmationModal from "../../components/modal";
import {BackButton} from "../../components/backbutton";
import * as SecureStore from "expo-secure-store";
const Reviews = (props) => {
    const { PutApi } = useApiService();
    const { GetApi } = useApiService();
    const { PatchApi } = useApiService();
    const { DelApi } = useApiService();
    const { PostApi } = useApiService();
    const profileType = props.route.params.profileType;
    const profileName = props.route.params.profileName;
    const [responseData, setResponseData] = useState(null);
    const [visibleItemIndex, setVisibleItemIndex] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const aboutMeRefs = useRef([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const language = await SecureStore.getItemAsync('userLanguage');
                const accessToken = await getAccessToken();
                if (profileType === true) {
                const response = await GetApi(accEndpoints.get.UserReview, {
                    headers: {
                         'Accept-Language': language,
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(response.RatingReceived)
                setResponseData(response);
                }
                else {

                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const showDeleteModal = (index) => {
        setVisibleItemIndex(index);

        // Check if the AboutMe text does not fit on three lines
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


    const lineHeight = 17;

    const renderItem = ({ item, index }) => (
        <TouchableWithoutFeedback onPress={() => showDeleteModal(index)}>
            <SurfaceArea style={{ paddingTop: 15 }}>
                <AboutMe                       onTextLayout={(event) => handleAboutMeLayout(event, index)}
                                               style={{lineHeight:20}} numberOfLines={3} ellipsizeMode="tail">{item.Review}</AboutMe>
                <View style={{ width: '100%' }}>
                    <ReviewBtn contentStyle={{ height: 36, justifyContent: 'flex-start' }} mode="text">
                        <Icon
                            source="star"
                            color='#FF5A5F'
                            size={18}
                        />
                        <AboutMe>  {item.StarCount}    </AboutMe>
                    </ReviewBtn>
                    <AboutMe style={{ position: 'absolute', left: '75%', top: 8 }}> {formatDate(item.CreateDate)}</AboutMe>
                </View>
                {visibleItemIndex === index && isModalVisible && (
                    <DeleteConfirmationModal isVisible={true} onCancel={hideModal}>
                        <Agreement> {item.Review}</Agreement>
                    </DeleteConfirmationModal>
                )}
            </SurfaceArea>
        </TouchableWithoutFeedback>
    );


    const formatDate = (dateString) => {
        const options = { month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <Container >
            <BackButton navigation={props}/>
            <VehicleSubtitle style={{marginTop:30}}>
                {profileType === 'myProfile' ? 'My Reviews' : `${profileName}'s Reviews`}
            </VehicleSubtitle>
            <SurfaceArea  elevation={1}>
                <ReviewBtn contentStyle={{ height: 44, justifyContent: 'flex-start'}}  mode="text">
                    <Icon
                        source="star"
                        color='#FF5A5F'
                        size={20}
                    />
                    <ProfileAge>  {responseData?.AverageRating} ({responseData?.RatingCount}) Reviews</ProfileAge>
                </ReviewBtn>
            </SurfaceArea>
            <FlatList
                data={responseData?.RatingReceived?.Data || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </Container>
    );
};

export default Reviews
