import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Platform, View, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Feather from 'react-native-vector-icons/Feather';

interface Genre {
  mal_id: number;
  name: string;
}
interface GenreFilterProps {
  onChange: (value: number | undefined) => void;
}

export default function GenreFilter({ onChange }: GenreFilterProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<number | undefined>(undefined);
  let selector: RNPickerSelect | null = null;

  useEffect(() => {
    axios
      .get('https://api.jikan.moe/v4/genres/anime')
      .then(res => setGenres(res.data.data || []));
  }, []);

  const items = [
    { label: 'All Genres', value: 0 },
    ...genres.map(g => ({ label: g.name, value: g.mal_id })),
  ];

  return (
    <View className="mx-3 my-2 relative">
      <RNPickerSelect
        ref={el => {
          selector = el;
        }}
        value={selected}
        onValueChange={(v: number | undefined) => {
          setSelected(v);
          onChange(v === 0 ? undefined : v);
        }}
        items={items}
        placeholder={{ label: 'All Genres', value: 0 }}
        useNativeAndroidPickerStyle={false}
        Icon={() => <Feather name="chevron-down" size={20} color="#888" />}
        style={{
          inputIOS: {
            fontSize: 16,
            paddingVertical: 14,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            backgroundColor: '#f9fafb',
            color: '#22223b',
            marginBottom: 2,
          },
          inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            backgroundColor: '#f9fafb',
            color: '#22223b',
            marginBottom: 2,
          },
          placeholder: {
            color: '#9ca3af',
          },
          iconContainer: {
            top: 18,
            right: 16,
          },
        }}
      />
      {/* Overlay only on iOS */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          className="absolute top-0 right-0 bottom-0 left-0 flex flex-row justify-end items-center h-full w-full px-4"
          activeOpacity={0.7}
          onPress={() => {
            // @ts-ignore
            selector?.togglePicker?.();
          }}
        >
          <Feather name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}
