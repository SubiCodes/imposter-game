import { View, Text, Platform, ScrollView, TextInput, Pressable } from 'react-native'
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
        <View className='flex items-center justify-center bg-green-500 pt-10 pb-4'>
          <Text className='font-bold text-white text-4xl'>IMPOSTER GAME</Text>
        </View>
      ),
    });
  }, [navigation]);


  return (
    <SafeAreaView className='flex flex-1 overflow-auto px-2 pt-[-24] pb-4 bg-[#f2f3f4]'>
      <ScrollView contentContainerClassName='gap-2 pb-12 bg-transparent'>
        {/* CARD FOR CATEGORY SELECTION */}
        <Card className='border-gray-200'>
          <CardHeader>
            <CardTitle>Select Category / Categories</CardTitle>
            <CardDescription>Choose what the topic would be about!</CardDescription>
          </CardHeader>
          <CardContent className='overflow-auto'>
            {gameCategories.map((category) => (
              <View key={category} className="flex flex-row items-center gap-1 mb-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                  checkedClassName='border-green-700'
                  indicatorClassName='bg-green-700'
                />
                <Label
                  onPress={Platform.select({ native: () => toggleCategory(category) })}
                  htmlFor={category}>
                  {category}
                </Label>
              </View>
            ))}
            <View className='h-4'></View>
          </CardContent>
          <CardFooter className='gap-2'>
            <CircleAlert className='mr-2' size={16} color='orange' />
            <Text className='text-xs text-muted-foreground'>When Custom is selected, categories are disabled.</Text>
          </CardFooter>
        </Card>

        {/* CARD FOR WHEN CATEGORY IS CUSTOM */}
        {selectedCategories.includes("✏️ Custom") && (
          <Card className='border-gray-200'>
            <CardHeader>
              <CardTitle>Add Topics</CardTitle>
              <CardDescription>Create your own topics!</CardDescription>
            </CardHeader>
            <CardContent className='overflow-auto'>
              <View className='w-full flex-row border border-gray-400 px-4 py-2 gap-2 justify-center items-center rounded-md'>
                <TextInput
                  placeholder='Enter topic...'
                  className='flex-1'
                  value={currentTopic}
                  onChangeText={setCurrentTopic}
                  onSubmitEditing={addTopic}
                />
                <Pressable
                  onPress={addTopic}
                  disabled={!currentTopic.trim()}
                  className={`px-2 py-1 rounded-md ${!currentTopic.trim() ? 'opacity-40' : ''}`}
                >
                  <Text className={`text-2xl font-bold ${currentTopic.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                    +
                  </Text>
                </Pressable>
              </View>

              {customTopics.length > 0 && (
                <View className='mt-4'>
                  <Text className='text-sm font-semibold mb-2'>Added Topics ({customTopics.length}):</Text>
                  <View className='flex-row flex-wrap gap-2'>
                    {customTopics.map((topic, index) => (
                      <View key={index} className='flex-row items-center bg-green-100 px-3 py-2 rounded-md border border-green-300'>
                        <Text className='text-sm mr-2'>{topic}</Text>
                        <Pressable onPress={() => removeTopic(topic)}>
                          <Text className='text-red-600 font-bold'>×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </CardContent>
            <CardFooter className='gap-2'>
              <CircleAlert className='mr-2' size={16} color='orange' />
              <Text className='text-xs text-muted-foreground'>At least three topics required.</Text>
            </CardFooter>
          </Card>
        )}

        {/* CARD FOR ADDING PLAYERS */}
        <Card className='border-gray-200'>
          <CardHeader>
            <CardTitle>Add Players</CardTitle>
            <CardDescription>Enter the names of all players!</CardDescription>
          </CardHeader>
          <CardContent className='overflow-auto'>
            <View className='w-full flex-row border border-gray-400 px-4 py-2 gap-2 justify-center items-center rounded-md'>
              <TextInput
                placeholder='Enter player name...'
                className='flex-1'
                value={currentPlayer}
                onChangeText={setCurrentPlayer}
                onSubmitEditing={addPlayer}
              />
              <Pressable
                onPress={addPlayer}
                disabled={!currentPlayer.trim()}
                className={`px-2 py-1 rounded-md ${!currentPlayer.trim() ? 'opacity-40' : ''}`}
              >
                <Text className={`text-2xl font-bold ${currentPlayer.trim() ? 'text-green-600' : 'text-gray-400'}`}>
                  +
                </Text>
              </Pressable>
            </View>

            {players.length > 0 && (
              <View className='mt-4'>
                <Text className='text-sm font-semibold mb-2'>Added Players ({players.length}):</Text>
                <View className='flex-row flex-wrap gap-2'>
                  {players.map((player, index) => (
                    <View key={index} className='flex-row items-center bg-green-100 px-3 py-2 rounded-md border border-green-300'>
                      <Text className='text-sm mr-2'>{player}</Text>
                      <Pressable onPress={() => removePlayer(player)}>
                        <Text className='text-red-600 font-bold'>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </CardContent>
          <CardFooter className='gap-2'>
            <CircleAlert className='mr-2' size={16} color='orange' />
            <Text className='text-xs text-muted-foreground'>At least three players required.</Text>
          </CardFooter>
        </Card>

        {/* CARD FOR SETTING IF THERE IS A CLUE */}
        <Card className='border-gray-200'>
          <CardHeader>
            <CardTitle>Give imposter a clue?</CardTitle>
            <CardDescription>Decide wether imposter gets a clue or not</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-row items-center gap-4'>
            <RadioGroup value={clues} onValueChange={(val) => onClickClueToggle(val as 'yes' | 'no')} className='flex-row' disabled={selectedCategories.includes("✏️ Custom")}>
              <View className='flex-row items-center gap-2'>
                <RadioGroupItem value="yes" id="r2" disabled={selectedCategories.includes("✏️ Custom")} />
                <Label
                  htmlFor="r2"
                  onPress={selectedCategories.includes("✏️ Custom") ? undefined : () => onClickClueToggle('yes')}
                  disabled={selectedCategories.includes("✏️ Custom")}
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
                >
                  No
                </Label>
              </View>
            </RadioGroup>
          </CardContent>
          <CardFooter className='gap-2'>
            <CircleAlert className='mr-2' size={16} color='orange' />
            <Text className='text-xs text-muted-foreground'>When using custom category, no clues allowed.</Text>
          </CardFooter>
        </Card>

        {/* CARD FOR SETTING THE COVERSATION TIME */}
        <Card className='border-gray-200'>
          <CardHeader>
            <CardTitle>Set conversation time</CardTitle>
            <CardDescription>Decide how long the conversation lasts</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-row items-center gap-4'>
            <RadioGroup value={selectedTimer} onValueChange={(val) => setSelectedTimer(val)} className='flex-row flex-wrap gap-4'>
              {gameTimers.map((timer) => (
                <View key={timer} className='flex-row items-center gap-2'>
                  <RadioGroupItem value={timer} id={`timer-${timer}`} />
                  <Label htmlFor={`timer-${timer}`} onPress={() => setSelectedTimer(timer)}>
                    🕰️ {timer}
                  </Label>
                </View>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className='gap-2'>
            <CircleAlert className='mr-2' size={16} color='orange' />
            <Text className='text-xs text-muted-foreground'>Set the duration for the conversation time.</Text>
          </CardFooter>
        </Card>
      </ScrollView>

      <Button 
        className='w-full bg-green-500'
        disabled={(selectedCategories.includes("✏️ Custom") && customTopics.length < 3) || players.length < 3}
        onPress={handleSubmit}
      >
        <Text className='text-white font-bold'>Start Game</Text>
      </Button>

    </SafeAreaView>
  )
}

export default Index