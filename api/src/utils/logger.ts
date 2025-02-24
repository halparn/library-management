export const logger = {
  debug: (...args: any[]) => {
    if (process.env.DEBUG) {
      console.log('[DEBUG]', new Date().toISOString(), ...args);
    }
  },
  info: (...args: any[]) => {
    console.log('[INFO]', new Date().toISOString(), ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', new Date().toISOString(), ...args);
  }
}; 