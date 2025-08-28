import { main } from '../src/index';

describe('CLI', () => {
    it('should run main without error', () => {
        expect(() => main(['node', 'brylo', 'list'])).not.toThrow();
    });
});
