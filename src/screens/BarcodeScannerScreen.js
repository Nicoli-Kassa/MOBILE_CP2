// src/screens/BarcodeScannerScreen.js
// Tema: flat design, verde lima #BFDA45, preto, branco

import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function BarcodeScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  function handleBarcodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);
    navigation.navigate('Home', { scannedBarcode: data });
  }

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Verificando câmera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconBox}>
            <Text style={styles.permissionIcon}>📷</Text>
          </View>
          <Text style={styles.permissionTitle}>Acesso à câmera</Text>
          <Text style={styles.permissionSub}>
            Para ler códigos de barras precisamos acessar sua câmera.
          </Text>
          <TouchableOpacity style={styles.btnGreen} onPress={requestPermission}>
            <Text style={styles.btnGreenText}>Permitir acesso →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Câmera */}
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* Overlay de mira centralizada */}
      <View style={styles.reticleWrapper} pointerEvents="none">
        <View style={styles.reticle}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.reticleHint}>
          {scanned ? 'Código detectado!' : 'Aponte para um código de barras'}
        </Text>
      </View>

      {/* Painel inferior */}
      <View style={styles.panel}>
        <View style={styles.panelPill} />
        <Text style={styles.panelTitle}>
          {scanned ? '✅ Leitura concluída' : '🔖 Leitor de Código'}
        </Text>

        {scanned && (
          <TouchableOpacity
            style={styles.btnGreen}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.btnGreenText}>Ler novamente →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.btnBlack}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnBlackText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const G     = '#BFDA45';
const BLACK = '#1A1A1A';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BLACK },
  camera: { flex: 1 },

  // Mira de leitura
  reticleWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticle: {
    width: 220,
    height: 150,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: G,
    borderWidth: 4,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  reticleHint: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // Painel inferior
  panel: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  panelPill: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: BLACK,
    marginBottom: 20,
  },

  btnGreen: {
    backgroundColor: G,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  btnGreenText: { color: BLACK, fontWeight: '800', fontSize: 15 },

  btnBlack: {
    backgroundColor: BLACK,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  btnBlackText: { color: WHITE, fontWeight: '700', fontSize: 15 },

  // Telas de permissão
  permissionScreen: {
    flex: 1,
    backgroundColor: G,
    justifyContent: 'center',
    padding: 28,
  },
  permissionCard: {
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
  },
  permissionIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  permissionIcon: { fontSize: 32 },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: BLACK,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: G },
  message: { color: BLACK, fontSize: 15, fontWeight: '600' },
});