import {Injectable} from '@angular/core';
import {pbkdf2} from '@noble/hashes/pbkdf2.js';
import {sha256} from '@noble/hashes/sha2.js';
import {x25519} from '@noble/curves/ed25519.js';
import Base64 from '@bindon/base64';
import {hkdf} from '@noble/hashes/hkdf.js';
import {Chat} from '../state/chats/chats-models';
import {gcm} from '@noble/ciphers/aes.js';
import {DecryptedMessage} from '../state/messages/models/decrypted-message';
import {WriteMessage} from '../state/messages/models/write-message';
import {EncryptedMessage} from '../state/messages/models/encrypted-message';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const CHAT_SALT = "chat_salt";
const CHAT_AAD = "chat_aad";
const NONCE_LENGTH = 12;
const HKDF_LENGTH = 32;
const TAG_LENGTH = 16;

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

  public base64ToBytes(base64: string): Uint8Array<ArrayBufferLike> {
    return Base64.decode(base64);
  }

  public sha256Concat(...parts: string[]): Uint8Array {
    const byteParts: Uint8Array[] = parts.map(str => encoder.encode(str));
    const totalLength = byteParts.reduce((sum, p) => sum + p.length, 0);
    const buffer = new Uint8Array(totalLength);

    let offset = 0;
    for (const part of byteParts) {
      buffer.set(part, offset);
      offset += part.length;
    }
    return sha256(buffer);
  }

  public deriveCEK(
    x25519Priv: string,
    userID: string,
    chat: Chat
  ): Chat {
    const priv = this.base64ToBytes(x25519Priv);
    const pub = this.base64ToBytes(chat.encryptionPayload!.ephemeralPublicKey);
    const nonce = this.base64ToBytes(chat.encryptionPayload!.nonce);
    const cipher = this.base64ToBytes(chat.encryptionPayload!.encryptedMessageEncryptionKey);

    const chatSalt = this.deriveChatSalt(chat.id);
    const chatAAD = this.deriveChatAAD(chat.id, userID);

    const hkdfKey = x25519.getSharedSecret(priv, pub);
    const kek = hkdf(sha256, hkdfKey, chatSalt, undefined, HKDF_LENGTH);

    const aes = gcm(kek, nonce, chatAAD);
    const cek = aes.decrypt(cipher);

    return {
      ...chat,
      cek: this.bytesToBase64(cek),
    }
  }

  public decryptMessage(message: EncryptedMessage, cek: string): DecryptedMessage {
    const key = this.base64ToBytes(cek);
    const tag = this.base64ToBytes(message.tag);
    const nonce = this.base64ToBytes(message.nonce);
    const ciphertext = this.base64ToBytes(message.ciphertext);

    const cipherWithTag = new Uint8Array(ciphertext.length + tag.length);
    cipherWithTag.set(ciphertext);
    cipherWithTag.set(tag, ciphertext.length);

    const aes = gcm(key, nonce);
    const decrypted = aes.decrypt(cipherWithTag);

    return {
      id: message.id,
      userID: message.userID,
      chatID: message.chatID,
      text: decoder.decode(decrypted),
      timestamp: message.timestamp,
      isPending: false
    }
  }

  public encryptMessage(message: DecryptedMessage, cek: string): WriteMessage {
    const key = this.base64ToBytes(cek);
    const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
    const text = encoder.encode(message.text);

    const aes = gcm(key, nonce);
    const cipherWithTag = aes.encrypt(text);

    return {
      chatID: message.chatID,
      ciphertext: this.bytesToBase64(cipherWithTag.slice(0, -TAG_LENGTH)),
      tag: this.bytesToBase64(cipherWithTag.slice(-TAG_LENGTH)),
      nonce: this.bytesToBase64(nonce)
    };
  }

  private deriveChatSalt(chatID: string) {
    return this.sha256Concat(CHAT_SALT, chatID)
  }

  private deriveChatAAD(chatID: string, userID: string) {
    return this.sha256Concat(CHAT_AAD, chatID, userID);
  }
}
