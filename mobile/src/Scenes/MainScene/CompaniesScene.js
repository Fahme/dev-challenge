import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet
} from 'react-native';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import { ErrorScene, CompanyList } from '../../components';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heading: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 30,
    backgroundColor: '#d3d3d3',
    padding: 5
  }
});

const query = gql`
  query Companies {
    companies {
      id
      name
      color
      image
      catchPhrase
    }
  }
`;

export default class CompaniesScene extends PureComponent {
  render() {
    // todo: 2. would be cool if we actually queried the graphql server for companies and displayed them here.
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>List of all companies</Text>
        <Query query={query}>
          {({ loading, error, data }) => {
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error) {
              return <ErrorScene message={error.message} />;
            }
            return (
              <FlatList
                data={data.companies}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CompanyScene', { id: item.id })
                    }
                  >
                    <CompanyList company={item} />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            );
          }}
        </Query>
      </View>
    );
  }
}
