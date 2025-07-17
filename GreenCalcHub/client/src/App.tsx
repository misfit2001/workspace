import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { DashboardLayout } from "./components/DashboardLayout"
import { Dashboard } from "./pages/Dashboard"
import { SolarCalculator } from "./pages/SolarCalculator"
import { WindCalculator } from "./pages/WindCalculator"
import { HydroCalculator } from "./pages/HydroCalculator"
import { CombinedSystems } from "./pages/CombinedSystems"
import { DesalinationUnits } from "./pages/DesalinationUnits"
import { ScenarioHistory } from "./pages/ScenarioHistory"
import { ScenarioBuilder } from "./pages/ScenarioBuilder"
import { CustomTechnology } from "./pages/CustomTechnology"
import { Profile } from "./pages/Profile"
import { AdminPanel } from "./pages/AdminPanel"
import { BlankPage } from "./pages/BlankPage"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="scenario-builder" element={<ScenarioBuilder />} />
              <Route path="solar" element={<SolarCalculator />} />
              <Route path="wind" element={<WindCalculator />} />
              <Route path="hydro" element={<HydroCalculator />} />
              <Route path="combined" element={<CombinedSystems />} />
              <Route path="desalination" element={<DesalinationUnits />} />
              <Route path="history" element={<ScenarioHistory />} />
              <Route path="technology" element={<CustomTechnology />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
            <Route path="*" element={<BlankPage />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App