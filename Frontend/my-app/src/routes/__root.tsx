import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => {
    return (
      <div>
        <h2>Login & Register</h2>
        <hr />
        <Outlet />
      </div>
    )
  },
})