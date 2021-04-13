import { blobToHex, DerEncodedBlob } from "@dfinity/agent";
import { WebAuthnIdentity } from "@dfinity/identity";
import { PublicKey } from "../typings";

type AuthenticationOptions = {};

export const authenticate = (opts?: AuthenticationOptions) => {
  WebAuthnIdentity.create; //?
  return WebAuthnIdentity.create().then((identity: WebAuthnIdentity) => {
    persistIdentity(identity);
    return identity.toJSON();
  });
};

export const persistIdentity = (identity: WebAuthnIdentity) => {
  localStorage.setItem("identity", JSON.stringify(identity.toJSON()));
};

export default {};
