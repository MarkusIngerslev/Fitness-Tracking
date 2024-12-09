import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../firebase";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

const ImageProgress = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  const loadImages = async () => {
    try {
      const storage = getStorage();
      const userId = auth.currentUser.uid;
      const imagesRef = ref(storage, `progress-images/${userId}`);

      const result = await listAll(imagesRef);
      const urls = await Promise.all(
        result.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef);
          return {
            url,
            date: imageRef.name.split("_")[0],
            fileName: imageRef.name, // Add fileName to object
          };
        })
      );

      setImages(urls.sort((a, b) => b.date - a.date));
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const userId = auth.currentUser.uid;
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      const imageRef = ref(storage, `progress-images/${userId}/${fileName}`);

      await uploadBytes(imageRef, blob);
      await loadImages();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to upload image",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (fileName) => {
    try {
      const storage = getStorage();
      const userId = auth.currentUser.uid;
      const imageRef = ref(storage, `progress-images/${userId}/${fileName}`);

      await deleteObject(imageRef);
      await loadImages(); // Refresh images list

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Image deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete image",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Photos</Text>
      </View>

      <ScrollView style={styles.imageGrid}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageWrapper}
                onPress={() => {
                  Alert.alert(
                    "Delete Image",
                    "Are you sure you want to delete this image?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => deleteImage(image.fileName),
                        style: "destructive",
                      },
                    ]
                  );
                }}
              >
                <Image source={{ uri: image.url }} style={styles.image} />
                <Text style={styles.imageDate}>
                  {new Date(parseInt(image.date)).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={pickImage}>
        <Text style={styles.addButtonText}>Add Progress Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  imageGrid: {
    flex: 1,
    padding: 8,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 4,
  },
  imageDate: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default ImageProgress;
