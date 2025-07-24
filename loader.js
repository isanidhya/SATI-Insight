'use client';
 
export default function firebaseLoader({ src, width, quality }) {
  return `https://yourapp.bogoapps.com/${src}?w=${width}&q=${quality || 75}`
}
