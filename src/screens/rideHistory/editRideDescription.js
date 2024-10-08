import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import {IconButton} from "react-native-paper";
import {ContainerMid, ContainerTop, SmallBtnText, SmallRedBtn, TitleDesc} from "../../styles/styles";
import A2btextarea from "../../components/a2btextarea";
import A2BNextIcon from "../../components/next_icon";
import {useTranslation} from "react-i18next";

const EditRideDescription = ({ navigation, route }) => {
    const { submit, value } = route.params;
    const [descValue, setValue] = useState(value);
    const { t } = useTranslation();

    return (
        <ContainerTop style={{paddingTop:80}}>
            <IconButton
                style={{position:'absolute', top:50, left:6, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <TitleDesc style = {{marginTop: 42}}>{t('add_details_about_your_ride')}</TitleDesc>
                    <A2btextarea
                        placeholder={`Enter description`}
                        value={descValue}
                        onChangeText={(newValue) => setValue(newValue)}
                        variant='default'
                    />
            <SmallRedBtn style={{position:'absolute', bottom:10}} buttonColor='#FF5A5F' mode='contained'  onPress={()=>{submit({Description:descValue}); navigation.goBack()}}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    );
};

export default EditRideDescription;
