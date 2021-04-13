import { WebAuthnIdentity } from "@dfinity/identity";
import { hexEncodeUintArray } from "@dfinity/authentication";
import { testGlobal } from "../../../../../setupTests";
import { IDPActor } from "../actor";
import { PublicKey } from "../../typings";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";

jest.mock("@dfinity/identity");
jest.mock("../handleAuthentication", () => {
  return {
    authenticate: jest.fn(() => {
      return {
        publicKey: "asdf",
      };
    }),
  };
});

const { mockActor } = testGlobal;
describe("Actor Interface", () => {
  const testUser = BigInt(1234);
  const testAlias = "my desktop";
  const testPublicKey = [1, 2, 3];
  const testCredential = "X9FrwMfmzj";
  it("should handle a user registering", () => {
    const actor = new IDPActor();
    const shouldNotThrow = async () =>
      await actor.register(testUser, testAlias, testPublicKey);
    expect(shouldNotThrow).not.toThrow();
    expect(mockActor.register).toBeCalledWith(
      BigInt(1234),
      "my desktop",
      [1, 2, 3],
      []
    );
  });

  it("should handle a user registering with a credential", () => {
    const actor = new IDPActor();
    const shouldNotThrow = async () =>
      await actor.register(testUser, testAlias, testPublicKey, testCredential);
    expect(shouldNotThrow).not.toThrow();
    expect(mockActor.register).toBeCalledWith(
      BigInt(1234),
      "my desktop",
      [1, 2, 3],
      [[88, 57, 70, 114, 119, 77, 102, 109, 122, 106]]
    );
  });

  it.only("should handle adding a new identity", () => {
    const actor = new IDPActor();
    const shouldNotThrow = async () =>
      await actor.add(testUser, testAlias, testPublicKey);
    expect(shouldNotThrow).not.toThrow();
    expect(mockActor.add).toBeCalledWith(
      BigInt(1234),
      "my desktop",
      [1, 2, 3],
      []
    );
  });

  it("should handle adding a new identity with a credential", () => {
    const actor = new IDPActor();
    const shouldNotThrow = async () =>
      await actor.add(testUser, testAlias, testPublicKey, testCredential);
    expect(shouldNotThrow).not.toThrow();
    mockActor.add; //?
    expect(mockActor.add).toBeCalledWith(
      BigInt(1234),
      "my desktop",
      [1, 2, 3],
      [[88, 57, 70, 114, 119, 77, 102, 109, 122, 106]]
    );
  });

  it("should handle removing an identity", () => {
    const actor = new IDPActor();
    const shouldNotThrow = async () =>
      await actor.remove(testUser, testPublicKey);
    expect(shouldNotThrow).not.toThrow();
    expect(mockActor.remove).toBeCalledWith(BigInt(1234), [1, 2, 3]);
  });

  it("should handle looking up stored info for a user", () => {
    const actor = new IDPActor();
    const shouldNotThrow = async () => await actor.lookup(testUser);
    expect(shouldNotThrow).not.toThrow();
    expect(mockActor.lookup).toBeCalledWith(BigInt(1234));
  });
});
