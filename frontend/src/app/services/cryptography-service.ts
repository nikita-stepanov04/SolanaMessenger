import { Injectable } from '@angular/core';
import {pbkdf2} from '@noble/hashes/pbkdf2.js';
import {sha256} from '@noble/hashes/sha2.js';
import {x25519} from '@noble/curves/ed25519.js';
import Base64 from '@bindon/base64';

const encoder = new TextEncoder();

@Injectable({
  providedIn: 'root',
})
export class CryptographyService {

  public deriveX25519KeyPair(keyText: string, saltText: string) {
    const sec = this.derivePBKDF2PrivateKey(keyText, saltText);
    const pub = x25519.getPublicKey(sec);

    return {sec: sec, pub: pub};
  }

  public derivePBKDF2PrivateKey(keyText: string, saltText: string): Uint8Array<ArrayBufferLike> {
    const keyBytes = encoder.encode(keyText);
    const saltBytes = encoder.encode(saltText);

    return pbkdf2(sha256, keyBytes, saltBytes, {
      c: 100000,
      dkLen: 32
    });
  }

  public bytesToBase64(bytes: Uint8Array<ArrayBufferLike>): string {
    return Base64.encode(bytes, {padding: true, urlSafe: false});
  }
}
