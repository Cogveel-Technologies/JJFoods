export type AuthStackParamList = {
  LogIn: undefined;
  SignUp: undefined;
  OTP: undefined;
}
export type TopTabParamList = {
  SignIn: undefined;
  SignUp: undefined;
  OTPLogin: { phoneNumber: string };
  OTPSignUp: { phoneNumber: string };
};