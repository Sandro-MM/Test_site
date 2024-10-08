import styled from 'styled-components/native';
import {Button, IconButton, Surface, TextInput} from "react-native-paper";

export const Container = styled.View`
    flex: 1;
    background-color: #F9FAFB;
    justify-content: center;
`;
export const Title = styled.Text`
    font-size: 30px;
    padding: 50px 30px;
    text-align: center;
    color: #1B1B1B;
    font-weight: 600;
`;
export const TitleLeft = styled.Text`
    font-size: 32px;
    padding-bottom: 50px;
    padding-left: 5%;
    width: 95%;
    text-align: left;
    color: #1B1B1B;
    font-weight: 600;
`;
export const TitleDesc = styled.Text`
    font-size: 30px;
    padding-bottom: 20px;
    padding-left: 5%;
    width: 95%;
    text-align: center;
    color: #1B1B1B;
    font-weight: 600;
`;
export const Subtitle = styled.Text`
    font-size: 22px;
    padding: 20px 40px;
    text-align: left;
    color: #1B1B1B;
    font-weight: 600;
`;
export const SimpleBtn = styled(Button)`
    justify-items: start;
    border-radius: 0;
    text-align: left;
    margin: 5px 0;
    width: 100%;
`;
export const BtnText = styled.Text`
    line-height:24px;
    color: #1B1B1B;
    font-size: 22px;
    padding: 0;
    margin: 0;
    font-weight: 400;
`;
export const BtnTextAuth = styled.Text`
    line-height: 22px;
    font-size: 20px;
    text-align: center;
    font-weight: 400;
`;
export const SubtitleLink = styled.Text`
    font-size: 18px;
    text-decoration: underline;
    padding: 0 40px;
    text-align: left;
    color: #FF5A5F;
    font-weight: 600;
`;
export const Link = styled.Text`
    font-size: 14px;
    text-decoration: underline;
    color: #FF5A5F;
    font-weight: 500;
`;
export const Agreement = styled.Text`
    font-size: 14px;
    font-weight: 500;
    padding: 0 40px 30px;
    text-align: left;
`;
export const ContainerMid = styled.View`
    flex: 1;
    background-color: #F9FAFB;
    align-items: center;
    justify-content: center;
    margin-top: -10%;
`;
export const ContainerTop = styled.View`
    flex: 1;
    background-color: #F9FAFB;
    align-items: center;
    margin-top: -10%;
`;

export const Logo = styled.Image`
    width: 90px;
    height: 52px;
    position: absolute;
    top: 10%;
`;
export const RedBtn = styled(Button)`
    height: 45px;
    padding-top: 5px;
    border-radius: 30px;
    margin-bottom: 20px;
    width: 80%;
`;
export const SmallRedBtn = styled(Button)`
    height: 45px;
    padding-top: 5px;
    border-radius: 30px;
    width: 50%;
`;

export const SmallBtnText = styled.Text`
    font-size: 19px;
    line-height: 22px;
    text-align: center;
    font-weight: 400;
`;
export const LgnText = styled.Text`
    font-size: 18px;
    text-align: center;
`;
export const FormInput = styled(TextInput)`
    background-color: #D8D9DA;
    height: 45px;
    padding-top: 5px;
    border-radius: 14px;
    margin-bottom: 20px;
    width: 85%;
`;
export const FormTxtArea = styled(TextInput)`
    background-color: #D8D9DA;
    min-height: 190px;
    border-radius: 14px;
    margin-bottom: 10px;
    width: 95%;
`;
export const LinkLogin = styled.Text`
    font-size: 14px;
    width: 85%;
    text-align: left;
    text-decoration: underline;
    color: #FF5A5F;
    font-weight: 500;
    padding-bottom: 30px;
`;
export const ErrorView = styled.View`
    display: flex;
    width: 100%;
    height: 80px;
    background-color: #FF5A5F;
    font-weight: 500;
`;
export const ErrorText = styled.Text`
    margin: auto;
    font-size: 20px;
    text-align: center;
    color: #FFFF;
    font-weight: 500;
`;
export const XIcon = styled(IconButton)`
    position: absolute;
    right: 0;
`;
export const NextIcon = styled(IconButton)`
    position: absolute;
    bottom: 1%;
    right: 1%;
`;
export const BackIcon = styled(IconButton)`
    position: absolute;
    bottom: 1%;
    left: 1%;
`;
export const SimpleBtnPadded = styled(Button)`
    justify-items: start;
    border-radius: 0;
    text-align: left;
    margin: 5px 0;
    padding: 0 15px;
    width: 100%;
`;

export const ListBtn = styled(Button)`
    justify-items:  center;
    border-radius: 0;
    margin: 5px 0;
    width: 100%;
`;
export const GenderBntText = styled.Text`
    line-height:24px;
    color: #1B1B1B;
    font-size: 20px;
    font-weight: 400;
`;
export const VehicleBntText = styled.Text`
    flex: 1;
    padding-top: 20px;
    padding-left: 30px;
    line-height:23px;
    color: #1B1B1B;
    font-size: 20px;
    font-weight: 400;
`;

export const ProfilePic = styled.Image`
    border-radius: 200px;
    height: 120px;
    width: 120px;
`;

export const HomeBg = styled.Image`
    position: absolute;
    top: 30px;
    width: 100%;
    height: 54.5%;
`;


export const ProfileContainer = styled.View`
    flex: 1;
    background-color: #F9FAFB;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;
export const ProfileView = styled.View`
    flex: 1;
    width: 100%;
`;

export const ProfileName  = styled.Text`
    margin-top: 24px;
    color: #101828;
    font-size: 24px;
`;
export const ProfileAge  = styled.Text`
    color: #2f2f2f;
    font-size: 18px;
    width: 100%;


`;
export const ProfileTop  = styled.View`
    margin-top: 0;
    flex: 1;
    align-items: center;
    flex-direction: row;
    color: #1B1B1B;
    font-size: 22px;
    width: 100%;

`;
export const ProfileMid  = styled.View`
    flex: 3;
    width: 100%;
    padding: 0 5px;
    align-items: center;
`;


export const ProfileTopName  = styled.View`
    margin-top: 25px;
    height: 110px;
    padding-left: 15px;
    flex: 2;
    flex-direction: column;
    color: #1B1B1B;
    font-size: 22px;
    width: 100%;
`;
export const ReviewBtn = styled(Button)`
    justify-items: start;
    border-radius: 0;
    text-align: left;
    width: 100%;
`;
export const SearchBtn = styled(Button)`
    margin-top: -2px;
    justify-items: start;
    border-radius: 0;
    text-align: left;
    width: 100%;
`;
export const AboutMe  = styled.Text`
    color: #2f2f2f;
    font-size: 16px;
    line-height: 18px;
    width: 100%;
    margin-bottom: 10px;
`;



export const ContactBtn = styled(Button)`
    margin: 0 10% ;
    justify-items: start;
    border-radius: 0;
    text-align: left;
    width: 90%;
`;
export const Rides  = styled.Text`
    color: #2f2f2f;
    font-size: 15px;
    font-weight: 400;
    width: 90%;
    margin-bottom: 10px;
    height: 60px;
`;
export const ProfileSocialMedia  = styled.View`
    height: 50px;
    justify-content: start;
    flex-direction: row;
    color: #1B1B1B;
    font-size: 22px;
    width: 100%;
`;
export const ProfileCar  = styled.View`
    height: 100%;
    justify-content: center;
    color: #1B1B1B;
    font-size: 22px;
    width: 100%;
`;

export const SurfaceArea  = styled(Surface)`
    border-radius: 13px;
    margin-bottom: 5px;
    padding: 0 10px;
    padding-top: 10px;
    background-color: #ffffff;
    justify-content: center;
    color: #1B1B1B;
    font-size: 22px;
    width: 99%;
`;

export const SearchSurface  = styled(Surface)`
    border-radius: 24px;
    height: 238px;
    padding-top: 5px;
    background-color: #ffffff;
    border: 1px solid #D0D5DD;

    align-items: center;
    color: #1B1B1B;
    font-size: 22px;
    width: 94%;
`;
export const SurfaceIcon  = styled(Surface)`
    border-radius: 15px;
    padding: 3px;
    margin: 3px;
    background-color: #ffffff;
    justify-content: center;
    color: #1B1B1B;
    font-size: 22px;
`;
export const IconView  = styled.View`
    width: 102%;
    height: 70px;
    padding: 12px 16px 12px 16px;
    gap: 12px;
    border-radius: 16px;
    background: #F2F4F7;
`;
export const VehiclePic = styled.Image`
    width: 100%;
    height: 65%;
    resize-mode: contain;
`;
export const SurfaceVehicle  = styled(Surface)`
    flex: 1;
    max-height: 60%;
    border-radius: 13px;
    margin: 5px;
    padding: 20px 10px;
    background-color: #ffffff;
    justify-content: center;
    color: #1B1B1B;
    font-size: 22px;
    width: 97%;
`;
export const VehicleInfo  = styled.View`
    margin-top: 12px;
    height: 30%;
    justify-content: start;
    color: #1B1B1B;
`;
export const VehicleContainer = styled.View`
    height: 100%;
    flex: 1;
    background-color: #F9FAFB;
    align-items: center;
    justify-content: center;
`;
export const TextRight  = styled.Text`
    position: absolute;
    color: #2f2f2f;
    top: 5px;
    right: 5px;
    font-size: 17px;
    font-weight: 500;
`;
export const VehicleName = styled.Text`
    font-size: 22px;
    text-align: left;
    color: #1B1B1B;
    font-weight: 600;
`;
export const VehicleColor  = styled.Text`
    color: #2f2f2f;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 5px;
`;
export const VehicleFuel = styled(Button)`
    margin: 15px 0;
    justify-items: start;
    border-radius: 0;
    text-align: left;
`;
export const VehicleSubtitle = styled.Text`
    font-size: 22px;
    padding: 5px 0;
    text-align: center;
    width: 50%;
    color: #1B1B1B;
    font-weight: 600;
`;
export const VehicleSubtitleContainer = styled.View`
    width: 100%;
    flex: 1;
    justify-content: space-between;
    padding: 0 0;
    max-height: 38px;
    flex-direction: row;
    color: #1B1B1B;
    font-weight: 600;
`;

export const ConfirmRedBtn = styled(Button)`
    height: 38px;
    border-radius: 30px;
    width: 130px;
    margin: 0 10px 5px;
`;
export const SmallConfirmText = styled.Text`
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-weight: 400;
`;
export const TitleAddVehicle = styled.Text`
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 32px;
    padding: 10px 0;
    padding-left: 5%;
    width: 95%;
    text-align: center;
    color: #1B1B1B;
    font-weight: 600;
`;
export const SettingsTitle = styled.Text`
    padding-left: 30px;
    line-height: 16px;
    margin-bottom: 4px;
    color: #565656;
    font-size: 15px;
    font-weight: 400;
`;
export const SettingsVal = styled.Text`
    line-height:23px;
    color: #1B1B1B;
    font-size: 20px;
    font-weight: 400;
`;

export const TitleMap = styled.Text`
    font-size: 24px;
    padding-bottom: 4px;
    padding-left: 5%;
    width: 95%;
    text-align: center;
    color: #1B1B1B;
    font-weight: 600;
`
export const MapRedBtn = styled(Button)`
    position: absolute;
    bottom: 160px;
    height: 45px;
    padding-top: 5px;
    border-radius: 30px;
    width: 50%;
`;

export const SearchText  = styled.Text`
    color: #969696;
    line-height: 30px;
    font-size: 22px;
    width: 100%;
`;

export const SearchBtnText  = styled.Text`
    padding-top: 8px;
    padding-bottom: 8px;
    height: 60px;
    color: #ffffff;
    text-align: center;
    font-size: 16px;
    line-height: 28px;
    width: 100%;
`;
export const SurfaceListItem  = styled.View`
    height: 260px;

    background-color: transparent ;
    justify-content: center;
    color: #1B1B1B;
    font-size: 22px;
    width: 100%;
`;

export const ListPlaces  = styled.Text`
    color: #1D2939;
    font-size: 18px;
`;
export const ListTime  = styled.Text`
    color: #1D2939;
    margin: 1px 0;
    font-size: 12px;

`;
export const ListPic = styled.Image`
    height: 46px;
    width: 46px;
    border-radius: 30px;
    margin-left: 0;
`;
