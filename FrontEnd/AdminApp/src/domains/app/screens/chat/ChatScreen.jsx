import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import { GiftedChat } from 'react-native-gifted-chat'
import { Background } from '../../../../theme/CongfigrationStyle'

export default function ChatScreen() {
  const [messages, setMessages] = useState([])
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={Background.jjBackground}
          resizeMode="contain"
          style={{ flex: 1, }}
        >
          <LinearHeader />
          <View style={{ marginHorizontal: 16, marginTop: 50, flex: 1 }}>

            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: 1,
              }}

            />
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})