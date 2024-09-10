import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginFormPage from "./store/components/LoginFormPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { restoreUser } from "./store/session";
const Layout = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    // dispatch(restoreUser)
  }, [dispatch])

  return <>
    <Outlet />
  </>
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>hi</h1>
      },
      {
        path: '/login',
        element: <LoginFormPage />
      }
    ]
  }
])
function App() {
  return <RouterProvider router={router} />;
}

export default App;
