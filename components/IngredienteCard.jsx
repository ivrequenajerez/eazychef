import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import * as ImagePicker from "expo-image-picker";
import {
  createIngredient,
  createVideo,
  deleteIngredient,
  getAllIngredients,
  updateIngredient,
} from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const IngredienteCard = ({
  image: {
    $id,
    nombre_ingrediente,
    imagen_ingrediente,
    medida,
    cantidad,
    precio_unidad,
    categoria,
    ubicacion_almacen,
    usuario: { username },
  },
}) => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [elementVisible, setElementVisible] = useState(false);
  const [ingredientes, setIngrediente] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const ingredientesList = await getAllIngredients();
    setIngrediente(ingredientesList);
  };
  {
    /* initialState */
  }
  const [form, setForm] = useState({
    nombre_ingrediente: "",
    imagen_ingrediente: null,
    medida: "",
    cantidad: "",
    precio_unidad: "",
    categoria: "",
    ubicacion_almacen: "",
  });
  {
    /* Editar Ingrediente */
  }
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingTextCat, setEditingTextCat] = useState("");
  const [editingTextCant, setEditingTextCant] = useState("");
  const [editingTextMed, setEditingTextMed] = useState("");
  const [editingTextPrec, setEditingTextPrec] = useState("");
  const [editingTextUbi, setEditingTextUbi] = useState("");

  const startEditing = (image) => {
    setEditingIngrediente(image);
    setEditingText(image.nombre_ingrediente);
    setEditingTextCat(image.categoria);
    setEditingTextCant(image.cantidad);
    setEditingTextMed(image.medida);
    setEditingTextPrec(image.precio_unidad);
    setEditingTextUbi(image.ubicacion_almacen);
    setIsModalVisible(true);
  };

  const saveEditing = async () => {
    if (editingText.trim()) {
      if (editingIngrediente) {
        const updatedIngrediente = {
          nombre_ingrediente: editingText,
          categoria: editingTextCat,
          cantidad: editingTextCant,
          medida: editingTextMed,
          precio_unidad: editingTextPrec,
          ubicacion_almacen: editingTextUbi,
        };

        try {
          await updateIngredient($id, updatedIngrediente);
          setEditingIngrediente(null);
          setEditingText("");
          setEditingTextCat("");
          setEditingTextCant("");
          setEditingTextMed("");
          setEditingTextPrec("");
          setEditingTextUbi("");
          fetchTasks();
          setIsModalVisible(false); // Cierra el modal
        } catch (error) {
          console.error("Error updating ingredient:", error);
        }
      } else {
        console.error("No ingredient selected for editing.");
      }
    }
  };

  const cancelEditing = () => {
    setEditingIngrediente(null);
    setEditingText("");
    setEditingTextCat("");
    setEditingTextCant("");
    setEditingTextMed("");
    setEditingTextPrec("");
    setEditingTextUbi("");
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    if (editingIngrediente) {
      try {
        await deleteIngredient($id);
        setEditingIngrediente(null);
        setEditingText("");
        setEditingTextCat("");
        setEditingTextCant("");
        setEditingTextMed("");
        setEditingTextPrec("");
        setEditingTextUbi("");
        fetchTasks();
        setIsModalVisible(false); // Cierra el modal
      } catch (error) {
        console.error("Error deleting ingredient:", error);
      }
    } else {
      console.error("No ingredient selected for deleting.");
    }
  };

  {
    /* FIN Editar Ingrediente */
  }

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

      Alert.alert("Ítem subido", "El ítem se ha subido correctamente");
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

  const [imagen, setImage] = useState();
  const uploadImage = async () => {
    {
      /* Cambiar a que se pueda subir haciendo una foto con la cámara en el momento */
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, imagen_ingrediente: result.assets[0] });
      }
    }
  };
  const saveImage = async (imagen_ingrediente) => {
    try {
      // UPDATE - actualiza
      setImage(imagen_ingrediente);
    } catch (error) {
      throw error;
    }
  };

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

  const MemoizedImage = React.memo(function MemoizedImage({ imagen_ingrediente }) {
    return (
      <Image
        source={{ uri: imagen_ingrediente }}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
      />
    );
  });

  return (
    <SafeAreaView className="flex-col px-4 my-[-30px]">
      {/* + Info del Producto - Ventana Oculta por defecto */}
      {elementVisible ? (
        <View className="my-0 border border-secondary-200 rounded-xl px-4 py-5">
          {/* Botón para Cerrar Ventana de +info de Ingrediente */}
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
          {/* Nombre del producto */}
          <Text className="text-3xl text-text font-pextrabold py-0">
            {nombre_ingrediente}
          </Text>
          {/* Categoría del producto */}
          <Text className=" text-text font-pregular py-0">{categoria}</Text>

          {/* Imagen del producto */}
          <View className="mt-7 space-y-2">
            <Image
              source={{ uri: imagen_ingrediente }}
              resizeMode="contain"
              className="w-full h-64 rounded-2xl"
            />
          </View>

          {/* Cantidad Unidades del producto */}
          <View className="space-y-2 mt-7">
            <Text className="text-base text-dark font-pbold">Cantidad:</Text>
            <Text className="text-base text-dark-100 font-psemibold">
              {cantidad}{" "}
              <Text className="text-base text-dark-100 font-pmedium">
                Unidad(es)
              </Text>
            </Text>
          </View>

          {/* Cantidad del producto */}
          <View className="space-y-2 mt-7">
            <Text className="text-base text-dark font-pbold">Cantidad:</Text>
            <Text className="text-base text-dark-100 font-pmedium">
              {medida}{" "}
              <Text className="text-base text-dark-100 font-pmedium">
                x Unidad
                {/* Se podría intentar hacer la operación medida x cantidad = medida total */}
              </Text>
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
          </View>
          <></>
          <View className="flex-row justify-end">
            <TouchableOpacity key={ingredientes.id} onPress={() => startEditing(ingredientes)}>
              {/* Si setIsModalVisible(true) Entonces poner el fondo de /home color oscuro */}
              <Image
                source={icons.edit}
                resizeMode="contain"
                style={{ tintColor: "#658E93" }}
                className="w-10 h-10"
              />
            </TouchableOpacity>
          </View>
          <CustomButton
            title="Aceptar"
            handlePress={() => setElementVisible(!elementVisible)}
            containerStyles="mt-7"
            isLoading={uploading}
          />
          {/* Modal Para Editar Ingrediente */}
          <View>
            <Modal
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}
              animationType="slide"
              transparent={true}
            >
              <View className="flex-1 justify-center items-center w-full p-1 ">
                {editingIngrediente && (
                  <View className="bg-white p-5 rounded-lg shadow-lg flex w-full flex-row justify-center items-center border border-dark">
                    {/* Imagen del producto */}
                    <TouchableOpacity
                      /* Aquí Debe hacer click y abrir la cámara para cambiar la imagen del producto */
                      className="border border-dashed mr-3 mt-4"
                      onPress={() => uploadImage()}
                    >
                      {{ uri: imagen_ingrediente } ? (
                        <Image
                          source={{ uri: imagen_ingrediente }}
                          className="w-20 h-20 rounded-xl "
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-16 px-4 bg-secondary-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                          <Image
                            source={icons.upload}
                            resizeMode="contain"
                            className="w-20 h-20 rounded-xl"
                            style={{ tintColor: "#658E93" }}
                          />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Fields para editar */}
                    <View>
                      {/* Nombre del Producto */}
                      <FormField
                        placeholder="Nuevo nombre"
                        value={editingText}
                        handleChangeText={setEditingText}
                        otherStyles="w-60 pr-2 mt-2"
                      />

                      {/* Categoría del Producto */}
                      <FormField
                        placeholder="Nueva categoría"
                        value={editingTextCat}
                        handleChangeText={setEditingTextCat}
                        otherStyles="w-60 pr-2 mt-2"
                      />

                      {/* Cantidad del Producto */}
                      <FormField
                        placeholder="Nueva cantidad"
                        value={editingTextCant}
                        handleChangeText={setEditingTextCant}
                        otherStyles="w-60 pr-2 mt-2"
                      />

                      {/* Cantidad medidas del Producto */}
                      <FormField
                        placeholder="Nueva medida"
                        value={editingTextMed}
                        handleChangeText={setEditingTextMed}
                        otherStyles="w-60 pr-2 mt-2"
                      />

                      {/* Precio del Producto */}
                      <FormField
                        placeholder="Nuevo precio"
                        value={editingTextPrec}
                        handleChangeText={setEditingTextPrec}
                        otherStyles="w-60 pr-2 mt-2"
                      />

                      {/* Ubicación del Producto en Almacén físico */}
                      <FormField
                        placeholder="Nueva ubicación"
                        value={editingTextUbi}
                        handleChangeText={setEditingTextUbi}
                        otherStyles="w-60 pr-2 mt-2"
                      />
                    </View>

                    {/* Botones para Guardar el Producto y para Borrar el Producto */}
                    <View>
                      <TouchableOpacity
                        className="items-end pb-5"
                        onPress={cancelEditing}
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
                          /* Al hacer click se debe Actualizar el nombre del ingrediente */
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
                )}
              </View>
            </Modal>
          </View>
        </View>
      ) : (
        /* Lista de Productos en el Almacén del Restaurante */
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setElementVisible(true)}
          className="flex-row gap-3 items-center pb-[10px] border-b border-losenebros [h-80px] w-full px-4"
        >
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[66px] h-[66px] rounded-lg border border-losenebros justify-center items-center ">
              {/* Foto del Ingrediente */}
              <MemoizedImage imagen_ingrediente={imagen_ingrediente} />
            </View>

            <View className="justify-center flex-1 ml-3 gap-y-1">
              {/* Nombre del Ingrediente*/}
              <Text
                className="text-text font-psemibold text-sm"
                numberOfLines={2}
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
            <View className="pt-2 justify-center items-center mb-39">
              <Text className="justify-center items-center text-xl ">
                {cantidad} Unidad(es)
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default IngredienteCard;
