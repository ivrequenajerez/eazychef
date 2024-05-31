import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import * as ImagePicker from "expo-image-picker";
import {
  deletePlato,
  getAllPosts,
  updatePlato,
  getAllIngredients,
} from "../lib/appwrite";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    prompt,
    creator: { username, avatar },
    ingredientes: { nombre_ingrediente },
  },
}) => {
  const [editingPlato, setEditingPlato] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [platos, setPlatos] = useState([]);
  const [play, setPlay] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form, setForm] = useState({
    title,
    video: null,
    thumbnail: null,
    prompt,
  });

  const handleDelete = async () => {
    await updatePlato($id, { title: title });
    await deletePlato($id);

    // Aquí podemos agregar lógica adicional, como actualizar la lista de platos en el estado padre
  };
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetchTasks();
    getAllIngredientsAqui();
  }, []);

  const fetchTasks = async () => {
    try {
      const platosList = await getAllPosts();
      setPlatos(platosList);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getAllIngredientsAqui = async () => {
    try {
      const ingredientsList = await getAllIngredients();
      setIngredients(ingredientsList);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const startEditing = (video) => {
    setEditingPlato(video);
    setEditingPlato(video.title);
  };

  const saveEditing = async () => {
    if (editingText.trim()) {
      setEditingPlato(video);

      const updatedPlato = {
        title: editingText,
        thumbnail: form.thumbnail.uri,
      };

      await updatePlato($id, updatedPlato);
      setEditingPlato(null);
      setEditingText("");
      setEditingImage(null);
      fetchTasks();
    }
  };

  const cancelEditing = () => {
    setEditingPlato(null);
    setEditingText("");
    setIsModalVisible(false);
  };

  const uploadImage = async (selectType) => {
    // Subir archivos de móvil y guardarlos en la BBDD, además de convertirlos en una URL
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if (result && !result.canceled) {
      setEditingImage(result);
    }
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14 ">
      <View className="flex-row gap-3 items-start">
        {/* Modal Para Editar Ingrediente */}
        <View>
          <Modal
            visible={isInfoVisible}
            onRequestClose={() => setIsInfoVisible(false)}
            animationType="slide"
            transparent={true}
          >
            <View className="flex-1 justify-center items-center w-full p-1 ">
              <View className="bg-white p-5 rounded-lg shadow-lg flex w-full justify-center items-center border border-dark">
                <View className="flex flex-row w-full justify-end">
                  <TouchableOpacity onPress={() => setIsInfoVisible(false)}>
                    <Image
                      source={icons.cerrar}
                      resizeMode="contain"
                      className="w-4 h-4"
                    />
                  </TouchableOpacity>
                </View>
                <View className="flex flex-row px-2 py-2">
                  <Text className="text-text font-psemibold text-xl">
                    Información sobre el plato
                  </Text>
                </View>
                <View className="flex flex-row px-2 pt-5 w-full">
                  <Text className="text-text font-psemibold text-lg">
                    {title}
                  </Text>
                </View>
                <View className="flex flex-row px-2 py-1 w-full">
                  <Text className="text-text font-pregular text-base">
                    {prompt}
                  </Text>
                </View>
                <View className="flex flex-row px-2 pt-5 w-full">
                  <Text className="text-text font-psemibold text-lg">
                    Ingredientes:
                  </Text>
                </View>
                <View className="flex flex-column px-2 py-1 w-full">
                  {platos.map((plato) => (
                    <View key={plato.$id}>
                      {plato.title === title && (
                        <View>
                          {plato.ingredientes.map((ingrediente, index) => (
                            <View
                              key={index}
                              className="flex flex-row px-2 py-1 w-full"
                            >
                              <Text className="text-text font-pregular text-sm">
                                {ingrediente.nombre_ingrediente}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View className="justify-center items-center flex-row flex-1">
          {/* Imagen de Perfil */}
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5 ">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          {/* Info de Plato y persona que lo publicó */}
          <TouchableOpacity className="justify-center flex-1 ml-3 gap-y-1">
            {/* Título */}
            <Text
              className="text-text font-psemibold text-sm"
              numberOfLines={2}
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
          </TouchableOpacity>
          {/* Icono de Más Info */}
          <TouchableOpacity
            onPress={() => setIsInfoVisible(true)}
            className="space-x-2 pr-5"
          >
            {/* ... Agregar: Si setIsModalVisible(true) Entonces poner el fondo de /home color oscuro */}
            <Image
              source={icons.info}
              resizeMode="contain"
              style={{ tintColor: "#524439" }}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          {/* Icono de Editar */}
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            {/* ... Agregar: Si setIsModalVisible(true) Entonces poner el fondo de /home color oscuro */}
            <Image
              source={icons.edit}
              resizeMode="contain"
              style={{ tintColor: "#B01716" }}
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
              <View className="flex-1 justify-center items-center w-full p-1 ">
                <View className="bg-white p-5 rounded-lg shadow-lg flex w-full flex-row justify-center items-center border border-dark">
                  {/* Aquí Debe hacer click y abrir la cámara para cambiar la thumbnail */}
                  <TouchableOpacity
                    className="border border-dashed mr-2 mt-4 "
                    onPress={() => uploadImage("image")}
                  >
                    {form.thumbnail ? (
                      <Image
                        source={{ uri: form.thumbnail.uri }}
                        className="w-20 h-20 rounded-xl "
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-20 h-20 px-4 bg-secondary-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                        <Image
                          source={icons.upload}
                          resizeMode="contain"
                          className="w-10 h-10 rounded-xl"
                          style={{ tintColor: "#524439" }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>

                  <FormField
                    placeholder={title}
                    value={editingText}
                    handleChangeText={setEditingText}
                    otherStyles="w-60 pr-2 mt-2"
                  />

                  <View>
                    <TouchableOpacity
                      className="items-end pb-5"
                      onPress={() => cancelEditing()}
                    >
                      <Image
                        source={icons.cerrar}
                        resizeMode="contain"
                        className="w-4 h-4"
                      />
                    </TouchableOpacity>
                    {editingText && (
                      <CustomButton
                        title="Guardar"
                        /* Al hacer click se debe Actualizar el title del plato */
                        handlePress={saveEditing}
                        containerStyles="mb-2 bg-success "
                        textStyles="text-xs justify-center items-center p-1"
                      />
                    )}
                    <CustomButton
                      title="Borrar"
                      /* Al hacer click se debe borrar */
                      handlePress={handleDelete}
                      containerStyles="mb-1 bg-warning w-16 "
                      textStyles="text-xs justify-center items-center p-1"
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
