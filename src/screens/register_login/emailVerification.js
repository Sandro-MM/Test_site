import React, {useEffect} from 'react';
import {ContainerMid, ErrorText, ErrorView, LinkLogin, TitleLeft, XIcon} from "../../styles/styles";
import {Controller} from "react-hook-form";
import A2bInput from "../../components/formInput";
import {TextInputMask} from "react-native-masked-text";
import A2BNextIcon from "../../components/next_icon";
import {ActivityIndicator} from "react-native";
import {useTranslation} from "react-i18next";

export const EmailVerification = ({ control ,onSubmitCode, checkEmail, isLoading, errors,error, setError, navigation}) => {
    const { t } = useTranslation();

    useEffect(() => {
        checkEmail();
    }, []);

    return (
        <ContainerMid>
            <TitleLeft>{t('please_confirm_your_email')}</TitleLeft>
            <Controller
                control={control}
                render={({ field }) => (
                    <React.Fragment>
                        <A2bInput
                            placeholder={t("code")}
                            value={field.value}
                            onChangeText={(value) => field.onChange(value)}
                            variant ='default'
                            autoFocus={true} 
                            render={props => (
                                <TextInputMask
                                    {...props}
                                    type={'only-numbers'}
                                />
                            )}
                        />
                        {field.value.length > 5 && (
                            <A2BNextIcon onPress={onSubmitCode} />
                        )}
                    </React.Fragment>
                )}
                name="code"
                defaultValue=""
            />
            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
            {/*{(errors.code || error) && (*/}
            {/*    <ErrorView>*/}
            {/*        <ErrorText>{errors.code?.message || error}</ErrorText>*/}
            {/*        <XIcon*/}
            {/*            icon="window-close"*/}
            {/*            iconColor='#FFF'*/}
            {/*            size={20}*/}
            {/*            onPress={() => setError(null)}*/}
            {/*        />*/}
            {/*    </ErrorView>*/}
            {/*)}*/}
            <LinkLogin onPress={checkEmail}>{t("resend_code")}</LinkLogin>
        </ContainerMid>
    );
};

