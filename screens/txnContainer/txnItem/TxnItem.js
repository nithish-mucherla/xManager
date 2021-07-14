import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const TxnItem = ({id, txnDetails, navigation}) => {
  const shortenTitle = title => {
    return title.length > 18
      ? title.slice(0, 11) + '...' + title.slice(title.length - 6)
      : title;
  };
  return (
    <TouchableOpacity
      key={id}
      onPress={() => navigation.navigate('TxnInfo', {txnId: id})}>
      <View style={styles.itemContainer}>
        <View
          style={{
            backgroundColor: txnDetails.category === 'Income' ? 'green' : 'red',
            width: 7,
            alignSelf: 'stretch',
            marginLeft: 5,
            marginRight: 10,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}
        />
        <View style={{flex: 1, height: 60}}>
          <Text style={styles.txnTitle}>{shortenTitle(txnDetails.title)}</Text>
          <Text style={styles.txnCategory}>{txnDetails.category}</Text>
        </View>
        <View>
          <Text style={styles.total}>{txnDetails.amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 7,
  },
  txnTitle: {
    fontSize: 24,
    color: 'white',
  },
  txnCategory: {
    fontSize: 16,
    color: 'gray',
  },
  total: {
    fontSize: 16,
    color: 'white',
  },
});

export default TxnItem;
