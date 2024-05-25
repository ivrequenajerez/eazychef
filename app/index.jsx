import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";

import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  return (
    // Color de fondo sea el color "primary"
    // altura completa
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            className="w-[150px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              Una gestión organizada del restaurante con{" "}
              <Text className="text-secondary-100">Eazy Chef</Text>
            </Text>
          </View>

          <Text className="text-sm font-pregular text-text mt-7 text-center">
            Donde la creatividad se encuentra con la innovación: un
            viaje de exploración ilimitada con Eazy Chef
          </Text>

          <CustomButton
            title="Continúa con tu Email"
            // Al presionar el botón navegas hasta la ventana 'sign-in'
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
