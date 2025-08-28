import { main } from '../src/index';

describe('CLI', () => {
    it('should run main without error', () => {
        expect(() => main()).not.toThrow();
    });
});
