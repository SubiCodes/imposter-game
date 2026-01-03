import { View, Text, Platform, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useGameStore } from './store/gameStore';
import { GameCategory } from './categories-topics/gameCategories';
import { CircleAlert } from 'lucide-react-native';

const Index = () => {
  const navigation = useNavigation();

  const gameCategories = useGameStore((state) => state.categories);
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>(
    gameCategories.filter(category => category !== "✏️ Custom")
  );

  const toggleCategory = (category: GameCategory) => {
    setSelectedCategories((prev) => {
      // Don't allow deselecting if it's the only selected category
      if (prev.length === 1 && prev.includes(category)) {
        return prev;
      }
      
      // If clicking Custom, deselect all others and only select Custom
      if (category === "✏️ Custom") {
        return prev.includes(category) ? [] : [category];
      }
      
      // If clicking any other category, remove Custom if it's selected
      const withoutCustom = prev.filter(c => c !== "✏️ Custom");
      
      // Toggle the clicked category
      return withoutCustom.includes(category)
        ? withoutCustom.filter(c => c !== category)
        : [...withoutCustom, category];
    });
  };

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
        <CardContent className='overflow-auto'>
          <ScrollView className='flex-col max-h-36 px-4 py-2 rounded-md border border-gray-200' persistentScrollbar={true}>
            {gameCategories.map((category) => (
              <View key={category} className="flex flex-row items-center gap-1 mb-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label
                  onPress={Platform.select({ native: () => toggleCategory(category) })}
                  htmlFor={category}>
                  {category}
                </Label>
              </View>
            ))}
            <View className='h-4'></View>
          </ScrollView>
        </CardContent>
        <CardFooter className='gap-2'>
            <CircleAlert className='mr-2' size={16} color='orange'/>
            <Text className='text-xs text-muted-foreground'>When Custom is selected, categories are disabled.</Text>
        </CardFooter>
      </Card>
    </SafeAreaView>
  )
}

export default Index