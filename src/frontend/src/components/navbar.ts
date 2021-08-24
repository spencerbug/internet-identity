import { html } from "lit-html";
import { aboutLink } from "../components/aboutLink";
import { faqLink } from "../components/faqLink";

export const navbar = html`<div id="navbar" class="text-center text-gray-400 text-sm p-3">
  ${aboutLink} &middot; ${faqLink}
</div>`;
