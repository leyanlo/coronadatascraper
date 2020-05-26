// This file is used to hold ambient type declarations, as well as type shims
// for npm module without type declarations, and assets files.

// For example, to shim modules without declarations, use:
// declare module 'package-without-declarations';
declare module '@deck.gl/aggregation-layers';
declare module '@deck.gl/layers';
declare module '@deck.gl/react';

// And to shim assets, use (one file extension per `declare`):
// declare module '*.png';
declare module '*.json';
declare module '*.svg';
