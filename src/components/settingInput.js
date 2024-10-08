import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import A2bInput from "./formInput";
import {
    ContainerMid,
    ContainerTop,
    ErrorText,
    ErrorView,
    SmallBtnText,
    SmallRedBtn,
    Title,
    XIcon
} from "../styles/styles";
import {IconButton} from "react-native-paper";
import {useTranslation} from "react-i18next";

const SettingInput = (props) => {
    const { t } = useTranslation();
    const title = props.route.params.title;
    const name = props.route.params.name;
    const defaultValue = props.route.params.defaultValue;
    const control = props.route.params.control
    const handleSubmit = props.route.params.handleSubmit
    const [error, setError] = useState(null);


    const setErrorItem = async () => {
        const result = await handleSubmit();
        if (result.error === 'error') {
            setError(result.errorTitle);
        } else {
            setError(null);
        }
    };

    return (
        <ContainerTop style={{paddingTop:100}}>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => props.navigation.goBack()}
            />
            <Title>{t(title)}</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        autoFocus={true}
                        placeholder={` ${t('enter')} ${t(title)}`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name={name}
                defaultValue={defaultValue}
            />
            <SmallRedBtn style={{position:'absolute', bottom:7}} buttonColor='#FF5A5F' mode='contained' onPress={()=>setErrorItem()}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>
            {/*{error && (*/}
            {/*    <ErrorView>*/}
            {/*        <ErrorText>{error}</ErrorText>*/}
            {/*        <XIcon*/}
            {/*            icon="window-close"*/}
            {/*            iconColor='#FFF'*/}
            {/*            size={20}*/}
            {/*            onPress={() => setError(null)}*/}
            {/*        />*/}
            {/*    </ErrorView>*/}
            {/*)}*/}
        </ContainerTop>
    );
};

export default SettingInput;
