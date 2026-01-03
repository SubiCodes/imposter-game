import { View, Text as RNText, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FinalGamePayload } from './view-word';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import useGameStore from './store/gameStore';

const ResultsPage = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const playAgain = useGameStore((state) => state.playAgain);
    const navigationListenerRef = useRef<(() => void) | null>(null);
    
    const gamePayload: FinalGamePayload = params.gamePayload ? JSON.parse(params.gamePayload as string) : null;
    const votedPlayer = params.votedPlayer as string | null;
    
    if (!gamePayload) {
        return (
            <SafeAreaView className='flex flex-1 bg-gray-900 items-center justify-center'>
                <RNText className='text-yellow-400 text-lg'>No game data found</RNText>
            </SafeAreaView>
        );
    }

    const isImposterVoted = votedPlayer === gamePayload.imposter;
    const playersWin = isImposterVoted;

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <View className={`${playersWin ? 'bg-green-800' : 'bg-red-950'} pt-10 pb-6 border-b-4 ${playersWin ? 'border-green-400' : 'border-red-600'}`}>
                    <View className='flex items-center justify-center'>
                        <RNText className={`font-extrabold ${playersWin ? 'text-green-300' : 'text-red-400'} text-4xl tracking-wider mb-1 drop-shadow-lg`}>
                            {playersWin ? '🎉 GAME OVER' : '🎭 GAME OVER'}
                        </RNText>
                        <RNText className={`${playersWin ? 'text-green-200' : 'text-red-200'} text-sm font-medium tracking-widest uppercase`}>
                            {playersWin ? 'Victory!' : 'Defeat!'}
                        </RNText>
                    </View>
                </View>
            ),
        });
    }, [navigation, playersWin]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Alert.alert(
                '🎭 Leave Results?',
                'Are you sure you want to go back to the menu? You can play again with the same players!',
                [
                    { text: "Stay", style: 'cancel' },
                    {
                        text: 'Back to Menu',
                        style: 'destructive',
                        onPress: () => {
                            unsubscribe();
                            router.replace('/');
                        },
                    },
                ]
            );
        });
        navigationListenerRef.current = unsubscribe;
        return unsubscribe;
    }, [navigation, router]);

    const handlePlayAgainClick = () => {
        // Remove navigation listener before playing again
        if (navigationListenerRef.current) {
            navigationListenerRef.current();
            navigationListenerRef.current = null;
        }
        playAgain(gamePayload, router);
    };

    const handleBackToMenu = () => {
        // Remove navigation listener before going back
        if (navigationListenerRef.current) {
            navigationListenerRef.current();
            navigationListenerRef.current = null;
        }
        router.replace('/');
    };

    return (
        <SafeAreaView className={`flex flex-1 ${playersWin ? 'bg-gray-900' : 'bg-black'} pt-[-44]`}>
            <ScrollView className='flex-1'>
                {/* Results Banner */}
                <View className='px-6 py-8'>
                    {playersWin ? (
                        // Players Win - Positive Design
                        <View className='items-center'>
                            <View className='bg-green-700 border-4 border-green-400 rounded-3xl p-8 shadow-2xl items-center w-full'>
                                <RNText className='text-8xl mb-4'>🎉</RNText>
                                <RNText className='text-green-100 text-4xl font-extrabold text-center mb-3'>
                                    PLAYERS WIN!
                                </RNText>
                                <RNText className='text-green-200 text-lg text-center font-semibold'>
                                    The Imposter has been caught!
                                </RNText>
                            </View>

                            {/* Voted Player Info */}
                            <View className='bg-green-800 border-2 border-green-500 rounded-xl p-6 mt-6 w-full'>
                                <RNText className='text-green-300 text-center text-lg font-bold mb-2'>
                                    You voted for:
                                </RNText>
                                <RNText className='text-green-100 text-3xl font-extrabold text-center mb-4'>
                                    {votedPlayer} ✓
                                </RNText>
                                <RNText className='text-green-200 text-center text-base'>
                                    Correct! They were the Imposter!
                                </RNText>
                            </View>

                            {/* Game Info */}
                            <View className='bg-gray-800 border-2 border-green-600 rounded-xl p-6 mt-6 w-full'>
                                <RNText className='text-green-400 text-center text-xl font-bold mb-4'>
                                    📋 Game Details
                                </RNText>
                                <View className='gap-3'>
                                    <View>
                                        <RNText className='text-green-300 text-sm font-semibold mb-1'>
                                            The Word Was:
                                        </RNText>
                                        <RNText className='text-green-100 text-2xl font-bold'>
                                            {gamePayload.word}
                                        </RNText>
                                    </View>
                                    {gamePayload.clue && (
                                        <View>
                                            <RNText className='text-green-300 text-sm font-semibold mb-1'>
                                                Imposter's Clue:
                                            </RNText>
                                            <RNText className='text-green-100 text-xl font-bold'>
                                                {gamePayload.clue}
                                            </RNText>
                                        </View>
                                    )}
                                    <View>
                                        <RNText className='text-green-300 text-sm font-semibold mb-1'>
                                            Players:
                                        </RNText>
                                        <RNText className='text-green-100 text-base'>
                                            {gamePayload.players.join(', ')}
                                        </RNText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        // Imposter Wins - Villain Design
                        <View className='items-center'>
                            <View className='bg-red-950 border-4 border-red-600 rounded-3xl p-8 shadow-2xl items-center w-full'>
                                <RNText className='text-8xl mb-4'>🎭</RNText>
                                <RNText className='text-red-400 text-4xl font-extrabold text-center mb-3'>
                                    IMPOSTER WINS!
                                </RNText>
                                <RNText className='text-red-300 text-lg text-center font-semibold'>
                                    The Imposter has deceived you all!
                                </RNText>
                            </View>

                            {/* Voted Player Info */}
                            <View className='bg-red-900 border-2 border-red-600 rounded-xl p-6 mt-6 w-full'>
                                <RNText className='text-red-300 text-center text-lg font-bold mb-2'>
                                    You voted for:
                                </RNText>
                                <RNText className='text-red-100 text-3xl font-extrabold text-center mb-4'>
                                    {votedPlayer} ✗
                                </RNText>
                                <RNText className='text-red-200 text-center text-base'>
                                    Wrong! They were innocent!
                                </RNText>
                            </View>

                            {/* Reveal Imposter */}
                            <View className='bg-gray-950 border-4 border-red-700 rounded-xl p-6 mt-6 w-full'>
                                <RNText className='text-red-400 text-center text-xl font-bold mb-4'>
                                    😈 The Real Imposter Was:
                                </RNText>
                                <View className='bg-red-800 border-2 border-red-500 rounded-lg p-4 mb-4'>
                                    <RNText className='text-yellow-300 text-4xl font-extrabold text-center'>
                                        {gamePayload.imposter}
                                    </RNText>
                                </View>
                                <RNText className='text-red-300 text-center text-sm italic'>
                                    Better luck next time!
                                </RNText>
                            </View>

                            {/* Game Info */}
                            <View className='bg-gray-900 border-2 border-red-700 rounded-xl p-6 mt-6 w-full'>
                                <RNText className='text-red-400 text-center text-xl font-bold mb-4'>
                                    📋 Game Details
                                </RNText>
                                <View className='gap-3'>
                                    <View>
                                        <RNText className='text-red-300 text-sm font-semibold mb-1'>
                                            The Word Was:
                                        </RNText>
                                        <RNText className='text-red-100 text-2xl font-bold'>
                                            {gamePayload.word}
                                        </RNText>
                                    </View>
                                    {gamePayload.clue && (
                                        <View>
                                            <RNText className='text-red-300 text-sm font-semibold mb-1'>
                                                Imposter's Clue:
                                            </RNText>
                                            <RNText className='text-red-100 text-xl font-bold'>
                                                {gamePayload.clue}
                                            </RNText>
                                        </View>
                                    )}
                                    <View>
                                        <RNText className='text-red-300 text-sm font-semibold mb-1'>
                                            Players:
                                        </RNText>
                                        <RNText className='text-red-100 text-base'>
                                            {gamePayload.players.join(', ')}
                                        </RNText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className={`w-full px-4 py-6 ${playersWin ? 'bg-green-950' : 'bg-red-950'} border-t-4 ${playersWin ? 'border-green-600' : 'border-red-700'} gap-3`}>
                {/* Play Again with Same Players */}
                <TouchableOpacity
                    className={`w-full ${playersWin ? 'bg-green-700 border-green-500' : 'bg-red-700 border-red-500'} border-2 shadow-2xl py-4 items-center justify-center rounded-lg`}
                    onPress={handlePlayAgainClick}
                >
                    <Text className={`${playersWin ? 'text-green-100' : 'text-red-100'} font-extrabold text-lg tracking-widest`}>
                        🔄 PLAY AGAIN 🔄
                    </Text>
                </TouchableOpacity>
                
                {/* Back to Menu */}
                <TouchableOpacity
                    className='w-full bg-gray-700 border-2 border-yellow-500 shadow-2xl py-4 items-center justify-center rounded-lg'
                    onPress={handleBackToMenu}
                >
                    <Text className='text-yellow-300 font-extrabold text-base tracking-widest'>
                        🏠 BACK TO MENU
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ResultsPage