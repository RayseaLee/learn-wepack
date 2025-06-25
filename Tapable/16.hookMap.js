const { HookMap, SyncHook } = require('./tapable');

const map = new HookMap(() => new SyncHook(['name', 'age']));
map.for('key1').tap('plugin1', (name, age) => { console.log('plugin1', name, age) });
map.for('key1').tap('plugin2', (name, age) => { console.log('plugin2', name, age) });
map.for('key2').tap('plugin3', (name, age) => { console.log('plugin3', name, age) });

map.get('key1').call('raysea', 20);
map.get('key2').call('Lee', 24);