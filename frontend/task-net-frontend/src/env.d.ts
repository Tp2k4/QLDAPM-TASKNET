interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  // thêm biến env khác nếu cần
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}