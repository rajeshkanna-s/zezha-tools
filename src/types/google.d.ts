/* ── Google Identity Services (GIS) type declarations ──────────── */

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: any) => void;
        hint?: string;
        hosted_domain?: string;
        prompt?: string;
      }

      interface TokenResponse {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        error?: string;
        error_description?: string;
        error_uri?: string;
      }

      interface TokenClient {
        requestAccessToken(overrides?: { prompt?: string; hint?: string }): void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
      function revoke(token: string, callback?: () => void): void;
      function hasGrantedAllScopes(
        tokenResponse: TokenResponse,
        ...scopes: string[]
      ): boolean;
    }
  }
}
