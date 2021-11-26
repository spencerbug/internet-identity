import { html, render } from "lit-html";
import { displayUserNumber } from "./displayUserNumber";
import { setUserNumber } from "../utils/userNumber";
import { apiResultToLoginResult, LoginResult } from "./loginUnknown";
import { ProofOfWork } from "../../generated/internet_identity_types";
import { WebAuthnIdentity } from "@dfinity/identity";
import getProofOfWork from "../crypto/pow";
import { Principal } from "@dfinity/principal";
import { withLoader } from "../components/loader";
import {
  IIConnection,
  canisterIdPrincipal,
  ChallengeResult,
} from "../utils/iiConnection";

const pageContent = html`
  <div class="container">
    <h1>Confirm new device</h1>
    <form id="confirmForm">
      <p class="captcha-status-text">…</p>
      <img id="captchaImg" />
      <input id="captchaInput" />
      <p>Please confirm to add your device.</p>
      <button type="submit" class="primary" id="confirmRegisterButton" disabled>
        Confirm
      </button>
      <button type="button" id="cancelButton">Cancel</button>
    </form>
  </div>
`;

export const confirmRegister = (
  identity: WebAuthnIdentity,
  alias: string
): Promise<LoginResult | null> => {
  const container = document.getElementById("pageContent") as HTMLElement;
  render(pageContent, container);
  return init(canisterIdPrincipal, identity, alias);
};

const tryRegister = (
  identity: WebAuthnIdentity,
  alias: string,
  challengeResult: ChallengeResult,
  func: (result: LoginResult) => void
) => {
  withLoader(async () => {
    return IIConnection.register(identity, alias, challengeResult);
  }).then((result) => {
    if (result.kind == "loginSuccess") {
      // Write user number to storage
      setUserNumber(result.userNumber);

      // Congratulate user
      displayUserNumber(result.userNumber).then(() => {
        func(apiResultToLoginResult(result));
      });
    } else {
      // TODO; here add "badCaptcha". If we see anything else, return result.
      // TODO: should we only get here on specific result.kind? like badCaptcha?
      const captchaStatusText = document.querySelector(
        ".captcha-status-text"
      ) as HTMLElement;
      captchaStatusText.innerHTML = "Something didn't work, please retry";
      requestCaptcha();
    }
  });
};

// Request a captcha and, when received, update the DOM elements accordingly.
const requestCaptcha = (): void => {
  const form = document.getElementById("confirmForm") as HTMLFormElement;
  const captchaStatusText = document.querySelector(
    ".captcha-status-text"
  ) as HTMLElement;
  captchaStatusText.innerHTML = "Creating CAPTCHA challenge…";

  // Wrap this in a promise to avoid slowing things down
  const makePow: Promise<ProofOfWork> = new Promise((resolve) => {
    const now_in_ns = BigInt(Date.now()) * BigInt(1000000);
    const pow = getProofOfWork(now_in_ns, canisterIdPrincipal);
    resolve(pow);
  });

  makePow
    .then((pow) => IIConnection.createChallenge(pow))
    .then((captchaResp) => {
      const captchaImg = document.querySelector("#captchaImg");
      if (captchaImg) {
        captchaImg.setAttribute(
          "src",
          `data:image/png;base64, ${captchaResp.png_base64}`
        );
        const confirmRegisterButton = form.querySelector(
          "#confirmRegisterButton"
        ) as HTMLFormElement;
        confirmRegisterButton.setAttribute(
          "data-captcha-key",
          `${captchaResp.challenge_key}`
        );
        captchaStatusText.innerHTML = "Please type in the characters you see.";
        confirmRegisterButton.disabled = false;
      }
    });
};

const init = (
  canisterIdPrincipal: Principal,
  identity: WebAuthnIdentity,
  alias: string
): Promise<LoginResult | null> => {
  requestCaptcha();

  // since the index expects to regain control we unfortunately have to wrap
  // this whole logic in a promise that then resolves (giving control back to
  // the caller)
  return new Promise((resolve) => {
    const confirmRegisterButton = document.querySelector(
      "#confirmRegisterButton"
    ) as HTMLFormElement;
    const captchaInput = document.querySelector(
      "#captchaInput"
    ) as HTMLFormElement;
    const cancelButton = document.querySelector(
      "#cancelButton"
    ) as HTMLButtonElement;

    cancelButton.onclick = () => {
      resolve(null);
    };

    confirmRegisterButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const captchaStatusText = document.querySelector(
        ".captcha-status-text"
      ) as HTMLElement;
      captchaStatusText.innerHTML = "Checking CAPTCHA challenge…";
      confirmRegisterButton.disabled = true;

      const captchaChars = captchaInput.value;
      const captchaKey = confirmRegisterButton.dataset.captchaKey;

      if (captchaKey === undefined) {
        console.log("Something went wrong: no captcha key found");
        requestCaptcha();
        return;
      }

      const challengeResult: ChallengeResult = {
        key: captchaKey,
        chars: captchaChars,
      };

      tryRegister(identity, alias, challengeResult, resolve);
    };
  });
};
