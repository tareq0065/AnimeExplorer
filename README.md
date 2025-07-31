# AnimeExplorer

A React Native CLI app for browsing, shorting, and favoriting anime, built using the [Jikan API](https://jikan.moe/).
You can view anime details, filter by genre, favorite your top picks, and enjoy delightful UI/UX with smooth animations and modern navigation.

---

## Features (tested all in iOS)

### Core Requirements
* Anime List Screen
  * ✅ Fetch data from Jikan API (/v4/anime)
  * ✅ Show anime list: image, title, score
  * ✅ Pagination/infinite scroll

* Anime Detail Screen
  * ✅ Tap an anime to view detail screen
  * ✅ Show synopsis, genres, score, and all relevant info

* Favorites Feature
  * ✅ Favorite/unfavorite anime
  * ✅ Favorites stored locally (AsyncStorage)
  * ✅ Favorites persist on reload
  * ✅ Favorites tab to view saved items

* Filter by Genre
  * ✅ Genre dropdown/filter
  * ✅ Uses Jikan API genre filtering (not just client-side)

* Basic Styling and UX
  * ✅ Responsive layout (flex, dimensions, Tailwind/nativewind)
  * ✅ Placeholders/loading UI (ActivityIndicator, skeletons)
  * ✅ Handles API errors (shows messages, retry, graceful fallback)

### Bonus Points / Extras
* Use TypeScript
  * ✅ Full TS types, strict mode

* Animations
  * ✅ Heart/favorite animated with flyers and scaling (Reanimated)
  * ✅ Animated list appearance (FadeInDown)
  * ✅ Parallax image on detail page

* State Manager
  * ✅ Redux Toolkit (RTK) for state and persistence

* Unit/Integration Tests
  * ✅ Basic Jest tests for slices, API, (limited Reanimated/component tests due to library constraints)

* Deep Linking/Share
  * ✅ Share functionality (deep link and web URL supported)
  * 🔲 Deep linking navigation not fully tested/implemented (app opens to correct detail screen if link is handled externally? Could be added.)

* Code-Splitting/Perf
  * 🔲 No explicit code-splitting (not usually critical in RN apps, but structure is modular)
  * ✅ Performance: uses PureComponent/memo, FlatList best practices

---

## Tech Stack

* **React Native CLI** (not Expo)
* **TypeScript** for type safety
* **Redux Toolkit** for state management
* **NativeWind (TailwindCSS)** for styling
* **React Navigation** for navigation and stacks
* **React Native Reanimated** for performant animations
* **AsyncStorage** for local persistence
* **Jikan API** for anime data
* **Jest** and **React Native Testing Library** for testing

---

## How to Run

### **1. Clone the Repo**

```sh
git clone https://github.com/tareq0065/AnimeExplorer.git
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

### **4. Run on iOS**

```sh
npx pod-install ios
npx react-native run-ios
```

### **5. Run on Android**

```sh
npx react-native run-android
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

## Thought Process & Architecture Decisions
### Why React Native CLI (not Expo)?
* Production-ready: Offers full control over native modules, necessary for advanced animations and custom native integrations.
* Challenge-compliant: Shows comfort with native setup and readiness for real-world mobile engineering.

### TypeScript Everywhere
* Used strict TypeScript for all components, API files, and store slices to catch bugs early, enable IDE autocompletion, and simplify maintenance.

### State Management
* Redux Toolkit: Chosen for scalability, predictable state, and easy integration with AsyncStorage for persistence (favorites, genre filter, paginated list).
* Why not Context or Zustand? RTK is widely adopted for medium-to-large codebases and better supports advanced logic like async loading and persistence.

### API Integration
* Axios for fetching from the Jikan API, supporting pagination and genre filtering.
* Graceful handling of API/network errors and 429 rate limits (clear user messaging, retry option).

### Navigation & Deep Linking
* React Navigation (Stack & Tab): Robust navigation, deep link support (for share feature), and consistent UI/UX across Android and iOS.

### Animations
* React Native Reanimated v2: Enables smooth, native-performant animations (favorite heart flyers, scale, fade-ins, parallax image).
* NativeWind (TailwindCSS for RN): Rapid, maintainable, and responsive styling for a modern look.

### Component Architecture
* All components (AnimeCard, FavoriteButton, GenreFilter, ShareButton) are decoupled and reusable.
* Separated API and store logic for easier testing and maintainability.

### Error Handling & UX
* All API errors are handled gracefully with user-friendly messages and a retry button.
* Persistent favorites via AsyncStorage.
* Loading states, empty states, and infinite scroll for best user experience.

### Performance
* Uses FlatList for efficient large-list rendering.
* AnimeCard and key subcomponents are memoized (React.memo) to minimize re-renders.

### Testing
* Jest & React Native Testing Library: Basic unit and integration tests for Redux slices and API logic.
* Animation components are harder to test due to library limitations (Reanimated v2 is not fully mockable).

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
  AnimeExplorer.tsx
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
    storage.ts
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

## Author

[**Tareq Aziz**](https://github.com/tareq0065)
