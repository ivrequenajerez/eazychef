import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {images} from '../../constants'
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true);
    // recall our items -> if any items appear
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 },]}
        keyExtractor={(item) => item.$id}

        renderItem={({item}) => (
          <Text className="text-3xl">{item.id}</Text>
        )}

        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-dark-100">
                  Hola! Te damos la bienvenida
                </Text>
                <Text className="text-2xl font-psemibold text-black">
                  Ian Requena
                </Text>
              </View>

              <View className="mt-1.5">
                <Image 
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput/>

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-text text-lg font-pregular mb-3">
                Últimos Items
              </Text>

              <Trending posts={[{id: 1}, {id: 2}, {id: 3}] ?? []}/>



            </View>

          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState
            title="No se han encontrado items!"
            subtitle="No se han creado items todavía..."
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  );
};

export default Home;
