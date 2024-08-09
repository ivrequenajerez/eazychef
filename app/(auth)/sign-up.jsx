import { View, ScrollView, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";

import { useGlobalContext } from "../../context/GlobalProvider";

import { createUser } from "../../lib/appwrite";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    Rol: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función asíncrona submit al hacer click en el botón de Registrarse
  const submit = async () => {
    // Revisa si todos los campos están rellenos
    // Si alguno de los campos (username, email, password, Rol) están vacíos, muestra un alerta
    if (!form.username || !form.email || !form.password || !form.Rol) {
      Alert.alert("Error", "Por favor rellena todos los campos");
    }

    // se asigna a true indicando que se ha iniciado un proceso de envío
    setIsSubmitting(true);

    try {
      // Intenta crear un nuevo usuario con la información brindada en el formulario
      // 'createUser' es una función que se encuentra en el archivo 'appwrite.js' en la carpeta 'lib'
      const result = await createUser(
        form.email,
        form.password,
        form.username,
        form.Rol
      );

      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[82vh] px-4 my-6">
          <View className="w-full items-center">
            <Image
              source={images.logoEnebros}
              className="w-[250px] h-[65px]"
              resizeMode="contain"
            />
          </View>

          <View className="w-full items-center">
            <Text className="text-3xl text-black text-semibold mt-6 font-psemibold">
              Regístrate
            </Text>
          </View>

          <FormField
            title="Nombre"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Contraseña"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Puesto en Restaurante"
            value={form.Rol}
            handleChangeText={(e) => setForm({ ...form, Rol: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Registrarse"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-dark-100 font-pregular">
              ¿Ya tienes una cuenta?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-black underline"
            >
              Inicia Sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
