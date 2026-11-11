import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Barometer } from 'expo-sensors';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ícones bonitos

// Pressão padrão ao nível do mar (hPa). 
// Em um app real, isso seria ajustado com dados de uma API de clima local.
const STANDARD_SEA_LEVEL_PRESSURE = 1013.25;

export default function BarometerScreen() {
    const [pressure, setPressure] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [subscription, setSubscription] = useState(null);

    // Histórico simples para determinar tendência
    const [history, setHistory] = useState([]);

    const _toggle = () => {
        if (subscription) {
            _unsubscribe();
        } else {
            _subscribe();
        }
    };

    const _subscribe = () => {
        Barometer.setUpdateInterval(500); // Atualiza a cada meio segundo (500 ms)

        setSubscription(
            Barometer.addListener(({ pressure }) => {
                setPressure(pressure);

                // Fórmula Internacional Barométrica para altitude
                // h = 44330 * (1 - (P / P0)^(1/5.255))
                const calculatedAltitude = 44330 * (1 - Math.pow(pressure / STANDARD_SEA_LEVEL_PRESSURE, 1 / 5.255));
                setAltitude(calculatedAltitude);

                // Adiciona ao histórico (limitado aos últimos 20 pontos para gráfico ou tendência)
                setHistory(prev => {
                    const newHistory = [...prev, pressure];
                    if (newHistory.length > 20) newHistory.shift();
                    return newHistory;
                });
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    // Lógica simples de previsão baseada na pressão absoluta
    const getWeatherIcon = (p) => {
        if (p < 1000) return { name: 'weather-pouring', color: '#4a90e2', label: 'Chuvoso / Baixa Pressão' };
        if (p > 1020) return { name: 'weather-sunny', color: '#f5a623', label: 'Ensolarado / Alta Pressão' };
        return { name: 'weather-partly-cloudy', color: '#b8cdd6', label: 'Estável / Nublado' };
    };

    const weather = getWeatherIcon(pressure);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Estação Barométrica</Text>

            {/* Cartão Principal de Pressão */}
            <View style={styles.card}>
                <Text style={styles.label}>PRESSÃO ATMOSFÉRICA</Text>
                <Text style={styles.value}>
                    {pressure.toFixed(1)} <Text style={styles.unit}>hPa</Text>
                </Text>
            </View>

            {/* Cartão de Altitude */}
            <View style={[styles.card, { backgroundColor: '#333' }]}>
                <MaterialCommunityIcons name="elevation-rise" size={32} color="#fff" style={{ marginBottom: 10 }} />
                <Text style={[styles.label, { color: '#aaa' }]}>ALTITUDE ESTIMADA</Text>
                <Text style={[styles.value, { color: '#fff' }]}>
                    {altitude.toFixed(1)} <Text style={styles.unit}>metros</Text>
                </Text>
                <Text style={styles.disclaimer}>*Baseado na pressão padrão do mar.</Text>
            </View>

            {/* Cartão de Previsão do Tempo */}
            <View style={[styles.card, { borderColor: weather.color, borderLeftWidth: 10 }]}>
                <Text style={styles.label}>CONDIÇÃO ATUAL</Text>
                <View style={styles.weatherRow}>
                    <MaterialCommunityIcons name={weather.name} size={60} color={weather.color} />
                    <Text style={[styles.weatherText, { color: weather.color }]}>
                        {weather.label}
                    </Text>
                </View>
            </View>

            <TouchableOpacity onPress={_toggle} style={styles.button}>
                <Text style={styles.buttonText}>
                    {subscription ? 'Pausar Leitura' : 'Ativar Sensor'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        letterSpacing: 1.5,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#222',
    },
    unit: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#666',
    },
    disclaimer: {
        fontSize: 10,
        color: '#666',
        marginTop: 10,
        fontStyle: 'italic',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    weatherText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        flexShrink: 1, // Para texto não estourar
    },
    button: {
        marginTop: 10,
        backgroundColor: '#222',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
