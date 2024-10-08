import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import {useContext} from "react";
import {ErrorContext} from "../components/errorContext";
import * as signalR from "@microsoft/signalr";
import {NotificationContext} from "../components/notificationCountContenxt";

const BASE_URL = 'https://api-a2b.azurewebsites.net/api/v1'

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
});

let isRefreshing = false;
let refreshingPromise = null;

export async function getAccessToken() {
    if (isRefreshing) {
        return refreshingPromise;
    }

    isRefreshing = true;
    refreshingPromise = (async () => {
        const PostApi = async (urlRoute, data, optParam) => {
            const route = BASE_URL + urlRoute;
            console.log(data);
            console.log(route);
            try {
                const response = await axios.post(route, data, optParam);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            // const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const expirationTime = await SecureStore.getItemAsync('accessTokenExpiration');
            const data = {
                AccessToken: accessToken,
                // RefreshToken: refreshToken
            };
            if (accessToken) {
                return accessToken;
            } else {
                // const newAccessToken = await PostApi(accEndpoints.post.Refresh, data);
                // if (newAccessToken) {
                //     const newExpirationTime = Date.now() + 30 * 60 * 1000;
                //     await SecureStore.setItemAsync('accessToken', newAccessToken.AccessToken);
                //     await SecureStore.setItemAsync('accessTokenExpiration', newExpirationTime.toString());
                //     // await SecureStore.setItemAsync('refreshToken', newAccessToken.RefreshToken);
                //     return newAccessToken.AccessToken;
                // }
                return null;
            }
        } catch (error) {
            return null;
        } finally {
            isRefreshing = false;
            refreshingPromise = null;
        }
    })();

    return refreshingPromise;
}

export const headers = {headers :{'accept': 'text/plain',
        'Content-Type': 'multipart/form-data'}};
export const headersText = {headers :{'accept': 'text/plain',
        'Content-Type': 'application/json'}};
export const headersTextToken = {headers :{'accept': 'text/plain',
        'Content-Type': 'application/json'}};
export const accEndpoints = {
    get:{
        Profile: '/account/profile',
        CommonProfile:'/account/commonprofile',
        ComProfPhoneNum:'/account/profile-phonenumber',
        UserReview:'/account/user-reviews',
        UserSendReview:'/account/user-send-reviews',
        ChangeLang:'/account/change-language/?language=',
        ActiveRidesNumber:'/account/ride-number',
        IsUserVerified:'/account/user-verification',
        NotificationStatus:'/usersettings/notification',
        CheckForReviews:'/userrating/check-reviews'
    },
    post:{
        ExpoPushToken:'/account/fcm-token?token=',
        Register: '/account/register',
        IsUserEmail:'/account/change-password',
        EmailVerifyPassReset:'/account/change-password',
        Login:'/account/login',
        Logout:'/account/logout',
        Refresh:'/account/refresh',
        CheckEmailExists:'/account/profile-email',
        RegEmailForReg:'/account/user-send-reviews',
        ActivateEmailForReg:'/account/activate-email',
        LoginWithFB:'/account/change-language',
        AddPhone:'/account/add-phone-number',
        VerifyPhone:'/account/verify-phone-number',
        CheckEmailForPassReset:'/account/is-user-email',
        VerifyEmailPassReset:'/account/verify-email',
        Report:'/reports/report-user',
        Review:'/userrating/create-rating'

    },
    put:{
        EditProfile:'/account/edit-profile-mobile',
        ChangePassword:'/account/change-password',

    },
    patch:{
        ResetPass:'/account/reset-password',
        IsRegEmail:'/account/is-registered-email',
        ValidateEmail:'/account/validate-email',
        ConfirmEmail:'/account/confirm-email',
        ConfirmPhone:'/account/confirm-phone-number',
        EditImage:'/file/change-user-profile-file',
        EditSocials:'/userdetails/edit-contact-types'
    },
    delete:{
        UserDel:'/account/user-deactivation'
    }
};
export const CarEndpoints = {
    get:{
        Cars: '/car',
        Car: `/car/`,
        Manufact:'/car/manufacturer-dropdown',
        Model:'/car/model-dropdown?id=',
        Plate:'/car-platenumber',
        Color:'/car/color-dropdown',
        Type:'/cardetails/cartype-dropdown',
        Fuel:'/cardetails/fueltype-dropdown'
    },
    post:{
        Car: '/car',
        AddPicture:'/file/add-car-files'
    },
    put:{
        Car: `/car/`

    },
    delete:{
        Car: `/car/`,
        Picture:'/file/'
    }
};
export const OrderEndpoints = {
    get:{
        maxPrice:'/order/orders_maxprice',
        orders:'/order/orders',
        order:'/order/orders-by-id',
        userOrders:'/order/user-orders',
        startOrder:'/order/start-order?orderId=',
        getPassengerRequests:'/order/order-passangers?orderId='
    },
    post:{
        createOrder:'/order/create-order',
        order:'/order/',
        cancelRide:'/order/cancel-ride?orderId=',
        cancelOrderOwnerReason:'/order/cancel-order'
    },
    put:{
        updateDetails:'/order/update-order-details-mobile/?orderId=',
        updateRoute:'/order/update-order-route-mobile?orderId='
    },
    patch:{
        bind:'/order/bind',
    },
    delete:{
        cancelOrder:'/order/',
        cancelRideRequest:'/order/cancel-ride-request?orderId='
    }
};

export const NotificationEndpoints ={
    NewNotification:'/notification/new-notification-count',
    Get:"/notification/notifications",
    Read:'/notification/mark-all-as-read',
    ReadOne:"/notification/notification?id="
}

const useApiService = () => {
    const { handleError } = useContext(ErrorContext);

    const PutApi = async (urlRoute, data, optParam) => {
        const route = BASE_URL + urlRoute;
        console.log(data);
        console.log(route);
        try {
            const response = await axios.put(route, data, optParam);
            console.log(response)
            return response.data;
        } catch (error) {
            handleError({type:'error',data:error});
            console.log(error);
            throw error;
        }
    };
    const PatchApi = async (urlRoute, data, optParam) => {
        const route = BASE_URL + urlRoute;
        console.log(data);
        console.log(route);
        try {
            const response = await axios.patch(route, data, optParam);
            console.log(response)
            return response.data;
        } catch (error) {
            handleError({type:'error',data:error});
            console.log(error);
            throw error;
        }
    };

    const GetApi = async (url, headers) => {
        const route = BASE_URL + url;
        console.log(route);
        try {
            const response = await axios.get(route, headers);
            console.log(response.data, 'response.data,');
            return response.data;
        } catch (error) {
            handleError({type:'error',data:error});
            console.error(error);
            throw error;
        }
    };

    const DelApi = async (url, headers, id) => {
        const route = BASE_URL + url + id;
        console.log(route);
        try {
            const response = await axios.delete(route, headers);
            console.log(response.data);
            return response.data;
        } catch (error) {
            handleError({type:'error',data:error});
            console.error(error);
            throw error;
        }
    };

    const PostApi = async (urlRoute, data, optParam) => {
        const route = BASE_URL + urlRoute;
        console.log(data,'hello');
        console.log(route);
        try {
            const response = await axios.post(route, data, optParam);
            console.log(response)
            return response.data;
        } catch (error) {
            handleError({type:'error',data:error});
            console.log(error)
            throw  error;
        }
    }




    return { PutApi, PatchApi, GetApi, DelApi, PostApi };
};


export  const connectSignalR = () => {
    const { handleError } = useContext(ErrorContext);
    const { setNotificationCount } = useContext(NotificationContext);


    const Connect = async () => {
        const url = 'https://api-a2b.azurewebsites.net/notificationsHub';
        const token = await SecureStore.getItemAsync('accessToken');
        const expoPushToken = await SecureStore.getItemAsync('expoPushToken');
        if (token) {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${url}?access_token=${token}`)
                .withAutomaticReconnect()
                .build();

            // Define handlers for the hub methods
            connection.on('ReceiveNotification', (message,type) => {
                handleError({type:'notification',data:{message:message, type:type}});
                console.log('Received message:', message);
                console.log('Received message:', type);
            });

            connection.on('NewNotificationCount', (count) => {
                setNotificationCount(count);
            });

            try {
                await connection.start();
                console.log('SignalR Connected');
            } catch (err) {

                console.error('Error connecting to SignalR:', err);
            }

            // Optionally handle connection closed or error events
            connection.onclose((error) => {

                console.error('SignalR connection closed:', error);
            });
        } else {
            console.error('Access token not available');
        }

        if (expoPushToken && token){
            try {
                const language = await SecureStore.getItemAsync('userLanguage');
                const response = await axios.post(`https://api-a2b.azurewebsites.net/api/v1/account/fcm-token?token=${expoPushToken}`,null, {headers:{ 'Accept-Language': language, Authorization: `Bearer ${token}`}
                });
                console.log(response)
                return response.data;
            } catch (error) {
                // handleError({type:'error',data:error});
                console.log(error)
                throw  error;
            }
        }


    };
    return { Connect };
};




export default useApiService;
