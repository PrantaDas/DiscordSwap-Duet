
// Web3 initialiation Error
export class Web3NodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Web3NodeError';
  }
};