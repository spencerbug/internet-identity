import * as React from "react";
import actor from "../utils/actor";
import BigNumber from "bignumber.js";

interface Props {}

function RegisterIdentity(props: Props) {
  const {} = props;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const registerUser = target.querySelector(
      "#registerUser"
    ) as HTMLInputElement;
    const registerAlias = target.querySelector(
      "#registerAlias"
    ) as HTMLInputElement;

    actor.register(BigInt(registerUser.value), registerAlias.value);

    return false;
  };

  return (
    <form onSubmit={handleSubmit} data-testid="registerForm">
      <h2>Register an identity</h2>
      <label htmlFor="registerUser">
        User (expects a number)
        <input type="text" name="registerUser" id="registerUser" required />
      </label>
      <label htmlFor="registerAlias">
        Alias (expects a string)
        <input type="text" name="registerAlias" id="registerAlias" required />
      </label>

      <button type="submit" id="register-identity">
        Register Identity
      </button>
    </form>
  );
}

export default RegisterIdentity;
