import { executeModule } from '../interpreter'; // If using Node16/Next, add .js extension when compiled
import { BmlModule } from '../types'; // If using Node16/Next, add .js extension when compiled

describe('BML Interpreter', () => {
    it('should throw if not implemented', () => {
        const dummy: BmlModule = {
            name: 'dummy',
            metadata: {},
            run: { instructions: [] },
        };
        expect(() => executeModule(dummy)).toThrow('BML interpreter not implemented yet');
    });
});
