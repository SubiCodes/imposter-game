import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const ViewWord = () => {
    const payload = useLocalSearchParams();
    return (
        <View>
            <Text>{JSON.stringify(payload, null, 2)}</Text>
        </View>
    )
}

export default ViewWord