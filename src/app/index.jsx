import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IndexScreen() {
  const sensorsList = [
    { name: 'Acelerômetro', icon: 'rocket', desc: 'Mede aceleração e inclinação em 3D' },
    { name: 'Giroscópio', icon: 'basketball', desc: 'Mede velocidade de rotação e giros' },
    { name: 'Barômetro', icon: 'cloud', desc: 'Mede pressão atmosférica e altitude' },
    { name: 'Sensor de Luz', icon: 'sunny', desc: 'Mede a intensidade de luz ambiente' },
    { name: 'Magnetômetro', icon: 'magnet', desc: 'Funciona como bússola digital' },
    { name: 'Pedômetro', icon: 'footsteps', desc: 'Conta passos e movimento' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="compass-outline" size={48} color="#007aff" />
        </View>
        <Text style={styles.title}>Sensores do Dispositivo</Text>
        <Text style={styles.subtitle}>
          Explore e interaja com os sensores nativos do seu smartphone em tempo real através do menu lateral.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Sensores Disponíveis</Text>

      <View style={styles.gridContainer}>
        {sensorsList.map((item, index) => (
          <View key={index} style={styles.card}>
            <Ionicons name={item.icon} size={28} color="#007aff" style={styles.cardIcon} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginLeft: 5,
  },
  gridContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: '#777',
  },
});
