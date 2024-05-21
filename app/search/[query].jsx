import {
  View,
  Text,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { getLatestPosts, searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(
    () => searchPosts(query)
  );
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-dark-100">
              Resultados de tu búsqueda
            </Text>
            <Text className="text-2xl font-psemibold text-black">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
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

export default Search;
