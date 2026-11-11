import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

// O RootLayout agora precisa envolver o Drawer com o GestureHandlerRootView
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerActiveBackgroundColor: '#f0f0ff',
          drawerActiveTintColor: '#007aff',
        }}
      >
        {/* Configuração para a tela index */}
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Início do Aplicativo',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        {/* Configuração para a tela accelerometer */}
        <Drawer.Screen
          name="accelerometer"
          options={{
            drawerLabel: 'Accelerometer',
            title: 'Acelerômetro',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="rocket" size={size} color={color} />
            ),
          }}
        />

        {/* Configuração para a tela gyroscope */}
        <Drawer.Screen
          name="gyroscope"
          options={{
            drawerLabel: 'Gyroscope',
            title: 'Giroscópio',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="basketball" size={size} color={color} />
            ),
          }}
        />

        {/* Configuração para a tela barometer */}
        <Drawer.Screen
          name="barometer"
          options={{
            drawerLabel: 'Barometer',
            title: 'Barômetro',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="cloud" size={size} color={color} />
            ),
          }}
        />

        {/* Configuração para a tela lightsensor */}
        <Drawer.Screen
          name="lightsensor"
          options={{
            drawerLabel: 'Light Sensor',
            title: 'Sensor de Luz',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="sunny" size={size} color={color} />
            ),
          }}
        />

        {/* Configuração para a tela magnetometer */}
        <Drawer.Screen
          name="magnetometer"
          options={{
            drawerLabel: 'Magnetometer',
            title: 'Magnetômetro',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="magnet" size={size} color={color} />
            ),
          }}
        />

        {/* Configuração para a tela pedometer */}
        <Drawer.Screen
          name="pedometer"
          options={{
            drawerLabel: 'Pedometer',
            title: 'Pedômetro',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="footsteps" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
