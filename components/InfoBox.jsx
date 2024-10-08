import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-sm text-dark-100 text-center font-pregular`}>{subtitle}</Text>
      <Text className={`text-text text-center font-psemibold ${titleStyles}`}>{title}</Text>
    </View>
  )
}

export default InfoBox