import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createIngredient, createVideo } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const IngredienteCard = ({
  image: {
    nombre_ingrediente,
    categoria,
    imagen_ingrediente,
    cantidad,
    medida,
    precio_unidad,
    ubicacion_almacen,
    usuario: { username },
  }
}) => {

  const [image, setImage] = useState();
  const uploadImage = async () => {
    try {
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
      Alert.alert("Error al subir la imagen" + error.message)
    }
  }

  const saveImage = async (imagen_ingrediente) => {
    try {
      // UPDATE - actualiza
      setImage(imagen_ingrediente);
    } catch (error) {
     throw error; 
    }
  }

  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);

  {/* initialState */}
  const [form, setForm] = useState({
    nombre_ingrediente: nombre_ingrediente,
    imagen_ingrediente: imagen_ingrediente,
    cantidad: cantidad,
    categoria: categoria,
    ubicacion_almacen: ubicacion_almacen,
  });

  const handleChangeText = (value, name) => {
    setForm({...form, [name]: value})
  }

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
        setForm({ ...form, imagen_ingrediente: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (
      !form.categoria ||
      !form.nombre_ingrediente ||
      !form.imagen_ingrediente ||
      !form.ubicacion_almacen
    ) {
      return Alert.alert("Todos los campos deben estar rellenos");
    }

    setUploading(true);

    try {
      // Intentamos crear o subir imagen
      await createIngredient({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Genial", "Ítem subido :)");
    } catch (error) {
      Alert.alert("Justo Aquí!", error.message);
    } finally {
      setForm({
        nombre_ingrediente: "",
        imagen_ingrediente: imagen_ingrediente,
        cantidad: 0,
        categoria: "",
        ubicacion_almacen: "",
      });

      setUploading(false);
    }
  };

  const [elementVisible, setElementVisible] = useState(false);

  return (
    <SafeAreaView className="flex-col px-4  ">
      {elementVisible ? (
        <View className="px-4 my-0 ">
          <TouchableOpacity
            className="items-end "
            onPress={() => setElementVisible(!elementVisible)}
          >
            <Image
              source={icons.cerrar}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
          {/* Nombre del ingrediente */}
          <Text className="text-3xl text-text font-pextrabold py-0">
            {nombre_ingrediente}
          </Text>
          <Text className=" text-text font-pregular py-0">{categoria}</Text>
          <FormField
            value={form.nombre_ingrediente}
            placeholder="Ingresa un nombre diferente"
            handleChangeText={(e) =>
              setForm({ ...form, nombre_ingrediente: e })
            }
          />
          {/* FIN Nombre del ingrediente */}
          {/* -------------------------- */}
          {/* Categoría del ingrediente */}
          <FormField
            value={form.categoria}
            placeholder="Cambia la categoría"
            handleChangeText={(e) => setForm({ ...form, categoria: e })}
          />
          {/* FIN Categoría del ingrediente */}
          {/* -------------------------- */}
          {/* Imagen del ingrediente 
          <View className="mt-7 space-y-2">
            <Text className="text-base text-dark-100 font-pmedium">
              Toca el recuadro para sustituir la imagen del producto:
            </Text>
            <TouchableOpacity
              className="border border-dashed"
              onPress={() => uploadImage()}
            >
              {
              
              form.imagen_ingrediente ? (
                <Image
                  source={form.imagen_ingrediente.uri}
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
          </View>*/}
          <View className="space-y-2 mt-7">
            <Text className="text-base text-dark font-pbold">Cantidad:</Text>
            <Text className="text-base text-dark-100 font-pmedium">
              {medida}Kg
            </Text>
          </View>
          <View className="space-y-2 mt-7">
            <Text className="text-base text-dark font-pbold">Precio:</Text>
          </View>
          <Text className="text-base text-dark-100 font-pmedium">
            {precio_unidad}€
          </Text>
          <View className="space-y-2 mt-7">
            <Text className="text-base text-dark font-pbold">Está en:</Text>
            <Text className="text-base text-dark-100 font-pmedium">
              {ubicacion_almacen}
            </Text>
            <FormField
              value={form.ubicacion_almacen}
              placeholder="Cambia la ubicación"
              handleChangeText={(e) =>
                setForm({ ...form, ubicacion_almacen: e })
              }
            />
          </View>
          <></>
          <CustomButton
            title="Aceptar"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setElementVisible(true)}
          className="flex-row gap-3 items-start items-center"
        >
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center ">
              {/* Foto del Ingrediente */}
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
              {/* Categoría del producto */}
              <Text
                className="text-xs text-dark-100 font-pregular"
                numberOfLines={1}
              >
                <Text>{categoria}</Text>
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
              {/* Cantidad en KG por ahora solo en KG */}
              <Text className="justify-center items-center text-xl ">
                {medida}Kg
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
