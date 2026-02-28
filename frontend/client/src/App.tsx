import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Scripts from "./pages/Scripts";
import Login from "./pages/Login";
import ProtectedRoute from "./contexts/ProtectedRoute";
import ScriptAdmin from "./pages/ScriptsAdmin";
import AdminRoute from "./contexts/AdminRoute";
import AdminUsers from "./pages/AdminUsers";
import Register from "./pages/Register";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dev/scripts">
        <ProtectedRoute>
          <ScriptAdmin />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/users">
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      </Route>

      <Route path="/">
        <ProtectedRoute>
          <Scripts />
        </ProtectedRoute>
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;