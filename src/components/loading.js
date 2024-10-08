import {ActivityIndicator} from 'react-native';
import {ContainerMid} from "../styles/styles";


export default function Loading() {
    return (
        <ContainerMid>
            <ActivityIndicator animating={true} size={150} color='#FF5A5F' />
        </ContainerMid>
    );
}

