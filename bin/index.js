#!/usr/bin/env node
(async () => {
	const mod = await import('../dist/index.js');
	if (mod.main) mod.main();
})();
