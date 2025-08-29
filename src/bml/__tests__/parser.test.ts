import { parseBml } from '../parser'; // If using Node16/Next, add .js extension when compiled

describe('BML Parser', () => {
    it('should throw if not implemented', () => {
        expect(() => parseBml('')).toThrow('BML parser not implemented yet');
    });
});
