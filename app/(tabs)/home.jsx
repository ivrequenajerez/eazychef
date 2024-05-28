import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import {
  getAllPosts,
  getLatestPosts,
  listTeams,
  teams,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  /* Listar Teams - Roles */
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    // Función para obtener y actualizar la lista de equipos
    const fetchTeams = async () => {
      try {
        // Obtener la lista de equipos
        const result = await listTeams();

        console.log(result);
      } catch (error) {
        console.error("Error al obtener la lista de equipos:", error);
      }
    };

    // Llamar a la función para obtener la lista de equipos
    fetchTeams();
  }, []);
  /* FIN Listar Teams - Roles */

  // Contexto Global Datos de Usuario
  const { user, setUser, setIsLogged } = useGlobalContext();

  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

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
      <Modal className="text-dark text-xl bg-secondary">
        <Text>
          Hola
        </Text>
      </Modal>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-dark-100">
                  Hola! Te damos la bienvenida
                </Text>
                <Text className="text-2xl font-psemibold text-black">
                  {user?.username}
                </Text>
                <View>
                  {teamList.map((team) => (
                    <Text
                      className="text-xs font-pregular text-black"
                      key={team.$id}
                    >
                      {team.name}
                    </Text>
                  ))}
                </View>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-text text-lg font-pregular mb-3">
                Nuevos platos en la carta
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
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

export default Home;
