import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        }}
      >
        <Stack.Screen
          name='index'
          options={{
            title: 'コーヒー日記',
          }}
        />
        <Stack.Screen
          name='entryList'
          options={{
            title: '記録一覧',
          }}
        />
        <Stack.Screen
          name='newEntry'
          options={{
            title: '新規記録',
          }}
        />
        <Stack.Screen
          name='entryDetail/[id]'
          options={{
            title: '記録詳細',
          }}
        />
        <Stack.Screen
          name='editEntry/[id]'
          options={{
            title: '記録編集',
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
