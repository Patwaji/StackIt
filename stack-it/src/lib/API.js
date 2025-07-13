const BASE_URL = "http://localhost:5020/api";
export const loginUrl = `${BASE_URL}/users/login`;
export const signUpUrl = `${BASE_URL}/users/signup`;
export const verifyOtpUrl = `${BASE_URL}/users/verify-otp`;
export const sendOtpUrl = `${BASE_URL}/users/send-otp`;
export const userDetailsUrl = `${BASE_URL}/users/me`;

export const postQuestionUrl = `${BASE_URL}/questions/new-question`;
export const getAllQuestionUrl = `${BASE_URL}/questions/all`;
export const questionOperationUrl = `${BASE_URL}/questions/`;

export const postAnswerUrl = `${BASE_URL}/replies/reply`;
export const replyOperationUrl = `${BASE_URL}/replies/`;

export const notificationUrl = `${BASE_URL}/notifications/all`;
