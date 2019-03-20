import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  TextInput
} from 'react-native';

import { Query, Mutation, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ErrorScene } from '../../components';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 30,
    color: '#FFF'
  },
  updateHeader: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    color: '#FFF'
  },
  displayContainer: {
    marginBottom: 20
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
  },
  input: {
    padding: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#F5F5F5'
  }
});

const query = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      color
      name
      email
      image
      friends {
        id
        image
        name
      }
      company {
        id
        name
      }
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
    }
  }
`;

const mutation = gql`
  mutation UpdateUser($user: UserInput!) {
    updateUser(user: $user)
  }
`;
class UserScene extends PureComponent {
  state = {
    editable: false,
    name: '',
    email: ''
  };

  render() {
    let { editable, name, email } = this.state;
    const { navigation } = this.props;
    const id = navigation.getParam('id');
    const initialName = navigation.getParam('name');
    const initialEmail = navigation.getParam('email');

    name = name.trim() ? name : initialName;
    email = email.trim() ? email : initialEmail;
    const user = { id, name, email };
    console.log(name, email, editable);

    // todo: 2. would be cool if we actually displayed full user data that is contained in the user data object.

    // todo: 3. would be extra cool to include their company info, and if you tap on it you can go that CompanyScene.
    // if this is done correctly, we should be re-using components from the CompaniesScene.

    // todo: 4. would be even cooler to see a list of their friends, so I can tap on them an get more info about that user.
    // todo: 5 would be cool to make the user name and email updateable and saved ot the database, so we can let our users change their info.
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
                      { backgroundColor: data.user.color }
                    ]}
                  >
                    {editable ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={[styles.header]}>{data.user.name}</Text>
                        <View
                          style={{
                            borderWidth: 3,
                            borderColor: '#000',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20,
                            marginBottom: 15
                          }}
                        >
                          <Text style={[styles.updateHeader]}>
                            Update Name:
                          </Text>
                          <TextInput
                            style={[
                              styles.input,
                              styles.header,
                              { color: data.user.color }
                            ]}
                            value={name}
                            onChangeText={text => this.setState({ name: text })}
                            placeholder="Update name"
                          />
                        </View>
                      </View>
                    ) : (
                      <Text style={[styles.header]}>{data.user.name}</Text>
                    )}
                    <View style={styles.displayContainer}>
                      <Image
                        style={[styles.display, { width: 50, height: 50 }]}
                        source={{ uri: data.user.image }}
                      />
                    </View>
                    {editable ? (
                      <Mutation mutation={mutation} variables={{ user }}>
                        {mutation => (
                          <Button
                            style={{
                              width: 200
                            }}
                            color="#000"
                            accessibilityLabel="Click here to update a user's information"
                            onPress={() => {
                              this.setState({ editable: false }, () => {
                                mutation();
                              });
                            }}
                            title="Update User"
                          />
                        )}
                      </Mutation>
                    ) : (
                      <Button
                        style={{ width: 200, backgroundColor: '#d3d3d3' }}
                        color={data.user.color}
                        accessibilityLabel="Click here to edit a user's information"
                        onPress={() => this.setState({ editable: true })}
                        title="Edit User"
                      />
                    )}
                  </View>
                  <View style={styles.details}>
                    {editable ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text>Email: {data.user.email}</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 15,
                            borderWidth: 3,
                            borderColor: '#000',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20
                          }}
                        >
                          <Text style={{ fontWeight: '900' }}>Email: </Text>
                          <TextInput
                            placeholder="Update email"
                            style={styles.input}
                            ref={input => (this.email = input)}
                            onChangeText={email => {
                              this.setState({ email: email });
                            }}
                            value={email}
                          />
                        </View>
                      </View>
                    ) : (
                      <Text>Email: {data.user.email}</Text>
                    )}
                    <Text
                      style={[
                        styles.headers,
                        {
                          backgroundColor: data.user.color
                        }
                      ]}
                    >
                      Address
                    </Text>
                    <Text>
                      {`${data.user.address.streetAddress} ${
                        data.user.address.streetName
                      }`}
                    </Text>
                    <Text>
                      {`${data.user.address.city}, ${data.user.address.county}`}
                    </Text>
                    <Text>{`${data.user.address.state}, ${
                      data.user.address.country
                    }`}</Text>
                    <Text>{data.user.address.zipCode}</Text>
                    <Text>Longitude: {data.user.address.longitude}</Text>
                    <Text>Latitude: {data.user.address.latitude}</Text>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={[
                        styles.headers,
                        {
                          backgroundColor: data.user.color
                        }
                      ]}
                    >
                      Friends
                    </Text>
                    {data.user.friends.length > 0 ? (
                      data.user.friends.map(user => {
                        return (
                          <TouchableOpacity
                            key={user.id}
                            onPress={() =>
                              navigation.navigate('UserScene', {
                                id: user.id
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
                                  source={{ uri: user.image }}
                                />
                              </View>
                              <Text>{user.name}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text style={{ textAlign: 'center' }}>No Friends</Text>
                    )}
                  </View>
                  <View style={{ marginBottom: 40 }}>
                    <Text
                      style={[
                        styles.headers,
                        {
                          backgroundColor: data.user.color
                        }
                      ]}
                    >
                      Company
                    </Text>
                    <View
                      style={{
                        marginBottom: 40,
                        alignItems: 'center',
                        marginTop: 20
                      }}
                    >
                      <Button
                        style={{ width: 200 }}
                        color={data.user.color}
                        accessibilityLabel="Click here to go to user's company"
                        onPress={() =>
                          navigation.navigate('CompanyScene', {
                            id: data.user.company.id
                          })
                        }
                        title="View Company Page"
                      />
                    </View>
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

export default withApollo(UserScene);
