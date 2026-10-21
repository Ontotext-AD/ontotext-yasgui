# Stencil component conventions

Rules for `ontotext-yasgui-web-component` (Stencil 2). The how-it-works reference is the
[developers guide](../../ontotext-yasgui-web-component/docs/developers-guide.md).

## Contents

- [Components](#components): `.tsx`, `@Prop`/`@State`, `@Watch`, rendering.
- [Public methods](#public-methods): `@Method`, its JSDoc and the generated readme.
- [Services](#services): plain classes created by `ServiceFactory`.
- [Events](#events): internal events vs. events for the client.

## Components

- Implement components in `.tsx` files with a JSX `render()` method.
- Use `@Prop()` for inputs and `@State()` for reactive internal state.
- `@Watch()` doesn't fire on the initial load. If the handler must run at startup too, call it from
  `componentDidLoad()`.
- Render from state: change `@State` or the model and let Stencil re-render. Never add a dummy state field to force
  a render.
- Build markup with JSX. Never assemble HTML by string concatenation; `innerHTML` is only for sanitized content
  (`dompurify`) and static SVG.
- Name an event handler `on<Event>` (`onClick`, `onKeyDown`) and make it a class method.
- Every interactive element has an accessible name (`aria-label` or visible text), translated.
- Scaffold a new component with `npm run generate` inside `ontotext-yasgui-web-component`.

## Public methods

A `@Method()` of `ontotext-yasgui` is public API: clients call it on the element (`ontoElement.setQuery(...)`).

- Document every `@Method` with JSDoc ([jsdoc](jsdoc.md)): what it does, each `@param`, `@returns`, and an `@example`
  when the call isn't obvious.
- The `## Methods` section of `src/components/ontotext-yasgui-web-component/readme.md` is generated from that JSDoc
  by `npm run build` (`stencil build --docs`). Rebuild after adding or changing a method and commit the regenerated
  readme with it.
- A `@Method` returns a `Promise`, as Stencil requires for public methods.

## Services

- A service is a plain class. Get it with `serviceFactory.get(ServiceClass)`, never `new`.
- A service that needs another service takes `ServiceFactory` as its only constructor parameter.
- Reach YASGUI, YASQE and YASR through their services in `src/services/{yasgui,yasqe,yasr}`, not through globals.

## Events

- An event that never leaves the component is internal: its name starts with `internal`
  (`InternalCreateSavedQueryEvent`). Services emit it through `EventService`, not a Stencil `EventEmitter`.
- An event for the client goes through the `output` emitter as an `OutputEvent` subclass, with a unique `TYPE` and a
  `payload`. Add a dedicated `@Event()` emitter only when an existing one requires it.
- Document every client event in the README: when it fires, its payload, and what the client must respond with.
