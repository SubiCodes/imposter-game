import { View, Text, Platform } from 'react-native'
import React, { useLayoutEffect } from 'react'
import ThemeToggle from '@/components/ui/common/theme-toggle'
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Index = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View className='flex items-center justify-center bg-green-400 pt-10 pb-4'>
          <Text className='font-bold text-white text-4xl'>IMPOSTER GAME</Text>
        </View>
      ),
    });
  }, [navigation]);


  return (
    <SafeAreaView className='flex flex-1 overflow-auto px-2'>
      <Card className='border-gray-200'>
        <CardHeader>
          <CardTitle>Select Category / Categories</CardTitle>
          <CardDescription>Choose what the topic would be about!</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Card Content</Text>
        </CardContent>
      </Card>
    </SafeAreaView>
  )
}

export default Index