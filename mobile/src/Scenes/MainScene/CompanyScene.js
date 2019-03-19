import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ErrorScene } from '../../components';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 30,
    color: '#FFF'
  },
  displayContainer: {
    marginBottom: 20,
    marginRight: 20,
    borderRadius: 40,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.2)',
    width: 80,
    height: 80,
    overflow: 'hidden'
  },
  display: {
    borderRadius: 50
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  headers: {
    fontWeight: '900',
    color: '#FFF',
    marginTop: 20,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center'
  },
  friendsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  }
});

const query = gql`
  query Company($id: ID!) {
    company(id: $id) {
      id
      name
      color
      image
      catchPhrase
      address {
        zipCode
        city
        cityPrefix
        citySuffix
        streetName
        streetAddress
        streetSuffix
        streetPrefix
        secondaryAddress
        county
        country
        state
        latitude
        longitude
      }
      employees {
        id
        name
        image
      }
    }
  }
`;

export default class CompanyScene extends PureComponent {
  render() {
    const { navigation } = this.props;
    const id = navigation.getParam('id');
    // todo: 2. would be really cool to show the company info here.
    // todo: 3. would be extra cool to show the employee list and make it navigate to that user on tap.
    return (
      <View style={styles.container}>
        <Query query={query} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error) {
              return <ErrorScene message={error.message} />;
            }
            return (
              <View style={{ flex: 1 }}>
                <ScrollView>
                  <View
                    style={[
                      styles.headerContainer,
                      { backgroundColor: data.company.color }
                    ]}
                  >
                    <Text style={[styles.header]}>{data.company.name}</Text>
                    <View style={styles.displayContainer}>
                      <Image
                        style={[styles.display, { width: 50, height: 50 }]}
                        source={{ uri: data.company.image }}
                      />
                    </View>
                  </View>
                  <View style={styles.details}>
                    <Text
                      style={[
                        styles.headers,
                        {
                          backgroundColor: data.company.color
                        }
                      ]}
                    >
                      Address
                    </Text>
                    <Text>
                      {`${data.company.address.streetAddress} ${
                        data.company.address.streetName
                      }`}
                    </Text>
                    <Text>
                      {`${data.company.address.city}, ${
                        data.company.address.county
                      }`}
                    </Text>
                    <Text>{`${data.company.address.state}, ${
                      data.company.address.country
                    }`}</Text>
                    <Text>{data.company.address.zipCode}</Text>
                    <Text>Longitude: {data.company.address.longitude}</Text>
                    <Text>Latitude: {data.company.address.latitude}</Text>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={[
                        styles.headers,
                        {
                          backgroundColor: data.company.color
                        }
                      ]}
                    >
                      Employees
                    </Text>
                    {data.company.employees.length > 0 ? (
                      data.company.employees.map(employee => (
                        <TouchableOpacity
                          key={employee.id}
                          onPress={() =>
                            navigation.navigate('UserScene', {
                              id: employee.id
                            })
                          }
                        >
                          <View style={styles.friendsContainer}>
                            <View>
                              <Image
                                style={[
                                  styles.display,
                                  { width: 50, height: 50 }
                                ]}
                                source={{ uri: employee.image }}
                              />
                            </View>
                            <Text>{employee.name}</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={{ textAlign: 'center' }}>No Employees</Text>
                    )}
                  </View>
                </ScrollView>
              </View>
            );
          }}
        </Query>
      </View>
    );
  }
}
