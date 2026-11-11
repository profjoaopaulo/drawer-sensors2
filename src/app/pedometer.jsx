import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PedometerScreen() {
    // Estado que armazena a disponibilidade do sensor (nem todos os dispositivos têm)
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

    // Passos contados desde que o app começou a rodar (Listener)
    const [currentStepCount, setCurrentStepCount] = useState(0);

    // Passos totais contados hoje (Query)
    const [todayStepCount, setTodayStepCount] = useState(0);

    const [subscription, setSubscription] = useState(null);

    // Checa a disponibilidade e Inicia o Listener
    const _subscribe = async () => {
        const available = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(available));

        if (!available) {
            Alert.alert(
                'Sensor Indisponível',
                'Seu dispositivo não suporta a contagem de passos (Pedometer).'
            );
            return;
        }

        // Inicia a leitura em tempo real (Listener)
        const sub = Pedometer.watchStepCount(result => {
            setCurrentStepCount(result.steps);
        });
        setSubscription(sub);

        // Consulta os passos totais de hoje
        _getTodaySteps();
    };

    // Consulta os passos totais de hoje (Função de Query)
    const _getTodaySteps = async () => {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        try {
            const result = await Pedometer.getStepCountAsync(start, end);
            if (result.steps !== undefined) {
                setTodayStepCount(result.steps);
            }
        } catch (error) {
            console.error("Erro ao obter passos de hoje:", error);
        }
    };

    // Gerencia o Ciclo de Vida do Componente
    useEffect(() => {
        _subscribe();
        return () => {
            subscription && subscription.remove();
        };
    }, []);

    const _toggle = () => {
        if (subscription) {
            subscription.remove();
            setSubscription(null);
        } else {
            _subscribe();
        }
    };

    const statusColor = isPedometerAvailable === 'true' ? '#4CAF50' : '#FF9800';

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Contador de Passos</Text>

            {/* Cartão de Disponibilidade */}
            <View style={[styles.statusCard, { borderColor: statusColor }]}>
                <Text style={styles.statusLabel}>Sensor de Passos: </Text>
                <Text style={[styles.statusValue, { color: statusColor }]}>
                    {isPedometerAvailable === 'true' ? 'ATIVO' : 'INDISPONÍVEL'}
                </Text>
            </View>

            {/* Grid de Passos */}
            <View style={styles.grid}>
                {/* Cartão de Passos Acumulados Hoje */}
                <View style={styles.stepCard}>
                    <MaterialCommunityIcons name="foot-print" size={50} color="#2196F3" />
                    <Text style={styles.stepCount}>{todayStepCount.toLocaleString()}</Text>
                    <Text style={styles.stepLabel}>Passos de Hoje</Text>
                </View>

                {/* Cartão de Passos em Tempo Real */}
                <View style={styles.stepCard}>
                    <MaterialCommunityIcons name="walk" size={50} color="#FF5722" />
                    <Text style={styles.stepCount}>{currentStepCount.toLocaleString()}</Text>
                    <Text style={styles.stepLabel}>Passos Agora (Sessão)</Text>
                </View>
            </View>

            {/* Barra de Meta */}
            <View style={styles.goalContainer}>
                <Text style={styles.goalText}>Meta: 10.000 passos</Text>
                <View style={styles.goalBar}>
                    <View style={[styles.progress, { width: `${Math.min((todayStepCount / 10000) * 100, 100)}%` }]} />
                </View>
            </View>

            <TouchableOpacity
                onPress={_toggle}
                style={[styles.button, { backgroundColor: subscription ? '#F44336' : '#2196F3' }]}
                disabled={isPedometerAvailable !== 'true'}
            >
                <Text style={styles.buttonText}>
                    {subscription ? 'Pausar Leitura' : 'Reiniciar Leitura'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderRadius: 10,
    },
    statusLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    statusValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    stepCard: {
        width: '48%',
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#eee',
    },
    stepCount: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    stepLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    goalContainer: {
        width: '100%',
        marginBottom: 40,
        alignItems: 'center',
    },
    goalText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    goalBar: {
        width: '100%',
        height: 12,
        backgroundColor: '#eee',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 6,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
