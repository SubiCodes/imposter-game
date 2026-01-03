import React, { ReactNode, useRef } from 'react';
import { Pressable, SafeAreaView, View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type ContentProps = {
  playerName?: string;
  word?: string;
  isImposter?: boolean;
  clue?: string;
  currentNumber: number;
  totalPlayers: number;
  cardColor?: string;
};

const RegularContent: React.FC<ContentProps> = ({ playerName, currentNumber, totalPlayers, cardColor = 'bg-red-700' }) => {
  return (
    <View className={`flex-1 min-w-full min-h-full ${cardColor} rounded-xl items-center justify-center flex-col p-8 border-4 border-yellow-500`}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl font-extrabold text-yellow-300 text-center mb-2">
          {playerName}
        </Text>
        <Text className="text-yellow-200 text-base mt-4">
          Hold for a second to reveal
        </Text>
      </View>
      <View className="items-center justify-center">
        <Text className="text-yellow-400 text-sm font-semibold">
          {currentNumber} / {totalPlayers}
        </Text>
      </View>
    </View>
  );
};

const FlippedContent: React.FC<ContentProps> = ({ word, isImposter, clue, currentNumber, totalPlayers, cardColor = 'bg-red-700' }) => {
  return (
    <View className={`flex-1 min-w-full min-h-full ${isImposter ? 'bg-gray-900' : cardColor} rounded-xl items-center justify-center flex-col p-8 border-4 border-yellow-500`}>
      <View className="flex-1 items-center justify-center">
        {isImposter ? (
          <View className="items-center gap-3">
            <Text className="text-3xl font-extrabold text-red-600 text-center">
              IMPOSTER
            </Text>
            {clue && (
              <View className="mt-6">
                <Text className="text-yellow-400 font-semibold text-center text-lg mb-2">Clue:</Text>
                <Text className="text-3xl font-bold text-yellow-300 text-center">
                  {clue}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text className="text-5xl font-extrabold text-yellow-300 text-center">
            {word}
          </Text>
        )}
      </View>
      <View className="items-center justify-center">
        <Text className="text-yellow-400 text-sm font-semibold">
          {currentNumber} / {totalPlayers}
        </Text>
      </View>
    </View>
  );
};


type FlipCardProps = {
    isFlipped: { value: boolean } | import('react-native-reanimated').SharedValue<boolean>;
    cardStyle?: StyleProp<ViewStyle>;
    direction?: 'x' | 'y';
    duration?: number;
    RegularContent?: ReactNode;
    FlippedContent?: ReactNode;
    onPressIn?: () => void;
    onPressOut?: () => void;
    data: FlashCardProps
};

export type FlashCardProps = {
    playerName: string;
    word: string;
    isImposter: boolean;
    clue?: string;
    currentNumber: number;
    totalPlayers: number;
    cardColor?: string;
}

type FlashCardComponentProps = {
  data: FlashCardProps;
};

// Color variants for different players
const cardColors = [
    'bg-red-700',
    'bg-purple-700',
    'bg-blue-700',
    'bg-teal-700',
    'bg-rose-700',
    'bg-indigo-700',
    'bg-amber-700',
    'bg-emerald-700',
];

const FlipCard: React.FC<FlipCardProps> = ({
    isFlipped,
    cardStyle,
    direction = 'y',
    duration = 500,
    RegularContent,
    FlippedContent,
    onPressIn,
    onPressOut,
    data
}) => {
    const isDirectionX = direction === 'x';

    const regularCardAnimatedStyle = useAnimatedStyle(() => {
        // ensure we work with numeric values for interpolation
        const current = typeof (isFlipped as any)?.value === 'boolean' ? ((isFlipped as any).value ? 1 : 0) : Number((isFlipped as any).value);
        const spinValue = interpolate(current, [0, 1], [0, 180]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [
                isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
            ],
        } as any;
    });

    const flippedCardAnimatedStyle = useAnimatedStyle(() => {
        const current = typeof (isFlipped as any)?.value === 'boolean' ? ((isFlipped as any).value ? 1 : 0) : Number((isFlipped as any).value);
        const spinValue = interpolate(current, [0, 1], [180, 360]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [
                isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
            ],
        } as any;
    });

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} className='w-full'>
            <View className=' w-full h-full items-center justify-center' >
                <Animated.View
                    className='max-w-[90%] max-h-[80%]'
                    style={[
                        flipCardStyles.regularCard,
                        cardStyle,
                        regularCardAnimatedStyle,
                    ]}
                >
                    {RegularContent}
                </Animated.View>
                <Animated.View
                    className='max-w-[90%] max-h-[80%]'
                    style={[
                        flipCardStyles.flippedCard,
                        flippedCardAnimatedStyle,
                    ]}
                >
                    {FlippedContent}
                </Animated.View>
            </View>
        </Pressable>
    );
};

const flipCardStyles = StyleSheet.create({
    regularCard: {
        position: 'absolute',
        zIndex: 1,
        backfaceVisibility: 'hidden',
    },
    flippedCard: {
        zIndex: 2,
        backfaceVisibility: 'hidden',
    },
});

export default function FlashCard({data} : FlashCardComponentProps) {
    const isFlipped = useSharedValue(false);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);

    const handlePressIn = () => {
        // Start timer for 2 seconds
        holdTimer.current = setTimeout(() => {
            isFlipped.value = true;
        }, 500);
    };

    const handlePressOut = () => {
        // Clear timer if released before 2 seconds
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
        // Always flip back to front when released
        isFlipped.value = false;
    };

    // Get color based on player index, or use provided color
    const cardColor = data.cardColor || cardColors[(data.currentNumber - 1) % cardColors.length];

    return (
        <SafeAreaView style={styles.container}>
            <FlipCard
                isFlipped={isFlipped}
                cardStyle={styles.flipCard}
                FlippedContent={
                    <FlippedContent 
                        word={data.word} 
                        isImposter={data.isImposter}
                        clue={data.clue}
                        currentNumber={data.currentNumber} 
                        totalPlayers={data.totalPlayers}
                        cardColor={cardColor}
                    />
                }
                RegularContent={
                    <RegularContent 
                        playerName={data.playerName} 
                        currentNumber={data.currentNumber} 
                        totalPlayers={data.totalPlayers}
                        cardColor={cardColor}
                    />
                }
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                data={data}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 400,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        backgroundColor: '#b58df1',
        padding: 12,
        borderRadius: 48,
    },
    toggleButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    flipCard: {
        backfaceVisibility: 'hidden',
    },
});