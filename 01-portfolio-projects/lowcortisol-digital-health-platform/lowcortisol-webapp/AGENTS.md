# LowCortisol Webapp Rules

Scope: frontend only. Do not use this file for backend rules.

- Stack: Vue 3 + JavaScript + Vite.
- Use Composition API and `script setup` for Vue components.
- Keep code organized by bounded context under `src/app/<context>/`.
- Preserve the layer structure:
  `domain`, `application`, `infrastructure`, `presentation`.
- Domain contains entities and policies, with no Vue, Router or HTTP imports.
- Application coordinates use cases through Facades and Stores.
- Infrastructure owns API services, endpoints, resources, responses and
  assemblers.
- Presentation owns pages, components, modals and routes.
- Presentation must not call HTTP clients directly.
- Do not create new DTOs; prefer Commands, Resources, Responses and Assemblers.
- Keep i18n aligned across ES/EN/PT in `public/assets/i18n`.
- Reuse shared UI before adding one-off controls.
- Modals, empty states, loading states, status badges and buttons must be
  visually and behaviorally consistent.
- Do not place mock data inside components.
- Preserve existing routes and contracts unless explicitly told otherwise.
- Verify frontend changes with:

```powershell
npm run build
```

For detailed frontend architecture, read `../docs/architecture-guidelines.md`.
