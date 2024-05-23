import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

// IDs y toda la info de la base de datos
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ianvalentino.eazychef",
  projectId: "664a2b3800317b38b495",
  databaseId: "664a2cbb00168643cac5",
  // Colecciones
  userCollectionId: "664a2cec0032bbc9baa1",
  videoCollectionId: "664a2d25001b99c3fb47",
  ingredientesCollectionId: "664e12b10039f90b5c05",
  // FIN Colecciones
  storageId: "664a2e40002dbf48543f",
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

export const createUser = async (email, password, username, Rol) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
      Rol
    );

    //console.log("Creando cuenta:", newAccount);

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

    return newUser;
  } catch (error) {
    console.log("Error al crear usuario:", error);
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
    throw new Error("ERRORSITO GET ACCOUNT: " + error.message);*/
    console.log('Error al Obtener Cuenta', error)
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
    }

    return currentUser.documents[0];
  } catch (error) {
    /*console.log("ERRORSITO GET CURRENT USER:", error);*/
    return null;
  }
}

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

// no usado
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
        2000,
        2000,
        "top",
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

export const uploadFile = async (file, type) => {
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
    throw new Error("error potente", error);
  }
};

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
    return newPost;
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
    throw new Error("error potente", error);
  }
};

export const createIngredient = async (form) => {
  try {
    
    const [imagenUrl] = await Promise.all([
      uploadIngredient(form.imagenUrl, "image"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      ingredientesCollectionId,
      ID.unique(),
      {
        nombre_ingrediente: form.nombre_ingrediente,
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

export const updateIngredient = async (ingredientId, form) => {
  try {

    const updatedPost = await databases.updateDocument(
      databaseId,
      ingredientesCollectionId,
      {
        nombre_ingrediente: form.nombre_ingrediente,
        categoria: form.categoria,
        ubicacion_almacen: form.ubicacion_almacen,
        usuario: form.userId,
      }
    );
    
    return updatedPost;
  } catch (error) {
    throw new Error(error);
  }
};


// Actualizar Ingrediente

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