import { Role, Teams } from "appwrite";

import { Alert } from "react-native";
import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
  Permission,
} from "react-native-appwrite";

// IDs y toda la info de la base de datos
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ianvalentino.eazychef",
  projectId: "664a2b3800317b38b495",
  databaseId: "664a2cbb00168643cac5",
  // Colecciones -> Tablas
  userCollectionId: "664a2cec0032bbc9baa1",
  videoCollectionId: "664a2d25001b99c3fb47",
  ingredientesCollectionId: "664e12b10039f90b5c05",
  // FIN Colecciones
  storageId: "664a2e40002dbf48543f",
  teamId: "665593300007a50cff28",
};
// Si se crea algo nuevo, se añade aquí

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  ingredientesCollectionId,
  storageId,
} = config;

const client = new Client();

client

  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
// Teams
export const teams = new Teams(client);

// Permisos a roles
const permissions = [
  Permission.read(Role.any()),
  Permission.create(Role.any()),
  Permission.delete(Role.any()),
  Permission.update(Role.any()),
];

// Función para listar y mostrar los equipos por consola
export const listTeams = async () => {
  try {
    // Obtener la lista de equipos
    const result = await teams.list();

    return result;
  } catch (error) {
    console.error("Error al listar los equipos:", error);
  }
};

// Fetch platos
export const fetchPlatos = async () => {
  const response = await databases.listDocuments(databaseId, videoCollectionId);
  return response.documents;
};

// Fetch ingredientes for a specific plato
export const fetchIngredientes = async (platoId) => {
  const response = await databases.listDocuments(databaseId, ingredientesCollectionId, [`plato=${platoId}`]);
  return response.documents;
};

// Example usage
fetchPlatos().then(async (platos) => {
  for (let plato of platos) {
    const ingredientes = await fetchIngredientes(plato.$id);
    console.log(plato, ingredientes);
  }
});

console.log(fetchPlatos());

/* auth */
export const createUser = async (email, password, username, Rol) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
      Rol
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
        Rol,
      }
    );

    /*try {
      // Asignar al equipo según el rol
      await asignarEquipo(email, Rol);
    } catch (error) {
      console.log("error", error.message);
    }*/

    return newUser;
  } catch (error) {
    console.log("Error al crear usuario:", error);
    throw new Error(error);
  }
};

// Función para asignar el usuario a un equipo según el rol
const asignarEquipo = async (email, Rol) => {
  try {
    // IDs de los equipos
    const teamPropietarioId = "665593300007a50cff28";
    const teamGeneralId = "6655e7c200024a526f7e";

    // Determinar el equipo basado en la entrada del usuario
    let teamId =
      Rol.toLowerCase() === "propietario" ? teamPropietarioId : teamGeneralId;

    const result = await teams.createMembership(
      teamId, // teamId
      ['member'], // roles
      'https://example.com',
    );

    console.log(result);
    console.log(`Usuario añadido al equipo ${teamId} con éxito`);
  } catch (error) {
    console.log("Error al asignar equipo:", error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  //console.log(email, password);
  try {
    // Crear nueva sesión
    const session = await account.createEmailPasswordSession(email, password);

    //console.log("Sesión creada:", session);

    return session;
  } catch (error) {
    console.log("Error al iniciar sesión:", error);
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    /*if (error.message.includes("missing scope")) {
      console.log("El usuario no tiene los permisos necesarios.");
    }
    console.log("Error al obtener cuenta:", error);
    console.log("Error al Obtener Cuenta", error);*/
    throw new Error("Error: " + error.message);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error("La cuenta actual no se pudo obtener");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser)
      throw Error("No se encontró ningún usuario para la cuenta actual");

    if (!currentUser.documents || currentUser.documents.length === 0) {
      console.log("No se encontraron documentos para el usuario actual");
      const session = await account.deleteSession("current");
    }

    return currentUser.documents[0];
  } catch (error) {
    /*console.log("ERRORSITO GET CURRENT USER:", error);*/
    return null;
  }
}

/* Platos - Leer */
// Lista los Platos
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
// Lista los últimos Platos
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
// Buscar Platos
export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(`Failed to search posts: ${error.message}`);
  }
};
export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
/* FIN Platos - Leer */

/* Platos - Crear */
// Crear un nuevo plato
export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    // Devuelve el nuevo plato
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
// Crear un nuevo ingrediente
export const createIngredient = async (form) => {
  try {
    const [imagenUrl] = await Promise.all([
      uploadFile(form.imagen_ingrediente, "image"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      ingredientesCollectionId,
      ID.unique(),
      {
        nombre_ingrediente: form.nombre_ingrediente,
        imagen_ingrediente: imagenUrl,
        medida: form.medida,
        cantidad: form.cantidad,
        precio_unidad: form.precio_unidad,
        categoria: form.categoria,
        ubicacion_almacen: form.ubicacion_almacen,
        usuario: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
export const uploadFile = async (file, type) => {
  if (!file) return;

  // Esto es como la galería de la BBDD
  const asset = {
    name: file.fileName,
    // Tipo de medio
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error("Error al subir archivo", error);
  }
};
/* FIN Platos - Crear */

/* Platos - Eliminar */
export const deletePlato = async (platoId) => {
  try {
    await databases.deleteDocument(databaseId, videoCollectionId, platoId);
    Alert.alert("Plato borrado");
  } catch (error) {
    console.error("Fallo al eliminar el plato:", error);
  }
};
/* FIN Platos - Eliminar */
/* Platos - Actualizar */
export const updatePlato = async (platoId, updatedPlato) => {
  try {
    const response = await databases.updateDocument(
      databaseId,
      videoCollectionId,
      platoId,
      updatedPlato
    );
    return response;
  } catch (error) {
    console.error("Fallo al actualizar el plato:", error);
  }
};
/* FIN Platos - Actualizar */

// Lista los Ingredientes
export const getAllIngredients = async () => {
  try {
    // Esto devuelve todos los documentos que hay dentro de la colección
    // Es decir, todos los ingredientes dentro de la lista de ingredientes
    const posts = await databases.listDocuments(
      databaseId,
      ingredientesCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

// Buscar ingredientes (no usado)
export const searchIngredients = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      ingredientesCollectionId,
      [Query.search("nombre_ingrediente", query)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(`Failed to search posts: ${error.message}`);
  }
};

// Cerrar Sesión
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        // Tamaño
        2000,
        2000,
        // Posición
        "top",
        // Calidad
        100
      );
    } else {
      throw new Error("Tipo de archivo no válido!");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};
export const uploadIngredient = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error("Error al subir archivo", error);
  }
};

/* Ingredientes - Actualizar */
export const updateIngredient = async (ingredientId, updatedIngrediente) => {
  try {
    const response = await databases.updateDocument(
      databaseId,
      ingredientesCollectionId,
      ingredientId,
      updatedIngrediente,
    );
    Alert.alert("Ingrediente actualizado");
    return response;
  } catch (error) {
    if (error.message.includes("the current user is not authorized")) {
      Alert.alert(
        "No tiene permiso",
        "No estás autorizado para crear un producto"
      );
    } else {
      Alert.alert("No estás autorizado para editar un producto", error.message);
    }
  }
};

export const deleteIngredient = async (ingredientId) => {
  try {
    await databases.deleteDocument(
      databaseId,
      ingredientesCollectionId,
      ingredientId
    );
    Alert.alert("Ingrediente borrado");
  } catch (error) {
    console.error("Fallo al eliminar el Ingrediente:", error);
  }
};
/* FIN Ingredientes - Actualizar */

// Eliminar Ingrediente
/**
 * Añadir Ingrediente Al Plato
 *
 * Lógica BBDD:
 * PASTA CARNE -> PLATO -> Colección
 * 100gr PASTA -> Ingrediente -> Colección
 * 50gr CARNE -> Ingrediente -> Colección
 *
 * One To Many
 * Un Plato pertenece a Muchos Ingredientes
 *
 * Many To One
 * Muchos Ingredientes pertenecen a un Plato
 *
 * - Medidas Kg, Gr... React Native
 *
 * Un Ingrediente (Tomate pertenece a pasta carne, gazpacho, etc)
 * One To Many con Platos
 *
 * Lógica de Roles
 *
 * React Native + Expo +
 *
 * App Expo Go
 *
 *
 */
