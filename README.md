# AnimeExplorer

A React Native CLI app for browsing, searching, and favoriting anime, built using the [Jikan API](https://jikan.moe/).
You can view anime details, filter by genre, favorite your top picks, and enjoy delightful UI/UX with smooth animations and modern navigation.

---

## Features

* **Anime List:** Infinite scroll with images, titles, and scores.
* **Anime Details:** View synopsis, genres, production info, and more.
* **Favorites:** Mark/unmark favorites and view your saved anime.
* **Genre Filtering:** Dropdown to filter anime by genre.
* **Creative Animations:** Animated favoriting with flying hearts, animated list entry, parallax cover image, and more.
* **Share:** Share anime via public URL or deep link.
* **Persistent State:** Favorites are saved locally with AsyncStorage.
* **Error Handling:** Graceful handling of API/network errors, with retry option.
* **Dark/Light Support:** Modern look with [nativewind (TailwindCSS)](https://github.com/marklawlor/nativewind).

---

## Tech Stack

* **React Native CLI** (not Expo)
* **TypeScript** for type safety
* **Redux Toolkit** for state management
* **NativeWind (TailwindCSS)** for styling
* **React Navigation** for navigation and stacks
* **React Native Reanimated v2** for performant animations
* **AsyncStorage** for local persistence
* **Jikan API** for anime data
* **Jest** and **React Native Testing Library** for testing

---

## How to Run

### **1. Clone the Repo**

```sh
git clone https://github.com/your-username/AnimeExplorer.git
cd AnimeExplorer
```

### **2. Install Dependencies**

```sh
npm install
# or
yarn install
```

### **If need Peer dependency**

```sh
npm install --force or --legacy-peer-deps
# or
yarn install --force or --legacy-peer-deps
```

### **3. Start Metro Bundler**

```sh
npx react-native start
```

### **4. Run on Android**

```sh
npx react-native run-android
```

### **5. Run on iOS**

```sh
npx pod-install ios
npx react-native run-ios
```

---

## Dev Notes

* If you add or change **native modules** (e.g. Reanimated, AsyncStorage, NativeWind), always rebuild the native app (`run-android` or `run-ios`) after installing.

* **Animations with Reanimated:**

    * You must have `react-native-reanimated/plugin` as the **last** plugin in your `babel.config.js`.
    * Animations sometimes do **not** work in Debug mode or may not be smooth—test in Release mode for best results.
    * **Android Animations Issue:**

        * On some Android devices, Reanimated animations may not play if the app is not built for release or the build cache is stale.
        * Try:

          ```
          npm start -- --reset-cache
          npx react-native run-android
          ```
        * For release builds:

          ```
          cd android
          ./gradlew assembleRelease
          ```
        * For more, see [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/).

* **Error 429 (Too Many Requests):**

    * The Jikan API has request limits. Avoid rapid reloads or load testing. If you see a 429 error, wait and try again.

---

## Testing

```sh
npm test
# or
yarn test
```

* **Jest** and **React Native Testing Library** are set up.
* Some components using Reanimated may not be testable due to lack of proper mocks on RN CLI projects.

---

## Known Issues & Tradeoffs

* **Reanimated Animations Not Working on Android:**

    * If animations (favorite flyers, parallax, fade-in, etc.) do **not** work on Android, ensure:

        * Metro is reset after install or babel changes.
        * You're running a real device or a recent emulator (some animations do not play in debug mode).
        * Babel plugin is set up.
        * Release build works as expected.

* **API Limits:**

    * Too many requests to the Jikan API will result in a 429 error. Data is not cached to avoid stale results, so be mindful of usage.

* **Testing Limitations:**

    * Some advanced animations and navigation interactions are hard to mock or test due to current ecosystem limitations.

* **Build Warnings:**

    * If you see Gradle deprecation warnings, see the [Android Build Troubleshooting](#android-build-troubleshooting) section below.

---

## Folder Structure

```
/src
  /components
    AnimeCard.tsx
    FavoriteButton.tsx
    GenreFilter.tsx
    ShareButton.tsx
    AnimatedIcon.tsx
  /screens
    HomeScreen.tsx
    FavoriteScreen.tsx
    AnimeDetailScreen.tsx
  /store
    animeSlice.ts
    favoritesSlice.ts
    index.ts
  /types
    anime.ts
  /utils
    animeApi.ts
/jest.setup.ts
/App.tsx
```

---

## Android Build Troubleshooting

* **Release Build Fails on Gradle 8+**

    * Check your `android/build.gradle` for plugin and Kotlin version compatibility.
    * Run `./gradlew clean` then `./gradlew assembleRelease --warning-mode all` for details.
    * Update any deprecated plugins or dependencies as shown in the gradle log output.

* **Animations Not Working in Debug**

    * Try a release build.
    * Check babel config and metro cache.
    * Sometimes animations are intentionally disabled or slow in JS debug mode.

---

## License

MIT

---

## Author

[**Tareq Aziz**](https://github.com/tareq0065)
