import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ianvalentino.eazychef",
  projectId: "664a2b3800317b38b495",
  databaseId: "664a2cbb00168643cac5",
  userCollectionId: "664a2cec0032bbc9baa1",
  videoCollectionId: "664a2d25001b99c3fb47",
  storageId: "664a2e40002dbf48543f",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

const client = new Client();

client
  .setEndpoint(config.endpoint) 
  .setProject(config.projectId) 
  .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    ) 

    console.log("Creando cuenta:", newAccount);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )

    return newUser;

  } catch (error) {
    console.log("Error al crear usuario:", error);
    throw new Error(error);
  }

}

export async function signIn(email, password) {
  console.log(email, password);
  try {

    // Crear nueva sesión
    const session = await account.createEmailPasswordSession(email, password);

    console.log("Sesión creada:", session);

    return session;

  } catch (error) {

    console.log("Error al iniciar sesión:", error);
    throw new Error(error);

  }
};

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    if (error.message.includes("missing scope")) {
      console.log("El usuario no tiene los permisos necesarios.");
    }
    console.log("Error al obtener cuenta:", error);
    throw new Error("ERRORSITO GET ACCOUNT: " + error.message);
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
    console.log("ERRORSITO GET CURRENT USER:", error);
    return null;
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    )

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}