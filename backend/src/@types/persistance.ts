export interface Persistance {
  query: (sql: string, escapeData?: any[]) => Promise<any>;
}

export interface MySQLPool extends Persistance {}
