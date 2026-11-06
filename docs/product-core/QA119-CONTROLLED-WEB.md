# QA119 controlled Web delta

Parent Web #38 remains frozen at `32d6c46d86ed04aa8e757cbad1bc7b6ac214c413` (local equivalent `03361dbefdde33c843b927a5c97a2c55fa4ce399`, tree `f61c59f11f133e5cd88d61d6b425fa8c201915f9`). Coordination: Core issue #74. This child changes only the existing name label and required semantics, tests and evidence/manifests.

## QA119-3

The controlled Core form already required a non-empty name before submission and Core validates it again. Its visible label nevertheless said optional. It now displays `Tu nombre *` and sets `required` / `aria-required=true` when Core is selected. Ordinary WhatsApp mode retains its optional name. This does not change identity verification, backend authorization or required contact data.

The regression renders the actual JSX component using the existing React server-rendering / esbuild / VM test pattern. The unchanged parent fails both controlled-label and required-semantics checks, while its ordinary-mode check passes. After the two-line fix all three pass. No network, providers, consent mutation or form submission runs during this regression.

Command: `node --experimental-vm-modules --test tests/ci/controlled-name-required.test.mjs`.

## QA119-1 runner observations, not a visual PASS

No CSS or banner behavior is changed by this delta. The existing cookie banner appears after 1000 ms if `localStorage['inmejora_cookie_consent']` is absent, animates for 400 ms and occupies the bottom edge with z-index 9999. Its actual `Solo esenciales` button records `essential` and dismisses it without enabling analytics. The header remains fixed at the top, height 64 px below the md breakpoint and 72 px from md, z-index 50.

For real-build QA, set the viewport first, handle the actual cookie choice, wait for dismissal and stable element geometry, then scroll the target into the visible area between fixed elements. Verify the intended control at the click point. Useful selectors: `#consulta-nombre`, `#consulta-servicio`, `#consulta-medidas`, `[aria-label="Consulta guardada"]`, `[data-testid="project_id"]`, `[aria-label="Galería privada del proyecto"]` and the exact button name `Solo esenciales`.

`ContactoPage` has `overflow-x-hidden`; body scroll width alone can hide clipping. Screenshots and visible-control bounding boxes at 360/390/1440 remain the composition's responsibility. A test overlay or viewport race is not evidence for hiding the production header/banner. No visual approval is claimed here.

No changes to #38, Core, identity authority, pricing, bonuses, providers, A0 or infrastructure. Connected login and physical Gate0 remain BLOCKED. No merge, deploy, APPLY, installation, external sends, paid calls or production operations; C2_LIVE_PREFLIGHT=HOLD.
