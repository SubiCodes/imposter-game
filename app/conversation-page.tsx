import { View, Text as RNText, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useRef, useMemo } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FinalGamePayload } from './view-word';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBackgroundMusic } from '@/hooks/audioHook';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';

// Move audio source outside component to prevent recreation
const audioSource = require('@/assets/music/Mission_ Impossible Theme.mp3');

const ConversationPage = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();

    // Parse the game payload
    const gamePayload: FinalGamePayload = params.gamePayload
        ? JSON.parse(params.gamePayload as string)
        : null;

    const [timerStarted, setTimerStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(gamePayload?.timer || 0);
    const [showSkipDialog, setShowSkipDialog] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize background music with stable audio source
    const music = useBackgroundMusic(audioSource, 0.3);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <View className='bg-red-900 pt-10 pb-6 border-b-4 border-yellow-600'>
                    <View className='flex items-center justify-center'>
                        <RNText className='font-extrabold text-yellow-400 text-4xl tracking-wider mb-1 drop-shadow-lg'>🎭 IMPOSTER GAME</RNText>
                        <RNText className='text-yellow-200 text-sm font-medium tracking-widest uppercase'>Conversation Time</RNText>
                    </View>
                </View>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        // Prevent back navigation
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Alert.alert(
                '🎭 End Game?',
                'Are you sure you want to leave? The game will end and you will return to the home screen.',
                [
                    { text: "Stay", style: 'cancel' },
                    {
                        text: 'Yes, End Game',
                        style: 'destructive',
                        onPress: () => {
                            // Clean up timer
                            if (intervalRef.current) clearInterval(intervalRef.current);
                            // Stop music
                            music.stop();
                            // Remove the listener first to allow navigation
                            unsubscribe();
                            // Navigate to index page
                            router.replace('/');
                        },
                    },
                ]
            );
        });
        return unsubscribe;
    }, [navigation, router]);

    useEffect(() => {
        if (timerStarted && !isPaused && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1000) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        music.stop();
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [timerStarted, isPaused, timeRemaining]);

    if (!gamePayload) {
        return (
            <SafeAreaView className='flex flex-1 bg-gray-900 items-center justify-center'>
                <RNText className='text-yellow-400 text-lg'>No game data found</RNText>
            </SafeAreaView>
        );
    }

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setTimerStarted(true);
        music.play();
    };

    const handlePause = () => {
        if (isPaused) {
            music.play();
        } else {
            music.pause();
        }
        setIsPaused(!isPaused);
    };

    const handleSkipConfirm = () => {
        setShowSkipDialog(false);
        setTimeRemaining(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        music.stop();
    };

    const handleMoveToVoting = () => {
        // TODO: Navigate to voting page
        console.log('Moving to voting...');
        router.push({ pathname: '/voting-page', params: { gamePayload: JSON.stringify(gamePayload) } });
    };

    return (
        <SafeAreaView className='flex flex-1 bg-gray-900'>
            {/* Main Timer Display */}
            <View className='flex-1 justify-center items-center px-4'>
                <View className='bg-red-700 border-4 border-yellow-500 rounded-3xl p-12 shadow-2xl items-center justify-center min-w-[300px]'>
                    <RNText className='text-yellow-300 text-xl font-bold mb-4 text-center'>⏱️ TIME REMAINING</RNText>
                    <RNText className='text-yellow-400 text-7xl font-extrabold tracking-wider'>
                        {formatTime(timeRemaining)}
                    </RNText>
                    {isPaused && (
                        <RNText className='text-yellow-200 text-lg mt-4'>⏸️ PAUSED</RNText>
                    )}
                </View>
            </View>

            {/* Control Buttons */}
            <View className='w-full px-4 py-6 bg-gray-950 border-t-4 border-yellow-600 gap-3'>
                {!timerStarted ? (
                    // Start Button
                    <TouchableOpacity
                        className='w-full bg-emerald-700 border-2 border-yellow-500 shadow-2xl py-4 items-center justify-center rounded-lg'
                        onPress={handleStart}
                    >
                        <RNText className='text-yellow-300 font-extrabold text-lg tracking-widest'>
                            ▶️ START TIMER
                        </RNText>
                    </TouchableOpacity>
                ) : timeRemaining > 0 ? (
                    // Pause and Skip Buttons
                    <View className='flex-row gap-3'>
                        <TouchableOpacity
                            className='flex-1 bg-amber-700 border-2 border-yellow-500 shadow-2xl py-4 items-center justify-center rounded-lg'
                            onPress={handlePause}
                        >
                            <RNText className='text-yellow-300 font-extrabold text-lg tracking-widest'>
                                {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
                            </RNText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='flex-1 bg-red-700 border-2 border-yellow-500 shadow-2xl py-4 items-center justify-center rounded-lg'
                            onPress={() => setShowSkipDialog(true)}
                        >
                            <RNText className='text-yellow-300 font-extrabold text-lg tracking-widest'>
                                ⏭️ SKIP
                            </RNText>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Move to Voting Button
                    <TouchableOpacity
                        className='w-full bg-purple-700 border-2 border-yellow-500 shadow-2xl py-4 items-center justify-center rounded-lg'
                        onPress={handleMoveToVoting}
                    >
                        <RNText className='text-yellow-300 font-extrabold text-lg tracking-widest'>
                            🗳️ MOVE TO VOTING
                        </RNText>
                    </TouchableOpacity>
                )}
            </View>

            {/* Skip Confirmation Dialog */}
            <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
                <AlertDialogContent className='bg-gray-900 border-2 border-yellow-600'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-yellow-300 text-2xl'>⏭️ Skip Timer?</AlertDialogTitle>
                        <AlertDialogDescription className='text-gray-300'>
                            Are you sure you want to skip the conversation time and move to voting?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-gray-700 border-gray-600'>
                            <Text className='text-white bg-transparent'>Cancel</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className='bg-red-700 border-2 border-yellow-500'
                            onPress={handleSkipConfirm}
                        >
                            <RNText className='text-yellow-300 font-bold'>Yes, Skip</RNText>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SafeAreaView>
    )
}

export default ConversationPage