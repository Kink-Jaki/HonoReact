import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => {
    return (
      <div>
        <h2>My App</h2>
        <hr />
        <Outlet />
      </div>
    )
  },
})