import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import {createVideo} from '../../lib/appwrite';
import {useGlobalContext} from '../../context/GlobalProvider'

const Create = () => {
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
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
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
      return Alert.alert("Rellene todos los campos");
    }

    setUploading(true);

    try {
      await createVideo({
        ...form, userId: user.$id
      })

      Alert.alert('Plato Añadido', 'El plato se ha añadido correctamente')
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      })

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-text font-psemibold">Nuevo Plato para la Carta</Text>
        <FormField
          title="Nombre del Plato"
          value={form.title}
          placeholder="Añade un nombre descriptivo"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-dark-100 font-pmedium">
            Añade una imagen
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                  style={{ tintColor: "#658E93" }}
                />
                <Text className="text-sm text-dark-100 font-pmedium">
                  Escoge un archivo
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-6 space-y-2">
          <Text className="text-base text-dark-100 font-pmedium">
            Sube un Vídeo de la receta
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 border border-dashed border-black rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-losenebros justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                    style={{ tintColor: "#658E93" }}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="Descripción"
          value={form.prompt}
          placeholder="Palabras clave para el plato"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        {/* añadir ingredientes listando todos con la posibilidad de seleccionarlos para agregarlo */}
        <CustomButton
          title="Publicar"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
