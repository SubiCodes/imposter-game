import { View, Text as RNText, Platform, ScrollView, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { Text } from '@/components/ui/text';
import useGameStore from './store/gameStore';
import { GameCategory } from './categories-topics/gameCategories';
import { CircleAlert } from 'lucide-react-native';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

interface GamePayload {
  categories: string[];
  customTopics?: string[];
  players: string[];
  clue: boolean;
  timeInMs: number;
}

// Helper function to convert time string to milliseconds
function timeToMilliseconds(time: string): number {
  const [minutes, seconds] = time.split(':').map(Number);
  return (minutes * 60 + seconds) * 1000;
}

const Index = () => {
  const navigation = useNavigation();

  const gameCategories = useGameStore((state) => state.categories);
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>(
    gameCategories.filter(category => category !== "✏️ Custom")
  );
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');

  const addTopic = () => {
    const trimmedTopic = currentTopic.trim();
    if (trimmedTopic && !customTopics.includes(trimmedTopic)) {
      setCustomTopics((prev) => [...prev, trimmedTopic]);
      setCurrentTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setCustomTopics((prev) => prev.filter(t => t !== topic));
  };

  const addPlayer = () => {
    const trimmedPlayer = currentPlayer.trim();
    if (trimmedPlayer && !players.includes(trimmedPlayer)) {
      setPlayers((prev) => [...prev, trimmedPlayer]);
      setCurrentPlayer('');
    }
  };

  const removePlayer = (player: string) => {
    setPlayers((prev) => prev.filter(p => p !== player));
  };

  const toggleCategory = (category: GameCategory) => {
    setSelectedCategories((prev) => {
      if (prev.length === 1 && prev.includes(category)) {
        return prev;
      }
      if (category === "✏️ Custom") {
        return prev.includes(category) ? [] : [category];
      }
      const withoutCustom = prev.filter(c => c !== "✏️ Custom");
      return withoutCustom.includes(category)
        ? withoutCustom.filter(c => c !== category)
        : [...withoutCustom, category];
    });
  };

  const [clues, setClues] = useState<'yes' | 'no'>('no');
  const onClickClueToggle = (value: 'yes' | 'no') => {
    setClues(value);
  };
  useEffect(() => {
    if (selectedCategories.includes("✏️ Custom")) {
      setClues('no');
    };
  }, [selectedCategories]);

  const gameTimers = useGameStore((state) => state.gameTimers);
  const [selectedTimer, setSelectedTimer] = useState<string>('1:00');

  const handleSubmit = () => {
    const payload: GamePayload = {
      categories: selectedCategories,
      players: players,
      clue: clues === 'yes',
      timeInMs: timeToMilliseconds(selectedTimer),
    };

    // Add customTopics only if Custom category is selected
    if (selectedCategories.includes("✏️ Custom")) {
      payload.customTopics = customTopics;
    }

    console.log('Game Configuration:', payload);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View className='bg-red-900 pt-10 pb-6 border-b-4 border-yellow-600'>
          <View className='flex items-center justify-center'>
            <RNText className='font-extrabold text-yellow-400 text-4xl tracking-wider mb-1 drop-shadow-lg'>🎭 IMPOSTER GAME</RNText>
            <RNText className='text-yellow-200 text-sm font-medium tracking-widest uppercase'>The Show Must Go On</RNText>
          </View>
        </View>
      ),
    });
  }, [navigation]);


  return (
    <SafeAreaView className='flex flex-1 overflow-auto px-2 pt-[-24] pb-4 bg-gray-900'>
      <ScrollView contentContainerClassName='gap-4 pb-12 bg-transparent'>

        {/* CARD FOR ADDING PLAYERS */}
        <Card className='border-rose-500 border-2 shadow-2xl bg-rose-600'>
          <CardHeader className='bg-rose-700 border-b-2 border-rose-500 py-2'>
            <CardTitle className='text-yellow-300 text-xl'>👥 Add Players</CardTitle>
            <CardDescription className='text-rose-100'>Enter the names of all players!</CardDescription>
          </CardHeader>
          <CardContent className='overflow-auto'>
            <View className='w-full flex-row border-2 border-rose-400 bg-rose-800 px-4 py-2 gap-2 justify-center items-center rounded-lg'>
              <TextInput
                placeholder='Enter player name...'
                placeholderTextColor='#fda4af'
                className='flex-1 text-white'
                value={currentPlayer}
                onChangeText={setCurrentPlayer}
                onSubmitEditing={addPlayer}
              />
              <Pressable
                onPress={addPlayer}
                disabled={!currentPlayer.trim()}
                className={`px-3 py-1 rounded-md ${!currentPlayer.trim() ? 'opacity-40 bg-gray-600' : 'bg-yellow-500'}`}
              >
                <RNText className={`text-2xl font-bold ${currentPlayer.trim() ? 'text-gray-900' : 'text-gray-400'}`}>
                  +
                </RNText>
              </Pressable>
            </View>

            {players.length > 0 && (
              <View className='mt-4'>
                <RNText className='text-sm font-semibold mb-2 text-yellow-300'>Added Players ({players.length}):</RNText>
                <View className='flex-row flex-wrap gap-2'>
                  {players.map((player, index) => (
                    <View key={index} className='flex-row items-center bg-rose-800 px-3 py-2 rounded-lg border-2 border-yellow-500 shadow-sm'>
                      <RNText className='text-sm mr-2 text-white font-medium'>{player}</RNText>
                      <Pressable onPress={() => removePlayer(player)} className='bg-red-600 rounded px-1'>
                        <RNText className='text-white font-bold text-lg'>×</RNText>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </CardContent>
          <CardFooter className='gap-2 bg-rose-800 border-t-2 py-2 border-rose-500'>
            <CircleAlert className='mr-2' size={16} color='#fde047' />
            <RNText className='text-xs text-yellow-200'>At least three players required.</RNText>
          </CardFooter>
        </Card>

        {/* CARD FOR CATEGORY SELECTION */}
        <Card className='border-purple-500 border-2 shadow-2xl bg-purple-600'>
          <CardHeader className='bg-purple-700 border-b-2 border-purple-500 py-2'>
            <CardTitle className='text-yellow-300 text-xl'>🎯 Select Category / Categories</CardTitle>
            <CardDescription className='text-purple-100'>Choose what the topic would be about!</CardDescription>
          </CardHeader>
          <CardContent className='overflow-auto'>
            {gameCategories.map((category) => (
              <View key={category} className="flex flex-row items-center gap-1 mb-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                  checkedClassName='border-yellow-400'
                  indicatorClassName='bg-yellow-400'
                />
                <Label
                  onPress={Platform.select({ native: () => toggleCategory(category) })}
                  htmlFor={category}
                  className='text-white'>
                  {category}
                </Label>
              </View>
            ))}
            <View className='h-4'></View>
          </CardContent>
          <CardFooter className='gap-2 bg-purple-800 border-t-2 py-2 border-purple-500'>
            <CircleAlert className='mr-2' size={16} color='#fde047' />
            <RNText className='text-xs text-yellow-200'>When Custom is selected, categories are disabled.</RNText>
          </CardFooter>
        </Card>

        {/* CARD FOR WHEN CATEGORY IS CUSTOM */}
        {selectedCategories.includes("✏️ Custom") && (
          <Card className='border-teal-500 border-2 shadow-2xl bg-teal-600'>
            <CardHeader className='bg-teal-700 border-b-2 border-teal-500 py-2'>
              <CardTitle className='text-yellow-300 text-xl'>✏️ Add Topics</CardTitle>
              <CardDescription className='text-teal-100'>Create your own topics!</CardDescription>
            </CardHeader>
            <CardContent className='overflow-auto'>
              <View className='w-full flex-row border-2 border-teal-400 bg-teal-800 px-4 py-2 gap-2 justify-center items-center rounded-lg'>
                <TextInput
                  placeholder='Enter topic...'
                  placeholderTextColor='#5eead4'
                  className='flex-1 text-white'
                  value={currentTopic}
                  onChangeText={setCurrentTopic}
                  onSubmitEditing={addTopic}
                />
                <Pressable
                  onPress={addTopic}
                  disabled={!currentTopic.trim()}
                  className={`px-3 py-1 rounded-md ${!currentTopic.trim() ? 'opacity-40 bg-gray-600' : 'bg-yellow-500'}`}
                >
                  <RNText className={`text-2xl font-bold ${currentTopic.trim() ? 'text-gray-900' : 'text-gray-400'}`}>
                    +
                  </RNText>
                </Pressable>
              </View>

              {customTopics.length > 0 && (
                <View className='mt-4'>
                  <RNText className='text-sm font-semibold mb-2 text-yellow-300'>Added Topics ({customTopics.length}):</RNText>
                  <View className='flex-row flex-wrap gap-2'>
                    {customTopics.map((topic, index) => (
                      <View key={index} className='flex-row items-center bg-teal-800 px-3 py-2 rounded-lg border-2 border-yellow-500 shadow-sm'>
                        <RNText className='text-sm mr-2 text-white font-medium'>{topic}</RNText>
                        <Pressable onPress={() => removeTopic(topic)} className='bg-red-600 rounded px-1'>
                          <RNText className='text-white font-bold text-lg'>×</RNText>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </CardContent>
            <CardFooter className='gap-2 bg-teal-800 border-t-2 py-2 border-teal-500'>
              <CircleAlert className='mr-2' size={16} color='#fde047' />
              <RNText className='text-xs text-yellow-200'>At least three topics required.</RNText>
            </CardFooter>
          </Card>
        )}

        {/* CARD FOR SETTING IF THERE IS A CLUE */}
        <Card className='border-amber-500 border-2 shadow-2xl bg-amber-600'>
          <CardHeader className='bg-amber-700 border-b-2 border-amber-500 py-2'>
            <CardTitle className='text-yellow-300 text-xl'>🕵️ Give imposter a clue?</CardTitle>
            <CardDescription className='text-amber-100'>Decide whether imposter gets a clue or not</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-row items-center gap-4'>
            <RadioGroup value={clues} onValueChange={(val) => onClickClueToggle(val as 'yes' | 'no')} className='flex-row' disabled={selectedCategories.includes("✏️ Custom")}>
              <View className='flex-row items-center gap-2'>
                <RadioGroupItem value="yes" id="r2" disabled={selectedCategories.includes("✏️ Custom")} />
                <Label
                  htmlFor="r2"
                  onPress={selectedCategories.includes("✏️ Custom") ? undefined : () => onClickClueToggle('yes')}
                  disabled={selectedCategories.includes("✏️ Custom")}
                  className='text-white'
                >
                  Yes
                </Label>
              </View>
              <View className='flex-row items-center gap-2'>
                <RadioGroupItem value="no" id="r1" disabled={selectedCategories.includes("✏️ Custom")} />
                <Label
                  htmlFor="r1"
                  onPress={selectedCategories.includes("✏️ Custom") ? undefined : () => onClickClueToggle('no')}
                  disabled={selectedCategories.includes("✏️ Custom")}
                  className='text-white'
                >
                  No
                </Label>
              </View>
            </RadioGroup>
          </CardContent>
          <CardFooter className='gap-2 bg-amber-800 border-t-2 py-2 border-amber-500'>
            <CircleAlert className='mr-2' size={16} color='#fde047' />
            <RNText className='text-xs text-yellow-200'>When using custom category, no clues allowed.</RNText>
          </CardFooter>
        </Card>

        {/* CARD FOR SETTING THE COVERSATION TIME */}
        <Card className='border-emerald-500 border-2 shadow-2xl bg-emerald-600'>
          <CardHeader className='bg-emerald-700 border-b-2 border-emerald-500 py-2'>
            <CardTitle className='text-yellow-300 text-xl'>⏱️ Set conversation time</CardTitle>
            <CardDescription className='text-emerald-100'>Decide how long the conversation lasts</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-row items-center gap-4'>
            <RadioGroup value={selectedTimer} onValueChange={(val) => setSelectedTimer(val)} className='flex-row flex-wrap gap-4'>
              {gameTimers.map((timer) => (
                <View key={timer} className='flex-row items-center gap-2'>
                  <RadioGroupItem value={timer} id={`timer-${timer}`} />
                  <Label htmlFor={`timer-${timer}`} onPress={() => setSelectedTimer(timer)} className='text-white'>
                    🕰️ {timer}
                  </Label>
                </View>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className='gap-2 bg-emerald-800 border-t-2 py-2 border-emerald-500'>
            <CircleAlert className='mr-2' size={16} color='#fde047' />
            <RNText className='text-xs text-yellow-200'>Set the duration for the conversation time.</RNText>
          </CardFooter>
        </Card>
      </ScrollView>

      <View className='w-full px-2 py-3 bg-gray-950 border-t-4 border-yellow-600 shadow-2xl'>
        <TouchableOpacity
          className={`w-full border-2 py-2 flex items-center justify-center ${(selectedCategories.includes("✏️ Custom") && customTopics.length < 3) || players.length < 3
            ? 'bg-gray-700 border-gray-600 opacity-50'
            : 'bg-red-700 border-yellow-500'
            }`}
          disabled={(selectedCategories.includes("✏️ Custom") && customTopics.length < 3) || players.length < 3}
          onPress={handleSubmit}
        >
          <Text className={`font-extrabold text-lg ${(selectedCategories.includes("✏️ Custom") && customTopics.length < 3) || players.length < 3
            ? 'text-gray-400'
            : 'text-yellow-300'
            }`}>
            🎭 RAISE THE CURTAIN
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Index