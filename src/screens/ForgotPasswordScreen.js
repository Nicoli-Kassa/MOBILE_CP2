// src/screens/ForgotPasswordScreen.js
// Tema: flat design, verde lima #BFDA45, preto, branco

import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import { resetUserPassword } from '../firebase/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu email.');
      return;
    }
    try {
      setLoading(true);
      await resetUserPassword(email.trim());
      setSent(true);
    } catch (error) {
      Alert.alert('Erro ao enviar email', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header verde */}
        <View style={styles.topBlock}>
          <View style={styles.shapeA} />
          <View style={styles.shapeB} />

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.topLabel}>{sent ? 'PRONTO!' : 'SEGURANÇA'}</Text>
          <Text style={styles.topTitle}>
            {sent ? 'Email enviado' : 'Recuperar senha'}
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {!sent ? (
            <>
              {/* Instrução */}
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  🔑  Informe o email cadastrado e enviaremos um link para redefinir sua senha.
                </Text>
              </View>

              <TextInput
                placeholder="Email"
                placeholderTextColor="#9aaa6a"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <TouchableOpacity
                style={[styles.btnBlack, loading && { opacity: 0.6 }]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.btnBlackText}>
                  {loading ? 'Enviando…' : 'Enviar link →'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.btnOutlineText}>Voltar ao login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Estado de sucesso */}
              <View style={styles.successCard}>
                <Text style={styles.successEmoji}>✅</Text>
                <Text style={styles.successTitle}>Tudo certo!</Text>
                <Text style={styles.successText}>
                  Enviamos as instruções para{'\n'}
                  <Text style={styles.successEmail}>{email}</Text>
                </Text>
                <Text style={styles.successHint}>
                  Não esqueça de verificar a pasta de spam.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnBlack}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.btnBlackText}>Voltar ao login →</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const G     = '#BFDA45';
const BLACK = '#1A1A1A';
const WHITE = '#FFFFFF';
const FIELD = '#F4F8E8';

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: G },
  scroll: { flexGrow: 1 },

  topBlock: {
    backgroundColor: G,
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 28,
    minHeight: 120,
    overflow: "hidden",
    position: "relative",
  },
  shapeA: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 75,
    backgroundColor: BLACK,
    top: -50,
    right: -30,
    opacity: 0.9,
  },
   shapeB: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8FAF20",
    bottom: 20,
    right: 100,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    zIndex: 1,
  },
  backBtnText: { color: WHITE, fontSize: 18, fontWeight: '700' },

  topLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: BLACK,
    letterSpacing: 3,
    opacity: 0.5,
    zIndex: 1,
  },
  topTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: BLACK,
    letterSpacing: -1,
    lineHeight: 44,
    zIndex: 1,
  },

  card: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flex: 1,
    padding: 28,
    paddingTop: 32,
  },

  infoBox: {
    backgroundColor: FIELD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: G,
  },
  infoBoxText: { color: BLACK, fontSize: 14, lineHeight: 20 },

  input: {
    backgroundColor: FIELD,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: BLACK,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DFF0A0',
  },

  btnBlack: {
    backgroundColor: BLACK,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnBlackText: { color: WHITE, fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },

  btnOutline: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BLACK,
  },
  btnOutlineText: { color: BLACK, fontWeight: '700', fontSize: 15 },

  // Estado de sucesso
  successCard: {
    backgroundColor: G,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: { fontSize: 48, marginBottom: 12 },
  successTitle: { fontSize: 24, fontWeight: '900', color: BLACK, marginBottom: 8 },
  successText: { fontSize: 14, color: BLACK, textAlign: 'center', lineHeight: 22 },
  successEmail: { fontWeight: '800' },
  successHint: {
    fontSize: 12,
    color: '#555',
    marginTop: 8,
    textAlign: 'center',
  },
});