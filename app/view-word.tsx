import { View, Text as RNText, Alert } from 'react-native'
import React, { useLayoutEffect, useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TouchableOpacity } from 'react-native';
import SimpleFlashCard from '@/components/flashcards/simple-word-flash-card';

export interface FinalGamePayload {
    players: string[];
    categories: string[];
    word: string;
    clue: string | null;
    timer: number;
    imposter: string;
    customTopics?: string[];
}

const ViewWord = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    // Parse the game payload
    let gamePayload: FinalGamePayload | null = null;
    try {
        gamePayload = params.gamePayload
            ? JSON.parse(params.gamePayload as string)
            : null;
    } catch (error) {
        console.error('ViewWord - Error parsing game payload:', error);
    }

    if (!gamePayload) {
        console.log('ViewWord - No game payload, showing error');
        return (
            <SafeAreaView className='flex flex-1 bg-gray-900 items-center justify-center'>
                <RNText className='text-yellow-400 text-lg'>No game data found</RNText>
            </SafeAreaView>
        );
    }

    const currentPlayer = gamePayload.players[currentPlayerIndex];
    const isImposter = currentPlayer === gamePayload.imposter;
    const totalPlayers = gamePayload.players.length;

    const handleNext = () => {
        if (currentPlayerIndex < totalPlayers - 1) {
            // Move to next player
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            router.push({
                pathname: '/conversation-page',
                params: { gamePayload: JSON.stringify(gamePayload) }
            });
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Prompt the user before leaving the screen
            Alert.alert(
                '🎭 End Game?',
                'Are you sure you want to leave? The game will end and all progress will be lost.',
                [
                    { text: "Stay", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Yes, End Game',
                        style: 'destructive',
                        onPress: () => navigation.dispatch(e.data.action),
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation]);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <View className='bg-red-900 pt-10 pb-6 border-b-4 border-yellow-600'>
                    <View className='flex items-center justify-center'>
                        <RNText className='font-extrabold text-yellow-400 text-4xl tracking-wider mb-1 drop-shadow-lg'>🎭 IMPOSTER GAME</RNText>
                        <RNText className='text-yellow-200 text-sm font-medium tracking-widest uppercase'>View Your Word</RNText>
                    </View>
                </View>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView className='flex flex-1 bg-gray-900'>
            {/* Center space for FlashCard */}
            <View className='flex-1 justify-center items-center px-4'>
                <SimpleFlashCard
                    data={{
                        playerName: currentPlayer,
                        word: gamePayload.word,
                        isImposter: isImposter,
                        clue: isImposter && gamePayload.clue ? gamePayload.clue : undefined,
                        currentNumber: currentPlayerIndex + 1,
                        totalPlayers: totalPlayers,
                    }}
                />
            </View>

            {/* Bottom button */}
            <View className='w-full px-4 py-6 bg-gray-950 border-t-4 border-yellow-600'>
                <TouchableOpacity
                    className='w-full bg-red-700 border-2 border-yellow-500 shadow-2xl py-4 items-center justify-center rounded-lg'
                    onPress={handleNext}
                >
                    <Text className='text-yellow-300 font-extrabold text-lg tracking-widest'>
                        {currentPlayerIndex < totalPlayers - 1 ? '⏭️ NEXT PLAYER ⏭️' : '🎭 START GAME 🎭'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ViewWord