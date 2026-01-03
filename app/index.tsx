import { View, Text, Platform, StatusBar } from 'react-native'
import React, { useLayoutEffect } from 'react'
import ThemeToggle from '@/components/ui/common/theme-toggle'
import { useNavigation } from 'expo-router';

const Index = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          className='flex flex-row w-full items-center justify-end'
          style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
            paddingBottom: 15,
            paddingHorizontal: 15,
          }}>

          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              alignItems: 'center',
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
            }}
            pointerEvents="none"
          >
            <Text
              className='font-bold text-red-500 text-lg'
              numberOfLines={1}
            >
              Imposter Game
            </Text>
          </View>
          <View className='items-center justify-end'>
            <ThemeToggle />
          </View>
        </View>
      ),
    });
  }, [navigation]);


  return (
    <View>
      <Text>Index</Text>
    </View>
  )
}

export default Index