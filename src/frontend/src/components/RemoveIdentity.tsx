import * as React from "react";
import actor from "../utils/actor";
import BigNumber from "bignumber.js";

interface Props {}

function RemoveIdentity(props: Props) {
  const {} = props;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const removeUser = target.querySelector("#removeUser") as HTMLInputElement;

    actor.remove(BigInt(removeUser.value));

    return false;
  };

  return (
    <form onSubmit={handleSubmit} data-testid="removeForm">
      <h2>Remove an Identity</h2>
      <label htmlFor="removeUser">
        User (expects a number)
        <input type="text" name="removeUser" id="removeUser" required />
      </label>

      <button type="submit" id="remove-identity">
        Remove Identity
      </button>
    </form>
  );
}

export default RemoveIdentity;
