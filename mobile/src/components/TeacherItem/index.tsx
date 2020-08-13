/* eslint-disable import/extensions */
import React, { useState } from "react";
import { View, Image, Text, Linking } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";

import heartOutlineIcon from "../../assets/images/icons/heart-outline.png";
import unfavoriteIcon from "../../assets/images/icons/unfavorite.png";
import whatsappIcon from "../../assets/images/icons/whatsapp.png";

import styles from "./styles";
import api from "../../services/api";

export interface Teacher {
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string;
}

interface TeacherItemProps {
  teacher: Teacher;
  favorited: boolean; // representa se o professor está favoritado ou não
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {
  // professor pode ser favoritado ou não
  // Recebe o valor inicial a variável que indica se o professor está favoritado ou não
  const [isFavorited, setIsFavorited] = useState(favorited);

  function handleLinkToWhatsapp() {
    // Atualiza o valor da quantidade de conexões
    api.post("connections", {
      user_id: teacher.id,
    });

    Linking.openURL(`whatsapp://send?phone=+55${teacher.whatsapp}`);
  }

  async function handleToggleFavorite() {
    // Verifica se o professor já está favoritado
    const favorites = await AsyncStorage.getItem("favorites");

    let favoritesArray: Array<any> = []; // pode ser que não haja nenhum favorito

    // Se encontrou algum favorito
    if (favorites) {
      favoritesArray = JSON.parse(favorites);
    }

    if (isFavorited) {
      // procura a posição do professor no array de favoritos
      const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        return teacher.id === teacherItem.id;
      });

      // Remove dos favoritos

      // splice: remove um conteúdo da lista
      // splice(índice que vai remover, quantas posições quer remover a partir desse índice)
      favoritesArray.splice(favoriteIndex, 1);

      setIsFavorited(false); // Tira o favorito
    } else {
      // Adicionar aos favoritos

      favoritesArray.push(teacher); // adiciona no array o novo professor a ser favoritado

      setIsFavorited(true); // Coloca o favorito
    }
    await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray)); // salva o array no storage
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.avatar} source={{ uri: teacher.avatar }} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>{teacher.bio}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora
          {"   "}
          <Text style={styles.priceValue}>{teacher.cost}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton
            onPress={handleToggleFavorite}
            style={[styles.favoriteButton, isFavorited ? styles.favorited : {}]}
          >
            {isFavorited ? (
              <Image source={unfavoriteIcon} />
            ) : (
              <Image source={heartOutlineIcon} />
            )}
          </RectButton>

          <RectButton
            onPress={handleLinkToWhatsapp}
            style={styles.contactButton}
          >
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
};

export default TeacherItem;
