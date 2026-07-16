import { Navigate, Route, Routes } from 'react-router-dom'
import { HeroPage } from './pages/HeroPage'
import { RolesPage } from './pages/RolesPage'
import { RoleDetailPage } from './pages/RoleDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/roles" element={<RolesPage />} />
      <Route path="/roles/:slug" element={<RoleDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
