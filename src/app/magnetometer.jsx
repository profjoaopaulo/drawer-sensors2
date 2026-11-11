import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Magnetometer } from 'expo-sensors';

// O campo magnético da Terra está tipicamente entre 25 µT e 65 µT.
const THRESHOLD_ALERTA = 100; // Alerta acima de 100 µT

export default function MagnetometerScreen() {
    const [magnetism, setMagnetism] = useState({ x: 0, y: 0, z: 0, magnitude: 0 });
    const [subscription, setSubscription] = useState(null);

    // Animação para o "medidor" visual
    const [needleRotation] = useState(new Animated.Value(0));

    // Função para calcular a magnitude total (intensidade do campo)
    const calculateMagnitude = (x, y, z) => {
        // Magnitude (B) = Raiz Quadrada (X² + Y² + Z²)
        return Math.sqrt(x * x + y * y + z * z);
    };

    const _subscribe = () => {
        Magnetometer.setUpdateInterval(100); // Atualiza 10 vezes por segundo

        setSubscription(
            Magnetometer.addListener(({ x, y, z }) => {
                const magnitude = calculateMagnitude(x, y, z);
                setMagnetism({ x, y, z, magnitude });

                // Atualiza a animação da agulha
                animateNeedle(magnitude);
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

    const _toggle = () => {
        if (subscription) {
            _unsubscribe();
        } else {
            _subscribe();
        }
    };

    // Mapeia a magnitude (0 a 300) para um ângulo de rotação (0 a 180 graus)
    const animateNeedle = (magnitude) => {
        const maxMagnitude = 300;
        let normalizedValue = Math.min(magnitude, maxMagnitude) / maxMagnitude;

        const rotationDegrees = normalizedValue * 180;

        Animated.timing(needleRotation, {
            toValue: rotationDegrees,
            duration: 50,
            useNativeDriver: true,
        }).start();
    };

    const isDangerous = magnetism.magnitude > THRESHOLD_ALERTA;
    const alertColor = isDangerous ? '#FF3B30' : '#00A86B'; // Vermelho ou Verde
    const statusMessage = isDangerous ? 'CAMPO FORTE DETECTADO!' : 'Campo Estável (Terra)';

    const needleStyle = {
        transform: [{
            rotate: needleRotation.interpolate({
                inputRange: [0, 180],
                outputRange: ['-90deg', '90deg']
            })
        }]
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Detector Magnético</Text>

            {/* Medidor Visual */}
            <View style={styles.meterContainer}>
                <View style={[styles.meterBase, { borderColor: alertColor }]}>
                    <Animated.View style={[styles.needle, needleStyle]} />
                </View>
                <Text style={styles.meterRange}>0 µT</Text>
                <Text style={[styles.meterRange, { textAlign: 'right' }]}>300 µT</Text>
            </View>

            {/* Valor da Magnitude */}
            <View style={[styles.valueCard, { backgroundColor: alertColor }]}>
                <Text style={styles.label}>MAGNITUDE TOTAL</Text>
                <Text style={styles.value}>
                    {magnetism.magnitude.toFixed(1)} <Text style={styles.unit}>µT</Text>
                </Text>
                <Text style={styles.statusMessage}>{statusMessage}</Text>
            </View>

            {/* Leituras dos Eixos */}
            <View style={styles.axisContainer}>
                <Text style={styles.axisText}>X: {magnetism.x.toFixed(2)} µT</Text>
                <Text style={styles.axisText}>Y: {magnetism.y.toFixed(2)} µT</Text>
                <Text style={styles.axisText}>Z: {magnetism.z.toFixed(2)} µT</Text>
            </View>

            <TouchableOpacity onPress={_toggle} style={[styles.button, { backgroundColor: alertColor }]}>
                <Text style={styles.buttonText}>
                    {subscription ? 'Pausar Sensor' : 'Ativar Sensor'}
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
        marginBottom: 30,
        color: '#333',
    },
    meterContainer: {
        width: '80%',
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    meterBase: {
        width: 200,
        height: 100,
        borderRadius: 100,
        borderWidth: 4,
        borderBottomWidth: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    needle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -1, // Centraliza a agulha de 2px de largura
        width: 2,
        height: 100,
        backgroundColor: '#333',
        transformOrigin: 'top center',
    },
    meterRange: {
        position: 'absolute',
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
        bottom: -20,
        left: 0,
        right: 0,
    },
    valueCard: {
        width: '100%',
        borderRadius: 15,
        padding: 25,
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1.5,
        marginBottom: 5,
        color: '#fff',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff',
    },
    unit: {
        fontSize: 20,
        fontWeight: 'normal',
    },
    statusMessage: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    axisContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    axisText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
        fontFamily: 'monospace',
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
