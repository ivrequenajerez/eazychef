import { View, FlatList, Image, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import { getUserPosts, listTeams, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import InfoBox from "../../components/InfoBox";

import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";

import { router } from "expo-router";

const Profile = () => {
  const [teamList, setTeamList] = useState([]);

  // Efecto para obtener la lista de equipos al cargar el componente
  useEffect(() => {
    // Función para obtener y actualizar la lista de equipos
    const fetchTeams = async () => {
      try {
        // Obtener la lista de equipos
        const result = await listTeams();
        // Actualizar el estado con la lista de equipos obtenida
        setTeamList(result.teams);
      } catch (error) {
        console.error("Error al obtener la lista de equipos:", error);
      }
    };

    // Llamar a la función para obtener la lista de equipos
    fetchTeams();
  }, []);

  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="title-lg"
            />
            <View className="w-40 justify-left mt-5 flex-row">
              <View className="w-300 px-3 ">
                {teamList.map((team) => (
                  <Text className="font-pbold" key={team.$id}>
                    {team.name}
                  </Text>
                ))}
              </View>
              <InfoBox
                title={posts.length || 0}
                subtitle="Platos"
                titleStyles="text"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No se han encontrado items!"
            subtitle="No se encontraron items para tu búsqueda :("
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
