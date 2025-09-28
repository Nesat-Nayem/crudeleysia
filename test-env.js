#!/usr/bin/env node

// Simple script to test Railway environment variables
console.log('=== Railway Environment Test ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PORT:', process.env.PORT || 'not set');
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN || 'not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'set (hidden)' : 'not set');

console.log('\n=== All Railway Variables ===');
Object.keys(process.env)
  .filter(key => key.includes('RAILWAY'))
  .forEach(key => console.log(`${key}:`, process.env[key]));

console.log('\n=== Expected PORT ===');
if (process.env.PORT) {
  console.log('✅ PORT is set:', process.env.PORT);
  console.log('Parsed as number:', parseInt(process.env.PORT, 10));
} else {
  console.log('❌ PORT is NOT set - Railway will not work!');
}
