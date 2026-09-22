import { Container } from '@mui/material'
import EmptyState from '@/components/common/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <EmptyState
        title="Page not found"
        subtitle="The page you're looking for doesn't exist or has moved."
        actionLabel="Back to Home"
        onAction={() => navigate('/')}
      />
    </Container>
  )
}
