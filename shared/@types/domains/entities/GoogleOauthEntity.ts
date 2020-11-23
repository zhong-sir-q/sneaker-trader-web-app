interface GoogleOauthEntity {
  createAuthUrl(): string | Promise<string>;
  exchangeCodeForTokens(code: string): Promise<any>;
}

export default GoogleOauthEntity
