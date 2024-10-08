import {ActivityIndicator} from 'react-native';
import {ContainerMid} from "../styles/styles";


export default function LoadingSmall() {
    return (
        <ContainerMid>
            <ActivityIndicator animating={true} size={50} color='#FF5A5F' />
        </ContainerMid>
    );
}

