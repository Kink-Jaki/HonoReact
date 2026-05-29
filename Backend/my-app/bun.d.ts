declare module 'bun:sqlite' {
  export class Database {
    constructor(filename?: string)
    run(sql: string): void
    query(sql: string): {
      all(): any[]
      get(...args: any[]): any
    }
  }
}

declare const Bun: {
  password: {
    hash(password: string): Promise<string>
    verify(password: string, hash: string): Promise<boolean>
  }
}
