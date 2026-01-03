import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import React from 'react'
import { Button } from '../button';
import { useColorScheme } from 'nativewind';
import { Icon } from '../icon';

const ThemeToggle = () => {
    const THEME_ICONS = {
        light: SunIcon,
        dark: MoonStarIcon,
    };

    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <Button
            onPressIn={toggleColorScheme}
            size="icon"
            variant="ghost"
            className="ios:size-9 rounded-full web:mx-4 p-0">
            <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
        </Button>
    );

}

export default ThemeToggle