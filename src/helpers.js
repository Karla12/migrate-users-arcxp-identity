import { v4 as uuidv4 } from "uuid";

function removeEmptyData(obj) {
  const newObject = {};
  for (const key in obj) {
    if (obj[key] !== "") {
      newObject[key] = obj[key];
    }
  }
  return newObject;
}

export const mapHeaders = ({ header }) => {
  return header.trim();
};

export const fotmatJsonResult = (data) => {
  const dataResult = {};

  if (data.userName && data.credentials) {
    dataResult.identities = [
      {
        userName: data.userName,
        credentials: data.credentials,
        grantType: data.grantType || "",
        lastLoginDate: data.lastLoginDate || "",
      },
    ];
    dataResult.identities[0] = removeEmptyData(dataResult.identities[0]);
  }
  if (data.email) {
    dataResult.profile = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      secondLastName: data.secondLastName || "",
      displayName: data.displayName || "",
      gender: data.gender || "",
      email: data.email,
      birthYear: data.birthYear || "",
      birthMonth: data.birthMonth || "",
      birthDay: data.birthDay || "",
      legacyId: data.legacyId || "",
      deletionRule: data.deletionRule || "",
      emailVerified: data.emailVerified !== undefined ? data.emailVerified : "",
      createdOn: data.createdOn || "",
    };
    dataResult.profile = removeEmptyData(dataResult.profile);
  } else {
    if (data.typeContacts || data.line1 || data.name) {
      dataResult.profile = dataResult.profile || {};
    }
  }

  if (dataResult.profile && data.typeContacts && data.phone) {
    dataResult.profile.contacts = [
      {
        type: data.typeContacts,
        phone: data.phone,
      },
    ];
  }

  if (dataResult.profile && data.typeAddresses && data.line1 && data.locality) {
    dataResult.profile.addresses = [
      {
        type: data.typeAddresses,
        line1: data.line1,
        line2: data.line2 || "",
        locality: data.locality,
        region: data.region || "",
        postal: data.postal || "",
        country: data.country || "",
      },
    ];
    dataResult.profile.addresses[0] = removeEmptyData(
      dataResult.profile.addresses[0]
    );
  }

  if (dataResult.profile && data.typeAttributes && data.name && data.value) {
    dataResult.profile.attributes = [
      {
        type: data.typeAttributes,
        name: data.name,
        value: data.value,
      },
    ];
  }

  dataResult.uuid = uuidv4();
  return dataResult;
};
