import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const IngredienteCard = ({
  image: {
    nombre_ingrediente,
    imagen_ingrediente,
    cantidad,
    usuario: { username },
  },
  visible,
}) => {
  const [play, setPlay] = useState(false);
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const openPicker = async (selectType) => {
    // Subir archivos de móvil y guardarlos en la BBDD, además de convertirlos en una URL
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };
  const submit = async () => {
    if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
      return Alert.alert("Please fill in all the fields");
    }

    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Genial", "Ítem subido :)");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };
  const [elementVisible, setElementVisible] = useState(false);

  return (
    <SafeAreaView className="flex-col items-center px-4 mb-0 py-0 my-0">
      {elementVisible ? (
        <View className="py-0 my-0">
          <TouchableOpacity
            className="items-end"
            onPress={() => setElementVisible(!elementVisible)}
          >
            <Image
              source={icons.cerrar}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
          <Text className="text-2xl text-text font-psemibold">
            {nombre_ingrediente}
          </Text>
          <FormField
            title="Nombre del Item"
            value={form.title}
            placeholder="Añade un nombre descriptivo"
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-10"
          />

          <View className="mt-6 space-y-2">
            <Text className="text-base text-dark-100 font-pmedium">
              Sube un Vídeo del Ítem
            </Text>
            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <Video
                  source={{ uri: form.video.uri }}
                  className="w-full h-64 rounded-2xl"
                  resizeMode={ResizeMode.COVER}
                />
              ) : (
                <View className="w-full h-40 px-4 bg-secondary-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-primary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                      style={{ tintColor: "#524439" }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="mt-7 space-y-2">
            <Text className="text-base text-dark-100 font-pmedium">
              Añade una imagen de miniatura
            </Text>

            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-secondary-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                    style={{ tintColor: "#524439" }}
                  />
                  <Text className="text-sm text-dark-100 font-pmedium">
                    Escoge un archivo
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title="AI Prompt"
            value={form.prompt}
            placeholder="La descripción que usaste para crear el vídeo"
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Submit & Publish"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setElementVisible(true)}
          className="flex-row gap-3 items-start"
        >
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
              {/* Foto de Perfil de Usuario */}
              <Image
                source={{ uri: imagen_ingrediente }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>

            <View className="justify-center flex-1 ml-3 gap-y-1">
              {/* Nombre del Ingrediente*/}
              <Text
                className="text-text font-psemibold text-sm"
                numberOfLines={1}
              >
                {nombre_ingrediente}
              </Text>
              {/* Usuario que subió este Ingrediente*/}
              <Text
                className="text-xs text-dark-100 font-pregular"
                numberOfLines={1}
              >
                <Text>Añadido por {username}</Text>
              </Text>
            </View>
          </View>
          <View className="flex-row space-x-4">
            {/*<TouchableOpacity className="pt-2">
              <Image
                source={icons.menos}
                className="w-6 h-6"
                resizeMode="contain"
                style={{ tintColor: "#32211C" }}
              />
            </TouchableOpacity>*/}
            <View className="pt-2 justify-center items-center mb-39">
              {/* Indicador de cantidad de ingredientes que hay */}
              <Text className="justify-center items-center text-xl ">
                Hay {cantidad} items
              </Text>
            </View>
            {/*<TouchableOpacity className="pt-2">
              <Image
                source={icons.mas}
                className="w-6 h-6"
                resizeMode="contain"
                style={{ tintColor: "#32211C" }}
              />
            </TouchableOpacity>*/}
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default IngredienteCard;
