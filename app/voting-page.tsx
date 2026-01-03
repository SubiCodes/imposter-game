import { View, Text as RNText, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState, useLayoutEffect, useEffect } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FinalGamePayload } from './view-word';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
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

const VotingPage = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const gamePayload: FinalGamePayload = params.gamePayload
    ? JSON.parse(params.gamePayload as string)
    : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View className='bg-red-900 pt-10 pb-6 border-b-4 border-yellow-600'>
          <View className='flex items-center justify-center'>
            <RNText className='font-extrabold text-yellow-400 text-4xl tracking-wider mb-1 drop-shadow-lg'>🎭 IMPOSTER GAME</RNText>
            <RNText className='text-yellow-200 text-sm font-medium tracking-widest uppercase'>Vote for the Imposter</RNText>
          </View>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      Alert.alert(
        '🎭 End Game?',
        'Are you sure you want to leave? The game will end and all progress will be lost.',
        [
          { text: "Stay", style: 'cancel' },
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

  if (!gamePayload) {
    return (
      <SafeAreaView className='flex flex-1 bg-gray-900 items-center justify-center'>
        <RNText className='text-yellow-400 text-lg'>No game data found</RNText>
      </SafeAreaView>
    );
  }

  const handlePlayerSelect = (player: string) => {
    setSelectedPlayer(player);
  };

  const handleProceedToResults = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmVote = () => {
    setShowConfirmDialog(false);
    // TODO: Navigate to results page with selected player
    console.log('Moving to results with vote:', selectedPlayer);
    // router.push({ pathname: '/results-page', params: { gamePayload: JSON.stringify(gamePayload), votedPlayer: selectedPlayer } });
  };

  return (
    <SafeAreaView className='flex flex-1 bg-gray-900'>
      {/* Instructions */}
      <View className='px-6 py-4 bg-gray-950 border-b-2 border-yellow-600'>
        <RNText className='text-yellow-300 text-center text-lg font-bold mb-2'>
          Who is the Imposter?
        </RNText>
        <RNText className='text-yellow-200 text-center text-sm'>
          Tap on a player's name to vote for them
        </RNText>
      </View>

      {/* Players List */}
      <ScrollView className='flex-1 px-4 py-6'>
        <View className='gap-3'>
          {gamePayload.players.map((player, index) => {
            const isSelected = selectedPlayer === player;
            const colors = ['bg-red-700', 'bg-purple-700', 'bg-blue-700', 'bg-teal-700', 'bg-rose-700', 'bg-indigo-700', 'bg-amber-700', 'bg-emerald-700'];
            const bgColor = colors[index % colors.length];

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePlayerSelect(player)}
                className={`${bgColor} ${isSelected ? 'border-4 border-yellow-400' : 'border-2 border-yellow-600'} rounded-xl p-5 shadow-lg`}
                style={{
                  transform: isSelected ? [{ scale: 1.02 }] : [{ scale: 1 }],
                }}
              >
                <View className='flex-row items-center justify-between'>
                  <RNText className='text-yellow-100 text-2xl font-extrabold'>
                    {player}
                  </RNText>
                  {isSelected && (
                    <RNText className='text-yellow-300 text-3xl'>
                      ✓
                    </RNText>
                  )}
                </View>
                {isSelected && (
                  <RNText className='text-yellow-200 text-sm mt-2 font-semibold'>
                    Selected as Imposter
                  </RNText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Proceed Button - Only show when someone is selected */}
      {selectedPlayer && (
        <View className='w-full px-4 py-6 bg-gray-950 border-t-4 border-yellow-600'>
          <TouchableOpacity
            className='w-full bg-red-700 border-2 border-yellow-500 shadow-2xl py-4 items-center justify-center rounded-lg'
            onPress={handleProceedToResults}
          >
            <Text className='text-yellow-300 font-extrabold text-lg tracking-widest'>
              🎭 PROCEED TO RESULTS 🎭
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className='bg-gray-900 border-2 border-yellow-500'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-yellow-400 text-2xl font-bold text-center'>
              🎭 Confirm Vote
            </AlertDialogTitle>
            <AlertDialogDescription className='text-yellow-200 text-center text-base mt-2'>
              Are you sure you want to vote for{' '}
              <RNText className='font-extrabold text-yellow-300'>{selectedPlayer}</RNText>
              {' '}as the Imposter?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-row gap-3 mt-4'>
            <AlertDialogCancel className='flex-1 bg-gray-700 border-yellow-600 items-center justify-center' onPress={() => setShowConfirmDialog(false)}>
              <Text className='text-yellow-200 font-bold w-full text-center bg-transparent'>Go Back</Text>
            </AlertDialogCancel>
            <AlertDialogAction className='flex-1 bg-red-700 border-yellow-500 items-center justify-center' onPress={handleConfirmVote}>
              <Text className='text-yellow-300 font-bold w-full text-center'>Confirm</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  )
}

export default VotingPage