import React, { useState } from 'react';
import { StyleSheet, TextInput, View, SafeAreaView, Button, Text, FlatList, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default App = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const db = SQLite.openDatabase("pessoa.db");
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);

  listarUsuarios = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM pessoa order by nome',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            setItems(temp);
            if (results.rows.length >= 1) {
              setEmpty(false);
            } else {
              setEmpty(true)
            }
          }
        }
      );
    });
  }

  apagarTabela = () => {
    db.transaction((tx) => {
      tx.executeSql("drop table if exists pessoa;");
    });
    setEmpty(true);
    setItems(null);
    setNome('');
    setTelefone('');
  }

  salvarUsuario = () => {
    db.transaction(
      (tx) => {
        tx.executeSql('INSERT INTO pessoa (nome, telefone) VALUES (?,?)',
          [nome, telefone], (resultSet) => {
            Alert.alert("Alerta", "Registro salvo com sucesso");
          }, (error) => {
            console.log(error);
          }
        )
      }
    );
    setNome('');
    setTelefone('');
  };

  atualizarUsuario = () => {
    db.transaction(
      (tx) => {
        tx.executeSql('UPDATE pessoa SET telefone=? WHERE nome=?',
          [telefone, nome], (resultSet) => {
            Alert.alert("Alerta", "Registro atualizado com sucesso");
          }, (error) => {
            console.log(error);
          }
        )
      }
    );
    setTelefone('');
  };

  deletarUsuario = () => {
    db.transaction(
      (tx) => {
        tx.executeSql('DELETE FROM pessoa WHERE nome=?',
          [nome], (resultSet) => {
            Alert.alert("Alerta", "Registro deletado com sucesso");
          }, (error) => {
            console.log(error);
          }
        )
      }
    );
  };


  listarUsuarioPorNome = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM pessoa WHERE nome = ?',
        [nome],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            setItems(temp);
            if (results.rows.length >= 1) {
              setEmpty(false);
            } else {
              setEmpty(true)
            }
          }
        }
      );
    });
  }

  separadorItem = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000'
        }}
      />
    );
  };

  mensagemVazia = (status) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 25, textAlign: 'center' }}>
        </Text>
      </View>
    );
  }

  db.transaction((tx) => {
    tx.executeSql("create table " +
      "if not exists pessoa (indice INTEGER PRIMARY KEY AUTOINCREMENT, " +
      " nome text, telefone text);");
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TextInput
          placeholder="Entre com o Nome"
          onChangeText={
            (nome) => setNome(nome)
          }
          value={nome}
          maxLength={20}
          style={{ padding: 10 }}
        />
        <TextInput
          placeholder="Entre com o Telefone"
          onChangeText={
            (telefone) => setTelefone(telefone)
          }
          value={telefone}
          maxLength={20}
          style={{ padding: 10 }}
        />
        <View style={styles.button}>
          <Button title="Salvar Usuário" onPress={() => salvarUsuario()} />
          <Button title="Apagar Tabela" onPress={() => apagarTabela()} />
          <Button title="Listar Usuários" onPress={() => listarUsuarios()} />
          <Button title="Listar Usuário por Nome" onPress={() => listarUsuarioPorNome()} />
          <Button title="Atualizar telefone" onPress={() => atualizarUsuario()} />
          <Button title="Deletar Usuário" onPress={() => deletarUsuario()} />
        </View>
        <View style={styles.container}>
          {empty ? mensagemVazia(empty) :
            <FlatList
              data={items}
              ItemSeparatorComponent={separadorItem}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                <View key={item.indice} style={styles.container}>
                  <Text style={styles.itemsStyle}> {item.indice}) {item.nome} fone: {item.telefone} </Text>
                </View>
              }
            />
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 15,
    padding: 15,
  },
});
