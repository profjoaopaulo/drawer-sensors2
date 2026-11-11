import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LightSensor } from 'expo-sensors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Limite de luz (em lux) para determinar se é "claro" ou "escuro"
// 50 lux é o valor comum para uma sala bem iluminada.
const LIGHT_THRESHOLD = 50;

export default function LightSensorScreen() {
    const [illuminance, setIlluminance] = useState(0);
    const [subscription, setSubscription] = useState(null);

    const _subscribe = () => {
        // Define a atualização para ser a cada 200ms
        LightSensor.setUpdateInterval(200);

        setSubscription(
            LightSensor.addListener(({ illuminance }) => {
                // O valor 'illuminance' é medido em lux (lúmens por metro quadrado)
                setIlluminance(illuminance);
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

    // Lógica principal: determina o tema
    const isDarkTheme = illuminance < LIGHT_THRESHOLD;

    // Estilos dinâmicos baseados no tema
    const theme = {
        background: isDarkTheme ? '#121212' : '#FFFFFF',
        text: isDarkTheme ? '#E0E0E0' : '#1C1C1C',
        card: isDarkTheme ? '#2C2C2C' : '#F5F5F5',
        iconColor: isDarkTheme ? '#BB86FC' : '#FFC107',
    };

    // Escolha do ícone e mensagem
    let iconName, statusMessage;
    if (illuminance >= 5000) {
        iconName = 'white-balance-sunny';
        statusMessage = 'Luz Intensa (Externa/Foco)';
    } else if (illuminance > LIGHT_THRESHOLD) {
        iconName = 'lightbulb-on';
        statusMessage = 'Ambiente Claro (Modo Dia)';
    } else if (illuminance > 5) {
        iconName = 'lightbulb-outline';
        statusMessage = 'Ambiente Escuro (Modo Noite)';
    } else {
        iconName = 'moon-waning-crescent';
        statusMessage = 'Escuridão Total';
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.text }]}>
                Detector de Luz Ambiente
            </Text>

            {/* Cartão de Leitura de Lux */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.text }]}>
                <Text style={[styles.label, { color: theme.text }]}>LUZ ATUAL (Lux)</Text>
                <Text style={[styles.value, { color: theme.text }]}>
                    {illuminance.toFixed(1)} <Text style={[styles.unit, { color: theme.text }]}>lx</Text>
                </Text>
            </View>

            {/* Cartão de Status e Ícone */}
            <View style={[styles.statusCard, { backgroundColor: theme.card }]}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={70}
                    color={theme.iconColor}
                />
                <Text style={[styles.statusText, { color: theme.text }]}>
                    {statusMessage}
                </Text>
            </View>

            {/* Indicador do Tema Ativo */}
            <View style={[styles.themeIndicator, { backgroundColor: theme.card }]}>
                <Text style={[styles.themeLabel, { color: theme.text }]}>
                    TEMA ATIVO:
                </Text>
                <Text style={[styles.themeValue, { color: theme.iconColor }]}>
                    {isDarkTheme ? 'ESCURO' : 'CLARO'}
                </Text>
            </View>

            <TouchableOpacity onPress={_toggle} style={[styles.button, { backgroundColor: theme.iconColor }]}>
                <Text style={[styles.buttonText, { color: isDarkTheme ? '#121212' : '#FFFFFF' }]}>
                    {subscription ? 'Pausar Leitura' : 'Ativar Sensor'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    card: {
        width: '100%',
        borderRadius: 15,
        padding: 25,
        marginBottom: 20,
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 10,
    },
    value: {
        fontSize: 60,
        fontWeight: 'bold',
    },
    unit: {
        fontSize: 24,
        fontWeight: 'normal',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        marginBottom: 20,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        flexShrink: 1,
    },
    themeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 30,
    },
    themeLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
    },
    themeValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
