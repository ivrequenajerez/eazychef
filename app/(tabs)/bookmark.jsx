import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import EmptyState from "../../components/EmptyState";
import { createIngredient, getAllIngredients } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import IngredienteCard from "../../components/IngredienteCard";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  {
    /* Obtener Todos los Ingredientes */
  }
  const { data: posts, refetch } = useAppwrite(getAllIngredients);
  {
    /* Actualizar/Refrescar la página */
  }
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    // Se muestran los items si hay items en la base de datos
    // Se refresca por si hay cambios
    await refetch();
    setRefreshing(false);
  };

  {
    /* Mostrar u Ocultar la 'ventana' para añadir un ingrediente */
  }
  const [elementVisible, setElementVisible] = useState(true);

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
    /* 'Crear Ingrediente' */
  }

  const uploadImage = async (selectType) => {
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
  const submit = async () => {
    if (
      !form.nombre_ingrediente ||
      !form.imagen_ingrediente ||
      !form.medida ||
      !form.cantidad ||
      !form.precio_unidad ||
      !form.categoria ||
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

      Alert.alert("Producto Añadido", "El producto se ha añadido correctamente");
    } catch (error) {
      if (error.message.includes("the current user is not authorized")) {
        Alert.alert(
          "No tiene permiso",
          "No estás autorizado para crear un producto"
        );
      } else {
        Alert.alert("Error al crear el producto", error.message);
      }
    } finally {
      setForm({
        nombre_ingrediente: "",
        imagen_ingrediente: null,
        medida: "",
        cantidad: "",
        precio_unidad: "",
        categoria: "",
        ubicacion_almacen: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      
      {elementVisible ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <IngredienteCard image={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6 mb-[0px] pb-[0px] ">
              {/* Hacer que al scrollear el botón de añadir se quede fijo arriba... */}
              <View className="flex-row justify-end items-center mr-6">
                <TouchableOpacity onPress={() => setElementVisible(false)}>
                  <Image
                    source={icons.plus}
                    className="w-[36px] h-[36px]"
                    tintColor={"#995840"}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <Text className="text-center justify-center font-pbold text-dark text-2xl">
                  Almacén del Restaurante
                </Text>
                <Text className="text-center justify-center font-pregular text-dark ">
                  Gestiona el stock que hay en tu almacén 📦
                </Text>
              </View>
              {/** Añadir búsqueda de ingredientes por palabras clave */}
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No se han encontrado items!"
              subtitle="No se han creado items todavía..."
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ScrollView className="px-4 my-0 ">
          <TouchableOpacity
            className="items-end "
            onPress={() => setElementVisible(true)}
          >
            <Image
              source={icons.cerrar}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
          <View>
            <Text className="text-center justify-center font-pbold text-dark text-2xl">
              Añadir nuevo producto
            </Text>
          </View>
          <View className="mt-7 space-y-2">
            <Text className="text-base text-dark-100 font-pmedium">
              Añade una imagen
            </Text>

            <TouchableOpacity onPress={() => uploadImage("image")}>
              {form.imagen_ingrediente ? (
                <Image
                  source={{ uri: form.imagen_ingrediente.uri }}
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
          {/* Nombre del ingrediente */}
          <Text className="text-2xl text-text font-pextrabold mt-6">
            {form.nombre_ingrediente}
          </Text>
          <Text className=" text-text font-pregular py-0">
            {form.categoria}
          </Text>
          <FormField
            value={form.nombre_ingrediente}
            placeholder="Nombre del ingrediente o producto"
            handleChangeText={(e) =>
              setForm({ ...form, nombre_ingrediente: e })
            }
          />
          {/* FIN Nombre del ingrediente */}
          {/* -------------------------- */}
          {/* Categoría del ingrediente */}
          <FormField
            value={form.categoria}
            placeholder="Categoría del producto"
            handleChangeText={(e) => setForm({ ...form, categoria: e })}
          />
          {/* FIN Categoría del ingrediente */}
          <FormField
            value={form.cantidad}
            placeholder="Cantidad"
            handleChangeText={(e) => setForm({ ...form, cantidad: e })}
          />
          <FormField
            value={form.medida}
            placeholder="Cantidad (kg, l, ml...)"
            handleChangeText={(e) => setForm({ ...form, medida: e })}
          />
          <FormField
            value={form.precio_unidad}
            placeholder="Precio del producto"
            handleChangeText={(e) => setForm({ ...form, precio_unidad: e })}
          />
          <View className="space-y-2 mt-7">
            <FormField
              title={"¿A qué sección del almacén pertenece?"}
              value={form.ubicacion_almacen}
              placeholder="Ubicación en el almacén"
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Bookmark;
