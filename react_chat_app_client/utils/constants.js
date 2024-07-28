export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "/api/auth";

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`;
export const UPDATE_USER_PROFILE = `${AUTH_ROUTES}/updateProfile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/addProfileImage`;
export const DELETE_PROFILE_IMAGE = `${AUTH_ROUTES}/deleteProfileImage`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = "/api/contacts";
export const GET_CONTACTS = `${CONTACTS_ROUTES}/getContacts`;
export const GET_CONTACTS_FOR_MESSAGES = `${CONTACTS_ROUTES}/getContactsForMessages`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/getAllContacts`;

export const MESSAGES_ROUTES = "/api/messages";
export const GET_MESSAGES = `${MESSAGES_ROUTES}/getMessages`;
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/uploadFile`;

export const CHANNEL_ROUTES = "/api/channels";
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/createChannel`;
export const GET_PERSONALIZED_CHANNELS = `${CHANNEL_ROUTES}/getPersonalizedChannels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/getChannelMessages`;