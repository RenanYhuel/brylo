module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [2, 'always', [
			'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'security', 'infra', 'release', 'deps', 'config', 'wip', 'init', 'merge', 'polish', 'cleanup', 'breaking', 'hotfix', 'example', 'i18n', 'ux', 'api', 'agent', 'doc', 'meta', 'misc', 'prototype', 'remove', 'add', 'update', 'upgrade', 'downgrade', 'rollback', 'deprecate', 'rename', 'split', 'move', 'format', 'lint', 'env', 'setup', 'teardown', 'monitor', 'track', 'debug', 'test', 'coverage', 'workflow', 'release', 'publish', 'deploy', 'sync', 'lock', 'unlock', 'patch', 'bump', 'drop', 'pin', 'unpin'
		]],
		'subject-case': [2, 'always', ['sentence-case', 'start-case', 'lower-case']],
		'header-max-length': [2, 'always', 100]
	}
};
