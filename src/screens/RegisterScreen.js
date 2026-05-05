import { useState } from "react";
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
} from "react-native";
import { registerUser } from "../firebase/authService";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha nome, email e senha.");
      return;
    }
    try {
      setLoading(true);
      await registerUser(email.trim(), password);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro ao cadastrar", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header verde com formas */}
        <View style={styles.topBlock}>
          <View style={styles.shapeA} />
          <View style={styles.shapeB} />

          {/* Botão voltar */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Cadastro</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Badge de passo */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Preencha seus dados</Text>
          </View>

          <TextInput
            placeholder="Nome completo"
            placeholderTextColor="#9aaa6a"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

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
            placeholder="Senha (mín. 6 caracteres)"
            placeholderTextColor="#9aaa6a"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.btnGreen, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.btnGreenText}>
              {loading ? "Cadastrando…" : "Criar conta →"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnOutlineText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const G = "#BFDA45";
const BLACK = "#1A1A1A";
const WHITE = "#FFFFFF";
const FIELD = "#F4F8E8";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: G },
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
    width: 60,
    height: 60,
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
    alignItems: "center",
    justifyContent: "center", 
    zIndex: 1,
  },
  backBtnText: { color: WHITE, fontSize: 18, fontWeight: "700" },

  topTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: BLACK,
    letterSpacing: -1,
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

  badge: {
    backgroundColor: G,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  badgeText: { color: BLACK, fontWeight: "700", fontSize: 13 },

  input: {
    backgroundColor: FIELD,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: BLACK,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#DFF0A0",
  },

  btnGreen: {
    backgroundColor: G,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: BLACK,
  },
  btnGreenText: { color: BLACK, fontWeight: "800", fontSize: 16 },

  btnOutline: {
    backgroundColor: "transparent",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: BLACK,
  },
  btnOutlineText: { color: BLACK, fontWeight: "700", fontSize: 15 },
});
