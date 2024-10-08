import React, {useMemo} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {BtnTextAuth, ContainerMid, ContainerTop, RedBtn, Title} from "../../styles/styles";
import styled from "styled-components/native";
import {IconButton, Surface, } from "react-native-paper";
import {useTranslation} from "react-i18next";

const ImageUploadComponent = ({ setImages, images, removedImageIds, setRemovedImageIds }) => {
    const { t } = useTranslation();

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 2],
                quality: 1,
            });

            if (!result.canceled) {
                if (images.length < 5) {
                    const newImage = { id: null, url: result.assets[0].uri };
                    setImages([...images, newImage]);
                } else {
                    alert('You can only upload up to 5 images.');
                }
            }
        } catch (error) {
            console.error('ImagePicker Error: ', error);
        }
    };

    const removeImage = (index) => {
        const removedImage = images[index];
        if (removedImage.id) {
            setRemovedImageIds([...removedImageIds, removedImage.id]);
        }
        const newImages = images.slice(0, index).concat(images.slice(index + 1));
        setImages(newImages);
    };

    const memoizedImages = useMemo(() => {
        return images.map((image, index) => (
            <SurfaceImg key={index}>
                <AddImg key={index} source={{ uri: image.url }} index={index} />
                <IconButton
                    onPress={() => removeImage(index)}
                    index={index}
                    style={{ position: 'absolute', right: 20 }}
                    color="#1B1B1B"
                    size={30}
                    icon={'trash-can-outline'}
                />
            </SurfaceImg>
        ));
    }, [images]);

    return (
        <ContainerTop style={{paddingTop:50}}>
            <Title>{t('upload_photos_of_your_vehicle')}</Title>

            {memoizedImages}

            {images.length < 5 && (
                <RedBtn buttonColor="#FF5A5F" mode="contained" onPress={pickImage} style={{ marginTop: 15 }}>
                    <BtnTextAuth>{t('pick_an_image')}</BtnTextAuth>
                </RedBtn>
            )}
        </ContainerTop>
    );
};

const AddImg = styled.Image`
  height: 90px;
  width: 135px;
  padding: 0;
`;

 const SurfaceImg  = styled(Surface)`
  border-radius: 13px;
  padding: 10px 15px;
  margin: 3px 20px;
  background-color: #ffffff;
  justify-content: center;
  color: #1B1B1B;
  font-size: 22px;
  width: 98%;
`;

export default ImageUploadComponent;
