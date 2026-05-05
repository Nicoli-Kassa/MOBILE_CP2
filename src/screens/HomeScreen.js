import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../firebase/productService';

// Formatação monetária BR
function formatPrice(raw) {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const number = parseInt(digits, 10) / 100;
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function parsePriceToSave(formatted) {
  return formatted.replace(/\D/g, '');
}
function priceDigitsToFormatted(digits) {
  if (!digits) return '';
  const number = parseInt(digits, 10) / 100;
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
} 

export default function HomeScreen({ navigation, route }) {
  const [name, setName]                         = useState('');
  const [priceFormatted, setPriceFormatted]     = useState('');
  const [priceRaw, setPriceRaw]                 = useState('');
  const [barcode, setBarcode]                   = useState('');
  const [products, setProducts]                 = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const formSnapshot = useRef(null);

  async function loadProducts() {
    try {
      const list = await getProducts();
      setProducts(list);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Melhoria 3: restaura dados ao voltar do scanner
  useEffect(() => {
    if (route.params?.scannedBarcode) {
      if (formSnapshot.current) {
        const snap = formSnapshot.current;
        setName(snap.name);
        setPriceRaw(snap.priceRaw);
        setPriceFormatted(snap.priceFormatted);
        setEditingProductId(snap.editingProductId);
        formSnapshot.current = null;
      }
      setBarcode(String(route.params.scannedBarcode));
    }
  }, [route.params?.scannedBarcode]);

  function clearForm() {
    setName('');
    setPriceFormatted('');
    setPriceRaw('');
    setBarcode('');
    setEditingProductId(null);
    formSnapshot.current = null;
  }

  function handlePriceChange(text) {
    const formatted = formatPrice(text);
    setPriceFormatted(formatted);
    setPriceRaw(parsePriceToSave(formatted));
  }

  async function handleSaveProduct() {
    if (!name.trim() || !priceRaw) {
      Alert.alert('Atenção', 'Preencha nome e preço.');
      return;
    }
    const productData = {
      name: name.trim(),
      price: priceRaw,
      priceFormatted,
      barcode: barcode ? barcode.trim() : '',
    };
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        Alert.alert('Sucesso', 'Produto atualizado!');
      } else {
        await createProduct(productData);
        Alert.alert('Sucesso', 'Produto cadastrado!');
      }
      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    }
  }

  function handleEditProduct(product) {
    setName(product.name || '');
    const formatted =
      product.priceFormatted || priceDigitsToFormatted(product.price);
    setPriceFormatted(formatted);
    setPriceRaw(product.price || '');
    setBarcode(product.barcode || '');
    setEditingProductId(product.id);
  }

  function handleOpenScanner() {
    formSnapshot.current = { name, priceRaw, priceFormatted, editingProductId };
    navigation.navigate('BarcodeScanner');
  }

  async function handleDeleteProduct(productId) {
    const confirmDelete = window.confirm('Excluir este produto?');
    if (!confirmDelete) return;
    try {
      await deleteProduct(productId);
      if (editingProductId === productId) clearForm();
      Alert.alert('Sucesso', 'Produto excluído!');
      await loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível excluir o produto.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header verde */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Bem-vindo 👋</Text>
          <Text style={styles.headerTitle}>Meus Produtos</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card preto — formulário */}
        <View style={styles.formCard}>
          <Text style={styles.formCardTitle}>
            {editingProductId ? '✏️ Editar produto' : '＋ Novo produto'}
          </Text>

          <TouchableOpacity style={styles.scannerBtn} onPress={handleOpenScanner}>
            <Text style={styles.scannerBtnText}>📷  Ler código de barras</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Nome do produto"
            placeholderTextColor="#6a8a3a"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Preço (ex: 1990 → R$ 19,90)"
            placeholderTextColor="#6a8a3a"
            value={priceFormatted}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Código de barras"
            placeholderTextColor="#6a8a3a"
            value={barcode}
            onChangeText={setBarcode}
            style={styles.input}
          />

          <TouchableOpacity style={styles.btnGreen} onPress={handleSaveProduct}>
            <Text style={styles.btnGreenText}>
              {editingProductId ? 'Atualizar →' : 'Cadastrar →'}
            </Text>
          </TouchableOpacity>

          {editingProductId && (
            <TouchableOpacity style={styles.btnOutline} onPress={clearForm}>
              <Text style={styles.btnOutlineText}>Cancelar edição</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cabeçalho da lista */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Cadastrados</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{products.length}</Text>
          </View>
        </View>

        {products.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>Nenhum produto ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <View style={styles.productAccent} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    {item.priceFormatted ||
                      priceDigitsToFormatted(item.price) ||
                      '—'}
                  </Text>
                  {item.barcode ? (
                    <Text style={styles.productBarcode}>
                      🔖 {item.barcode}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEditProduct(item)}
                  >
                    <Text style={styles.editBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteProduct(item.id)}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const G     = '#BFDA45';
const BLACK = '#1A1A1A';
const WHITE = '#FFFFFF';
const FIELD = '#F4F8E8';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: G },
  flex: { flex: 1, backgroundColor: WHITE },

  header: {
    backgroundColor: G,
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerSub:  { fontSize: 13, color: BLACK, opacity: 0.6, fontWeight: '600' },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: BLACK,
    letterSpacing: -0.5,
  },
  logoutBtn: {
    backgroundColor: BLACK,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutText: { color: WHITE, fontWeight: '700', fontSize: 13 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  formCard: {
    backgroundColor: BLACK,
    borderRadius: 26,
    padding: 22,
    marginBottom: 28,
  },
  formCardTitle: { color: WHITE, fontSize: 15, fontWeight: '800', marginBottom: 16 },

  scannerBtn: {
    backgroundColor: G,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  scannerBtnText: { color: BLACK, fontWeight: '700', fontSize: 14 },

  input: {
    backgroundColor: FIELD,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: BLACK,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#DFF0A0',
  },

  btnGreen: {
    backgroundColor: G,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  btnGreenText: { color: BLACK, fontWeight: '800', fontSize: 15 },

  btnOutline: {
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: G,
  },
  btnOutlineText: { color: G, fontWeight: '700', fontSize: 14 },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  listTitle:      { fontSize: 20, fontWeight: '900', color: BLACK },
  countBadge: {
    backgroundColor: G,
    borderRadius: 20,
    minWidth: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countBadgeText: { color: BLACK, fontWeight: '800', fontSize: 13 },

  emptyBox: {
    backgroundColor: FIELD,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText:  { color: '#888', fontSize: 14, fontWeight: '600' },

  productCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#EEF0E8',
  },
  productAccent: { width: 6, alignSelf: 'stretch', backgroundColor: G },
  productInfo:   { flex: 1, padding: 14 },
  productName:   { fontSize: 15, fontWeight: '800', color: BLACK, marginBottom: 2 },
  productPrice:  { fontSize: 14, fontWeight: '700', color: '#5a7a20', marginBottom: 2 },
  productBarcode:{ fontSize: 11, color: '#999' },

  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    gap: 8,
  },
  editBtn: {
    backgroundColor: G,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  editBtnText:  { color: BLACK, fontWeight: '700', fontSize: 13 },
  deleteBtn: {
    backgroundColor: BLACK,
    borderRadius: 10,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { color: WHITE, fontWeight: '800', fontSize: 14 },
});