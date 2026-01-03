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
import { Text } from 'react-native';
import { View } from 'react-native';
import { GamePayload } from '@/app/index';
import useGameStore from '@/app/store/gameStore';
import { useRouter } from 'expo-router';

interface StartGameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gamePayload?: GamePayload;
}

// Helper function to convert milliseconds back to time string
function millisecondsToTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function StartGameDialog({ open, onOpenChange, gamePayload }: StartGameDialogProps) {

    if (gamePayload === undefined) {
        return null; // or some fallback UI
    };

    const router = useRouter();
    const startGame = useGameStore((state) => state.startGame);

    const handleSubmit = () => {
        onOpenChange(false);
        startGame(gamePayload, router);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className='bg-gray-900 border-2 border-yellow-600'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-yellow-300 text-2xl'>🎭 Ready to Start?</AlertDialogTitle>
                    <AlertDialogDescription className='text-gray-300'>
                        Are you sure you want to start the game with the following settings?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <View className='py-4 gap-3'>
                    {/* Categories */}
                    <View>
                        <Text className='text-yellow-400 font-semibold mb-1'>📋 Categories:</Text>
                        <Text className='text-white ml-2'>{gamePayload.categories.join(', ')}</Text>
                    </View>

                    {/* Custom Topics */}
                    {gamePayload.customTopics && gamePayload.customTopics.length > 0 && (
                        <View>
                            <Text className='text-yellow-400 font-semibold mb-1'>✏️ Custom Topics:</Text>
                            <Text className='text-white ml-2'>{gamePayload.customTopics.join(', ')}</Text>
                        </View>
                    )}

                    {/* Players */}
                    <View>
                        <Text className='text-yellow-400 font-semibold mb-1'>👥 Players ({gamePayload.players.length}):</Text>
                        <Text className='text-white ml-2'>{gamePayload.players.join(', ')}</Text>
                    </View>

                    {/* Clue */}
                    <View>
                        <Text className='text-yellow-400 font-semibold mb-1'>🕵️ Imposter Gets Clue:</Text>
                        <Text className='text-white ml-2'>{gamePayload.clue ? 'Yes' : 'No'}</Text>
                    </View>

                    {/* Time */}
                    <View>
                        <Text className='text-yellow-400 font-semibold mb-1'>⏱️ Conversation Time:</Text>
                        <Text className='text-white ml-2'>{millisecondsToTime(gamePayload.timeInMs)}</Text>
                    </View>
                </View>

                <AlertDialogFooter>
                    <AlertDialogCancel className='bg-gray-700 border-gray-600'>
                        <Text className='text-white'>Cancel</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='bg-red-700 border-2 border-yellow-500'
                        onPress={() => {handleSubmit();}}
                    >
                        <Text className='text-yellow-300 font-bold'>🎭 Start Game</Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}