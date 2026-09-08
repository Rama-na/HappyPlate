# Motion primitives

These are hand-built equivalents of the React Bits components named in the
brief — `BlurText`, `SplitText`, `ScrollReveal`, `AnimatedContent` — kept to the
same component names and prop shapes.

**Why they aren't the real thing:** this project was built in an environment
whose egress proxy blocks `reactbits.dev` (403 on the registry), so
`npx jsrepo add https://reactbits.dev/...` and the shadcn-style registry fetch
both fail. Rather than guess at the library's internals, each component here is
implemented directly on GSAP with the documented public props.

To swap in the genuine components later, install them from the React Bits
registry into this folder and delete the matching file — the call sites in
`src/components/*` use the same props and should keep working.
