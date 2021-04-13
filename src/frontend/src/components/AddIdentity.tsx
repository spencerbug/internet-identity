import * as React from "react";
import actor from "../utils/actor";

interface Props {}

function AddIdentity(props: Props) {
  const {} = props;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const addUser = target.querySelector("#addUser") as HTMLInputElement;
    const addAlias = target.querySelector("#addAlias") as HTMLInputElement;

    actor.add(BigInt(addUser.value), addAlias.value);

    return false;
  };

  return (
    <form onSubmit={handleSubmit} data-testid="addForm">
      <h2>Add an identity</h2>
      <label htmlFor="addUser">
        User (expects a number)
        <input type="text" name="addUser" id="addUser" required />
      </label>
      <label htmlFor="addAlias">
        Alias (expects a string)
        <input type="text" name="addAlias" id="addAlias" required />
      </label>
      <button type="submit" id="add-identity">
        Add Identity
      </button>
    </form>
  );
}

export default AddIdentity;
