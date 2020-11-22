interface GoogleOauthEntity {
  createAuthUrl(): string;
  exchangeCodeForTokens(code: string): Promise<any>;
}

export default GoogleOauthEntity
