import React, { useState, AsyncStorage, useEffect } from "react";
import { ScrollView, View, StyleSheet, FlatList } from "react-native";
import {
  Card,
  Button,
  Text,
  Avatar,
  Input,
  Header,
} from "react-native-elements";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import {
  getDataJSON,
  setDataJSON,
  concatDataJson,
  getData,
} from "../functions/AsyncStorageFunctions";
import PostCard from "./../components/PostCard";

const HomeScreen = (props) => {
  const [post, setpost] = useState("");
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    try {
      let keys = await AsyncStorage.getAllKeys();
      console.log(keys);
      let posts = [];
      if (keys != null) {
        for (let element of keys) {
          if (element.startsWith("PID")) {
            let post = await getDataJSON(element);
            posts.push(post);
          }
        }
        setAllPosts(posts);
      } else {
      }
      return posts;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  });
  //console.log(allPosts);
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          <Header
            leftComponent={{
              icon: "menu",
              color: "#fff",
              onPress: function () {
                props.navigation.toggleDrawer();
              },
            }}
            centerComponent={{ text: "The Blog App", style: { color: "#fff" } }}
            rightComponent={{
              icon: "lock-outline",
              color: "#fff",
              onPress: function () {
                auth.setIsLoggedIn(false);
                auth.setCurrentUser({});
              },
            }}
          ></Header>
          <Card>
            <Input
              placeholder="What's On Your Mind?"
              leftIcon={<Entypo name="pencil" size={24} color="black" />}
              onChangeText={function (currentPost) {
                setpost(currentPost);
              }}
            />
            <Button
              title="Post"
              type="outline"
              onPress={function () {
                var pid = Math.floor(Math.random() * 100);
                let newPost = {
                  postAuthor: auth.currentUser.name,
                  postBody: post,
                  postTime: "2 September",
                  like: [],
                  comments: [],
                };
                console.log(pid);
                console.log(newPost);
                setDataJSON("PID" + pid, newPost);
                getPosts();
                alert("Post Added");
                setpost("");
              }}
            />
          </Card>

          <FlatList
            data={allPosts}
            renderItem={function ({ item }) {
              return (
                <PostCard
                  author={item.postAuthor}
                  title={item.postTime}
                  postBody={item.postBody}
                  navigation={props.navigation}
                />
              );
            }}
          ></FlatList>
        </View>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
});

export default HomeScreen;
