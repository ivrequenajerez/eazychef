
Aplicación para Proyecto TFG 

## EazyChef

### Descripción
EazyChef es una aplicación móvil desarrollada con React Native, Expo y NativeWind, que facilita la creación y gestión de recetas culinarias.

### Requisitos

#### Versiones Necesarias
- Node.js: `>=14.x`
- npm: `>=6.x`
- Expo CLI: `>=6.x`

#### Dependencias
- **expo**: `~51.0.8`
- **expo-constants**: `~16.0.1`
- **expo-linking**: `~6.3.1`
- **expo-router**: `~3.5.14`
- **expo-status-bar**: `~1.12.1`
- **nativewind**: `^2.0.11`
- **react**: `18.2.0`
- **react-native**: `0.74.1`
- **react-native-safe-area-context**: `4.10.1`
- **react-native-screens**: `3.31.1`

#### Dependencias de Desarrollo
- **@babel/core**: `^7.20.0`
- **tailwindcss**: `^3.3.2`

### Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/eazychef.git
   cd eazychef
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Instala Expo CLI si no lo tienes:
   ```sh
   npm install -g expo-cli
   ```

### Uso

- Inicia el proyecto:
  ```sh
  npm start
  ```

- Para iniciar en Android:
  ```sh
  npm run android
  ```

- Para iniciar en iOS:
  ```sh
  npm run ios
  ```

- Para iniciar en web:
  ```sh
  npm run web
  ```

### Fuentes Personalizadas

Asegúrate de tener las siguientes fuentes en la carpeta `assets/fonts`:
- `Poppins-Thin.ttf`
- `Poppins-ExtraLight.ttf`
- `Poppins-Light.ttf`
- `Poppins-Regular.ttf`
- `Poppins-Medium.ttf`
- `Poppins-SemiBold.ttf`
- `Poppins-Bold.ttf`
- `Poppins-ExtraBold.ttf`
- `Poppins-Black.ttf`

Configura las fuentes en tu aplicación de esta manera:

```jsx
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function App() {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    // Resto de tu componente
  );
}
```

### Configuración de Tailwind CSS

Asegúrate de extender la configuración de `tailwind.config.js` con tus colores y fuentes personalizados:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFF7EF',
          100: '#FFF1E0',
          200: '#FFE8CC',
        },
        secondary: {
          DEFAULT: '#D68C45',
          100: '#E4A368',
          200: '#F1B98C',
        },
        dark: {
          DEFAULT: '#524439',
          100: '#726357',
          200: '#938275',
        },
        success: {
          DEFAULT: '#33B174',
          100: '#66C994',
          200: '#99E1B4',
        },
        warning: {
          DEFAULT: '#7B3100',
          100: '#995840',
          200: '#B78080',
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      }
    },
  },
  plugins: [],
}
```

### Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio importante antes de hacerlos.

### Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.

