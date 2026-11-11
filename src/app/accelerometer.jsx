import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';

// Obtemos as dimensões da tela com Dimensions para calcular o centro
const { width, height } = Dimensions.get('window');
const BALL_SIZE = 50; // Tamanho da bolinha

export default function AccelerometerScreen() {
    // Estado para armazenar os dados do acelerômetro
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    // Estado para controlar se a leitura está ativa ou pausada
    const [subscription, setSubscription] = useState(null);

    // Função para ativar/desativar o sensor
    const _toggle = () => {
        if (subscription) {
            _unsubscribe();
        } else {
            _subscribe();
        }
    };

    const _subscribe = () => {
        // Define a frequência de atualização (em ms). 
        // 16ms é aproximadamente 60fps (movimento suave).
        Accelerometer.setUpdateInterval(16);

        // Adiciona o listener e guarda a subscrição no estado
        setSubscription(
            Accelerometer.addListener(accelerometerData => {
                setData(accelerometerData);
            })
        );
    };

    const _unsubscribe = () => {
        // Remove o listener e limpa o estado
        subscription && subscription.remove();
        setSubscription(null);
    };

    // useEffect para iniciar o sensor ao montar o componente
    // e limpar ao desmontar
    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    const { x, y, z } = data;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Exemplo Acelerômetro</Text>

            {/* Área visual da bolinha */}
            <View style={styles.sensorContainer}>
                <View
                    style={[
                        styles.ball,
                        {
                            // Cálculo simples para mover a bola baseada na inclinação.
                            // Multiplicamos por 150 para ampliar o movimento.
                            transform: [
                                { translateX: x * 150 },
                                { translateY: y * -150 } // Invertemos Y para parecer natural
                            ],
                        },
                    ]}
                />
            </View>

            {/* Exibição dos dados brutos */}
            <View style={styles.dataContainer}>
                <Text style={styles.text}>x: {x.toFixed(3)}</Text>
                <Text style={styles.text}>y: {y.toFixed(3)}</Text>
                <Text style={styles.text}>z: {z.toFixed(3)}</Text>
            </View>

            {/* Botão de Controle */}
            <TouchableOpacity onPress={_toggle} style={styles.button}>
                <Text style={styles.buttonText}>
                    {subscription ? 'Pausar Leitura' : 'Ativar Leitura'}
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
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    sensorContainer: {
        width: width - 50,
        height: 300,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden', // Mantém a bola dentro visualmente
    },
    ball: {
        width: BALL_SIZE,
        height: BALL_SIZE,
        borderRadius: BALL_SIZE / 2,
        backgroundColor: 'tomato',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        fontFamily: 'monospace', // Ajuda a manter os números alinhados
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
