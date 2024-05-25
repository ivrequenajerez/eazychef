import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons, images } from "../constants";
import { ResizeMode, Video } from "expo-av";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import * as ImagePicker from "expo-image-picker";
import {
  deletePlato,
  updatePlato,
} from "../lib/appwrite";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
 
  const form = { title, thumbnail, video };

  const [play, setPlay] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

   {/*  */}
  const [platos, setPlato] = useState(video.title);

  const handleDelete = async () => {
    await updatePlato($id, { title: title });
    await deletePlato($id);

    // Aquí puedes agregar lógica adicional, como actualizar la lista de platos en el estado padre
  };

  const handleUpdate = async () => {
    // Lógica para actualizar el plato en la base de datos
    // Por ejemplo:
    // await updatePlato(plato.$id, { name: title });
  };

  const uploadImage = async () => {
    try {
      {
        /** Opción de Abrir La Cámara */
      }
      await ImagePicker.requestCameraPermissionsAsync();

      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // save image
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error al subir la imagen" + error.message);
    }
  };

  const saveChangesPlato = async () => {
    {
      /* Guardar los cambios realizados; actualizar la imagen y actualizar el nombre del plato */
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        {/** Si le das click a la tarjeta, se va a la info del plato */}
        <View className="justify-center items-center flex-row flex-1">
          {/* Imagen de Perfil */}
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          {/* Info de Plato y persona que lo publicó */}
          <View className="justify-center flex-1 ml-3 gap-y-1">
            {/* Título */}
            <Text
              className="text-text font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            {/* Nombre de Usuario */}
            <Text
              className="text-xs text-dark-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            {/* Si setIsModalVisible(true) Entonces poner el fondo de /home color oscuro */}
            <Image
              source={icons.edit}
              resizeMode="contain"
              style={{ tintColor: "#D68C45" }}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          {/* Modal para editar */}
          <View>
            <Modal
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}
              animationType="slide"
              transparent={true}
            >
              <View className="flex-1 justify-center items-center w-full p-3 ">
                <View className="bg-white p-5 rounded-lg shadow-lg flex w-full flex-row justify-center items-center">
                  {/* Aquí Debe hacer click y abrir la cámara para cambiar la thumbnail */}
                  <TouchableOpacity
                    className="border border-dashed mr-2"
                    onPress={() => uploadImage()}
                  >
                    {{ uri: thumbnail } ? (
                      <Image
                        source={{ uri: thumbnail }}
                        className="w-20 h-20 rounded-xl"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-16 px-4 bg-secondary-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                        <Image
                          source={icons.upload}
                          resizeMode="contain"
                          className="w-20 h-20 rounded-xl"
                          style={{ tintColor: "#524439" }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <FormField
                    placeholder={title}
                    value={title}
                    onChangeText={setPlato}
                    otherStyles="w-60 pr-5"
                  />
                  <View>
                    <CustomButton
                      title="Guardar"
                      /* Al hacer click se debe Actualizar el title del plato */
                      handlePress={() => setIsModalVisible(false)}
                      containerStyles="bg-success "
                      textStyles="text-xs p-2"
                    />
                    <CustomButton
                      title="Borrar"
                      /* Al hacer click se debe borrar */
                      handlePress={handleDelete}
                      containerStyles="mt-3 bg-warning "
                      textStyles="text-xs p-2"
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>

        <View className="pt-2">
          {/*<Image
            source={icons.menu}
            className="w-6 h-6"
            resizeMode="contain"
            style={{ tintColor: "#32211C" }}
          />*/}
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-"
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
