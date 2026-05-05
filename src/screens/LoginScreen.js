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
import { loginUser } from '../firebase/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }
    try {
      setLoading(true);
      await loginUser(email.trim(), password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
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
        {/* Bloco verde superior com formas geométricas */}
        <View style={styles.topBlock}>
          <View style={styles.shapeCircleLarge} />
          <View style={styles.shapeCircleSmall} />
          <View style={styles.shapePill} />
          <Text style={styles.brandName}>GreenFlow</Text> 
        </View>

        {/* Card branco */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9aaa6a"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#9aaa6a"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnBlack, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.btnBlackText}>
              {loading ? 'Entrando…' : 'Entrar →'}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.footerText}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.footerLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.terms}>
            Ao entrar, você concorda com nossos Termos e Política de Privacidade.
          </Text>
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
    paddingTop: 50,
    paddingBottom: 52,
    paddingHorizontal: 28,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 15,
    position: 'relative',
  },
  shapeCircleLarge: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: BLACK,
    top: -50,
    left: -55,
  },
  shapeCircleSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#8FAF20',
    top: 55,
    right: -22,
  },
  shapePill: {
    position: 'absolute',
    width: 130,
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    opacity: 0.12,
    bottom: 20,
    left: 100,
  },
  brandName: {
    fontSize: 50,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: -1, 
    zIndex: 1,
  }, 

  card: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flex: 1,
    padding: 28,
    paddingTop: 34,
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: BLACK,
    marginBottom: 24,
    letterSpacing: -0.5,
  },

  input: {
    backgroundColor: FIELD,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: BLACK,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#DFF0A0',
  },
  forgotText: {
    color: BLACK,
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginBottom: 22,
    alignSelf: 'flex-end',
  },

  btnBlack: {
    backgroundColor: BLACK,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnBlackText: { color: WHITE, fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },

  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  footerText: { color: '#777', fontSize: 14 },
  footerLink: { color: BLACK, fontSize: 14, fontWeight: '800' },

  terms: { textAlign: 'center', color: '#BBB', fontSize: 11, lineHeight: 16 },
});