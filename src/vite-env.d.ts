/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_ENDPOINT?: string;
  readonly SMTP_HOST?: string;
  readonly SMTP_PORT?: string;
  readonly SMTP_USER?: string;
  readonly SMTP_PASS?: string;
  readonly TO_ADDRESS?: string;
  readonly CLIENT_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

