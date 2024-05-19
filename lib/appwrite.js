import {
  Account,
  Avatars,
  Client,
  Databases,
  Permission,
  Role,
  ID,
  Query,
  Storage,
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

const client = new Client();

client
  .setEndpoint(config.endpoint) // Tu Endpoint de Appwrite
  .setProject(config.projectId) // Tu ID de proyecto
  .setPlatform(config.platform); // ID de tu aplicación o paquete.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    console.log("Creando cuenta:", newAccount);
    if (!newAccount) throw Error("Error al crear la cuenta");

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
      }
    );

    return newUser;
  } catch (error) {
    console.log("Error al crear usuario:", error);
    throw new Error(error);
  }
}

export const signIn = async (email, password) => {
  console.log(email, password);
  try {
    // Eliminar sesión actual si existe
    await account.deleteSession("current");

    // Crear nueva sesión
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Sesión creada:", session);
    return session;
  } catch (error) {
    console.log("Error al iniciar sesión:", error);
    throw new Error(error);
  }
};

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log("Error al obtener cuenta:", error);
    throw new Error("ERRORSITO GET ACCOUNT: " + error.message);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    console.log("Obteniendo cuenta actual:", currentAccount);

    if (!currentAccount) throw Error("La cuenta actual no se pudo obtener");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    console.log("Usuario actual:", currentUser);

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

// Crear un documento con permisos
let promise = databases.createDocument(
  config.databaseId,
  config.userCollectionId,
  ID.unique(),
  {
    accountId: '664a7b71002226bc1f17',
    email: 'ian@ianprueba.com',
    username: 'ian',
    avatar: 'https://github.com/ivrequenajerez/eazychef/tree/develop',
  },
  [
    Permission.read(Role.any()), // Cualquiera puede ver este documento
    Permission.update(Role.team("writers")), // Los escritores pueden actualizar este documento
    Permission.update(Role.team("admin")), // Los administradores pueden actualizar este documento
    Permission.delete(Role.team("admin")), // Los administradores pueden eliminar este documento
  ]
);

promise.then(
  function (response) {
    console.log("Documento creado con permisos:", response);
  },
  function (error) {
    console.log("Error al crear el documento:", error);
  }
);
