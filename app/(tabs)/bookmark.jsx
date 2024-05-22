import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllIngredients } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

import { useGlobalContext } from "../../context/GlobalProvider";
import IngredienteCard from "../../components/IngredienteCard";

const Bookmark = () => {
  const { data: posts, refetch } = useAppwrite(getAllIngredients);
  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = async () => {
    setRefreshing(true);
    // Se muestran los items si hay items en la base de datos
    // Se refresca por si hay cambios
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <IngredienteCard image={item} />}
        ListHeaderComponent={() => (

          <View className="my-6 px-4 space-y-6 ">
            <View className="mb-3">
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

    </SafeAreaView>
  );
};

export default Bookmark;
