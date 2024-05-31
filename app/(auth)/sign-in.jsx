import { View, ScrollView, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import { images } from "../../constants";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import { getCurrentUser, signIn } from "../../lib/appwrite";

import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);

      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      //Alert.alert("Success", "User signed in succesfully!");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[82vh] px-4 my-6">
          <View className="w-full items-center">
            <Image
              source={images.logoOlivo}
              className="w-[250px] h-[65px]"
              resizeMode="contain"
            />
          </View>

          <View className="w-full items-center">
            <Text className="text-3xl text-black text-semibold mt-6 font-psemibold">
              Inicia sesión
            </Text>
            <Text className="text-1xl text-black text-extralight font-pextralight">
              Introduce tus datos para continuar
            </Text>
          </View>

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

          <CustomButton
            title="Entrar"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-dark-100 font-pregular">
              ¿No tienes una cuenta?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-black underline"
            >
              Regístrate
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
