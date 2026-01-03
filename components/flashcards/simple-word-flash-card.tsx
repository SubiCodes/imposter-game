import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';

export type SimpleFlashCardProps = {
    playerName: string;
    word: string;
    isImposter: boolean;
    clue?: string;
    currentNumber: number;
    totalPlayers: number;
    cardColor?: string;
}

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

export default function SimpleFlashCard({ data }: { data: SimpleFlashCardProps }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const flipAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        // Start timer for 2 seconds
        holdTimer.current = setTimeout(() => {
            setIsFlipped(true);
            // Animate flip to back
            Animated.spring(flipAnim, {
                toValue: 180,
                useNativeDriver: true,
                friction: 8,
                tension: 10,
            }).start();
        }, 500);
    };

    const handlePressOut = () => {
        // Clear timer if released before 2 seconds
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
        // Flip back to front when released
        setIsFlipped(false);
        Animated.spring(flipAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 10,
        }).start();
    };

    // Get background colors - different for front and back
    const frontColors = ['#b91c1c', '#7e22ce', '#1d4ed8', '#0f766e', '#e11d48', '#4338ca', '#b45309', '#047857'];
    const frontBgColor = frontColors[(data.currentNumber - 1) % frontColors.length];
    
    // Back side: all black for everyone
    const backBgColor = '#000000';

    // Interpolate rotation
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    // Determine which side to show based on flip value
    const showFront = !isFlipped;

    return (
        <View style={styles.container}>
            <Pressable 
                onPressIn={handlePressIn} 
                onPressOut={handlePressOut}
                style={styles.pressable}
            >
                <View style={styles.flipContainer}>
                    {/* Front Side */}
                    {showFront && (
                        <Animated.View style={[styles.card, { backgroundColor: frontBgColor }, frontAnimatedStyle]}>
                            <View style={styles.cardContent}>
                                <View style={styles.centerContent}>
                                    <Text style={styles.playerName}>
                                        {data.playerName}
                                    </Text>
                                    <Text style={styles.instruction}>
                                        Hold for a second to reveal
                                    </Text>
                                </View>
                                <View style={styles.counterContainer}>
                                    <Text style={styles.counter}>
                                        {data.currentNumber} / {data.totalPlayers}
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    )}

                    {/* Back Side */}
                    {!showFront && (
                        <Animated.View style={[styles.card, { backgroundColor: backBgColor }, backAnimatedStyle]}>
                            <View style={styles.cardContent}>
                                <View style={styles.centerContent}>
                                    {data.isImposter ? (
                                        <View style={styles.imposterContainer}>
                                            <Text style={styles.imposterText}>
                                                🎭 IMPOSTER
                                            </Text>
                                            <View style={styles.clueContainer}>
                                                <Text style={styles.clueLabel}>
                                                    Clue:
                                                </Text>
                                                <Text style={styles.clueText}>
                                                    {data.clue || 'No clue provided'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={styles.wordText}>
                                            {data.word}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.counterContainer}>
                                    <Text style={styles.counter}>
                                        {data.currentNumber} / {data.totalPlayers}
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    )}
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 400,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressable: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipContainer: {
        width: 320,
        height: 400,
    },
    card: {
        position: 'absolute',
        width: 320,
        height: 400,
        borderRadius: 12,
        padding: 32,
        borderWidth: 4,
        borderColor: '#eab308',
        justifyContent: 'space-between',
        backfaceVisibility: 'hidden',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerName: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fde047',
        textAlign: 'center',
        marginBottom: 8,
    },
    instruction: {
        color: '#fef08a',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    counterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    counter: {
        color: '#facc15',
        fontSize: 14,
        fontWeight: '600',
    },
    imposterContainer: {
        alignItems: 'center',
        gap: 12,
    },
    imposterText: {
        fontSize: 48,
        fontWeight: '800',
        color: '#dc2626',
        textAlign: 'center',
    },
    clueContainer: {
        marginTop: 24,
    },
    clueLabel: {
        color: '#facc15',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 8,
    },
    clueText: {
        fontSize: 30,
        fontWeight: '700',
        color: '#fde047',
        textAlign: 'center',
    },
    wordText: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fde047',
        textAlign: 'center',
    },
});
