# LowCortisol Constitution

LowCortisol is a water and gas monitoring and operations platform. The product
must grow as a connected platform, not as isolated screens or disconnected CRUD
modules.

## Architecture

- Modular monolith.
- ASP.NET Core backend prepared for DDD, CQRS, REST, EF Core, Resources and
  Assemblers.
- Vue 3 + JavaScript + Vite frontend organized by bounded context and layer.
- Shared code is allowed only for truly cross-context concerns.
- This is not a microservices architecture and not an Event Sourcing system.

## Bounded Contexts

Use the current LowCortisol language and existing webapp structure as the source
of truth:

- Iam
- Workplace
- DeviceControl
- Monitoring
- Notification
- Plan
- Support
- Shared

Create a new bounded context only when the domain language requires independent
ownership and the change is explicitly requested.

## Non-Negotiable Rules

- Audit the existing structure before changing anything.
- Preserve public routes, endpoints, contracts and names unless explicitly told
  to change them.
- Keep business rules in domain/application layers, never in controllers or Vue
  pages.
- Do not access another bounded context repository directly.
- Use Facades, ACLs or integration events for cross-context communication.
- Do not create fake backend endpoints to satisfy frontend work.
- Do not place temporary/mock data inside presentation components.
- Do not create new DTOs; use Commands, Queries, Resources, Responses and
  Assemblers according to the layer.
- Keep UI states consistent: loading, empty, error, success, modals and buttons.
- Run the applicable build before declaring a block complete.

## Builds

Backend:

```powershell
cd lowcortisol-platform
dotnet build .\lowcortisol-platform.sln
```

Frontend:

```powershell
cd lowcortisol-webapp
npm run build
```

## Detailed Guidance

Read [docs/architecture-guidelines.md](docs/architecture-guidelines.md) before
architectural changes, new features, new bounded contexts or cross-context
integration.
