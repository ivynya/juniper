// https://github.com/ai/nanoid (MIT License)

export const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
const scopedUrlAlphabet = urlAlphabet;

// It is best to make fewer, larger requests to the crypto module to
// avoid system call overhead. So, random numbers are generated in a
// pool. The pool is a Buffer that is larger than the initial random
// request size by this multiplier. The pool is enlarged if subsequent
// requests exceed the maximum buffer size.
const POOL_SIZE_MULTIPLIER = 128;
let pool: Uint8Array, poolOffset: number;

function fillPool(bytes: number) {
	if (!pool || pool.length < bytes) {
		pool = new Uint8Array(bytes * POOL_SIZE_MULTIPLIER);
		window.crypto.getRandomValues(pool);
		poolOffset = 0;
	} else if (poolOffset + bytes > pool.length) {
		window.crypto.getRandomValues(pool);
		poolOffset = 0;
	}
	poolOffset += bytes;
}

export function random(bytes: number) {
	// `|=` convert `bytes` to number to prevent `valueOf` abusing and pool pollution
	fillPool((bytes |= 0));
	return pool.subarray(poolOffset - bytes, poolOffset);
}

export function nanoid(size = 21) {
	// `|=` convert `size` to number to prevent `valueOf` abusing and pool pollution
	fillPool((size |= 0));
	let id = '';
	// We are reading directly from the random pool to avoid creating new array
	for (let i = poolOffset - size; i < poolOffset; i++) {
		// It is incorrect to use bytes exceeding the alphabet size.
		// The following mask reduces the random byte in the 0-255 value
		// range to the 0-63 value range. Therefore, adding hacks, such
		// as empty string fallback or magic numbers, is unnecessary because
		// the bitmask trims bytes down to the alphabet size.
		id += scopedUrlAlphabet[pool[i] & 63];
	}
	return id;
}
