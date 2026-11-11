import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';

const { width } = Dimensions.get('window');

export default function GyroscopeScreen() {
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const [subscription, setSubscription] = useState(null);

    const _subscribe = () => {
        // Define a atualização para ser rápida (16ms) para suavidade visual
        Gyroscope.setUpdateInterval(16);

        setSubscription(
            Gyroscope.addListener(gyroscopeData => {
                setData(gyroscopeData);
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

    const { x, y, z } = data;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giroscópio (Velocidade)</Text>
            <Text style={styles.subtitle}>
                Gire o celular rápido para ver o efeito!
            </Text>

            <View style={styles.scene}>
                {/* Simulando um objeto 3D que reage à velocidade de rotação */}
                <View
                    style={[
                        styles.square,
                        {
                            transform: [
                                { perspective: 800 }, // Dá a sensação de 3D
                                // Corrigido aqui: multiplicação correta (*) para os graus
                                { rotateX: `${x * 50}deg` },
                                { rotateY: `${y * 50}deg` },
                                // Z é a rotação como um volante
                                { rotateZ: `${z * 50}deg` }
                            ],
                        },
                    ]}
                >
                    <Text style={styles.squareText}>3D</Text>
                </View>
            </View>

            <View style={styles.dataContainer}>
                <Text style={styles.text}>x: {x.toFixed(3)}</Text>
                <Text style={styles.text}>y: {y.toFixed(3)}</Text>
                <Text style={styles.text}>z: {z.toFixed(3)}</Text>
            </View>

            <TouchableOpacity onPress={_toggle} style={styles.button}>
                <Text style={styles.buttonText}>
                    {subscription ? 'Pausar' : 'Ativar'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222', // Fundo escuro para contraste
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 40,
        textAlign: 'center',
    },
    scene: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    square: {
        width: 150,
        height: 150,
        backgroundColor: '#00d4ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#00d4ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    squareText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 24,
    },
    dataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: '#ff4757',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
