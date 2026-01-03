import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

/**
 * Custom hook for managing background music with play, pause, and stop controls
 * @param audioSource - The audio file to play (use require() for local files)
 * @param volume - Initial volume (0.0 to 1.0), defaults to 0.3
 * @returns Object with play, pause, stop methods and isPlaying state
 */
export const useBackgroundMusic = (audioSource: any, volume: number = 0.3) => {
    const player = useAudioPlayer(audioSource);

    // Set initial configuration
    useEffect(() => {
        player.loop = true; // Always loop the audio
        player.volume = volume; // Set volume
    }, [volume]);

    const play = () => {
        if (!player.playing) {
            player.play();
        }
    };

    const pause = () => {
        if (player.playing) {
            player.pause();
        }
    };

    const stop = () => {
        if (player.playing) {
            player.pause();
        }
        // Don't try to reset currentTime, it's read-only in expo-audio
        // The audio will resume from where it was paused when play is called again
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            try {
                if (player) {
                    player.pause();
                    // Don't call player.remove() as it causes errors
                }
            } catch (error) {
                // Ignore cleanup errors
            }
        };
    }, []);

    return {
        play,
        pause,
        stop,
        isPlaying: player.playing,
        setVolume: (vol: number) => {
            player.volume = vol;
        },
    };
};
