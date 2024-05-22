import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || '')

  return (
    <View className="border-2 border-dark-200 w-full h-16 px-4 bg-primary-200 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-dark flex-1 font-pregular"
        value={query}
        placeholder={"Busca con palabras clave"}
        placeholderTextColor="#726357"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
      onPress={() => {
        if (!query) {
          return Alert.alert('No se ha ingresado búsqueda', "Por favor ingresa algo para buscarlo")
        }

        if (pathname.startsWith('/search')) router.setParams({query})
          else router.push(`/search/${query}`)
      }}
      >
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
          style={{ tintColor: "#524439" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
