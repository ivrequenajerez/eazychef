import {
  View,
  Text,
  FlatList,
  Image, TouchableOpacity
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { getLatestPosts, getUserPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

import {useGlobalContext} from '../../context/GlobalProvider'
import { icons } from "../../constants";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts  } = useAppwrite(
    () => getUserPosts(user.$id)
  );

  const logout = () => {

  }

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
                source={{uri: user?.avatar}}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
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
