import ImagePicker_ from 'react-native-image-picker';
import { strings } from '../strings';

export const ImagePicker = async () => {
    const options = {
        title: "",
        takePhotoButtonTitle: strings.takePhotoButtonTitle,
        chooseFromLibraryButtonTitle: strings.chooseFromLibraryButtonTitle,
        cancelButtonTitle: strings.cancel,
        mediaType: "photo",
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5
    }
    return await new Promise((resolve, reject) => {
        ImagePicker_.showImagePicker(options, ({ data, type, uri, error, didCancel }) => {
            if (error || didCancel) {
                reject(error || "user didCancel canceled image picker")
            } else {
                const imageObject = {
                    image: dataConverter(data),
                    ext: type.split('/')[1]
                }
                const imageSource = { uri: uri };
                resolve({ imageSource, imageObject })
            }
        })
    })
}

const dataConverter = (data) => `${(data).toString('base64')}`