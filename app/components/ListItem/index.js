import React from 'react';
import { View, Text } from 'react-native';

import Image from 'react-native-scalable-image';

import language from '../../assets/language/iso.json';
import genre from '../../assets/genre/ids.json';

import { TouchableOpacity } from '../TouchableOpacity';

import { width } from '../../utils/Metrics';

import styles from './styles';

const getImageApi = image =>
  image
    ? { uri: `https://image.tmdb.org/t/p/w500/${image}` }
    : require('../../assets/images/not_found.png');

const convertToDate = date => new Date(date).getFullYear() || '';

const convertToUpperCaseFirstLetter = str => {
  str = language[str] || '';
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};

const convertGenre = (arr, type, isSearch) => {
  if (type === 'normal' || isSearch) {
    if (arr.length > 1) return `${genre[arr[0]].name}, ${genre[arr[1]].name}`;
    return arr.length !== 0 ? `${genre[arr[0]].name}` : '';
  }
  return arr.length !== 0 && type !== genre[arr[0]].name
    ? `${type}, ${genre[arr[0]].name}`
    : type;
};

const renderDivider = (release_date, original_language) =>
  release_date && original_language !== 'xx' ? (
    <Text style={styles.trace}>|</Text>
  ) : null;

const renderScore = vote_average => {
  let color =
    vote_average < 5
      ? 'low'
      : vote_average >= 5 && vote_average < 7
      ? 'mid'
      : 'high';

  return (
    <View style={[styles.score, styles[color]]}>
      <Text style={styles.textPercent}>{vote_average}</Text>
    </View>
  );
};

export default class ListItem extends React.PureComponent {
  render() {
    const { numColumns, item, type, isSearch, navigate } = this.props;

    if (numColumns === 1) {
      return (
        <TouchableOpacity
          onPress={() => navigate('MovieDetails', { id: item.id })}
        >
          <View style={styles.containerItem}>
            <Image
              source={getImageApi(item.poster_path)}
              style={styles.photo}
              width={width * 0.3}
            />
            <View style={styles.item}>
              <View>
                <Text numberOfLines={2} style={styles.textTitle}>
                  {item.title}
                </Text>
                <View style={[styles.textRow, styles.containerSubTitle]}>
                  <Text style={styles.textSmall}>
                    {convertToDate(item.release_date)}
                  </Text>
                  {renderDivider(item.release_date, item.original_language)}
                  <Text numberOfLines={1} style={styles.textSmall}>
                    {convertToUpperCaseFirstLetter(item.original_language)}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.textSmall}>
                  {convertGenre(item.genre_ids, type, isSearch)}
                </Text>
              </View>
              <View style={[styles.textRow, styles.containerReview]}>
                {renderScore(item.vote_average)}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.containerTwoItem}
        onPress={() => navigate('MovieDetails', { id: item.id })}
      >
        <View>
          <Image
            source={getImageApi(item.poster_path)}
            style={styles.photo}
            width={width * 0.33}
          />
        </View>
        <Text numberOfLines={2} style={styles.textTwoTitle}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
