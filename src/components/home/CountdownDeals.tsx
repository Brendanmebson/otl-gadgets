import { useEffect, useState } from 'react'
import { Container, Box, Typography, Stack, Grid, Button, Chip } from '@mui/material'
import { Link } from 'react-router-dom'
import { Timer, ArrowRight, Flame } from 'lucide-react'
import { colors } from '@/theme/theme'

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { diff, days, hours, minutes, seconds }
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: { xs: 52, sm: 64 } }}>
      <Box
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 2.5,
          py: 1.25,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Typography variant="h4" sx={{ color: colors.white, fontWeight: 800, fontFamily: 'monospace', fontSize: { xs: 24, sm: 34 } }}>
          {String(value).padStart(2, '0')}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: colors.grey[400], fontWeight: 700, mt: 0.75, display: 'block', fontSize: 10, letterSpacing: '0.05em' }}>
        {label}
      </Typography>
    </Box>
  )
}

export default function CountdownDeals({ endsAt }: { endsAt?: Date }) {
  const target = (endsAt ?? new Date(Date.now() + 1000 * 60 * 60 * 33)).getTime()
  const [time, setTime] = useState(() => getTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <Box
      sx={{
        bgcolor: colors.black,
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(circle at 10% 50%, rgba(227, 28, 37, 0.18) 0%, transparent 60%), ${colors.black}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                icon={<Flame size={15} color={colors.red} />}
                label="LIMITED TIME OFFERS"
                size="small"
                sx={{
                  bgcolor: 'rgba(227, 28, 37, 0.18)',
                  color: colors.red,
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  borderRadius: 2,
                }}
              />
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.red, animation: 'pulse 1.5s infinite' }} />
                <Typography variant="caption" sx={{ color: colors.grey[400], fontWeight: 700 }}>
                  Live Stock Countdown
                </Typography>
              </Stack>
            </Stack>

            <Typography variant="h3" sx={{ color: colors.white, fontWeight: 800, mb: 1.5, lineHeight: 1.15 }}>
              GADGET DEALS OF THE WEEK
            </Typography>
            <Typography variant="body1" sx={{ color: colors.grey[400], mb: 4, maxWidth: 500 }}>
              Exclusive price cuts on iPhones, MacBooks, and audio gear. Grab yours before time runs out.
            </Typography>

            {time.diff > 0 ? (
              <Stack direction="row" spacing={1.5}>
                <TimeBox value={time.days} label="DAYS" />
                <TimeBox value={time.hours} label="HOURS" />
                <TimeBox value={time.minutes} label="MINUTES" />
                <TimeBox value={time.seconds} label="SECONDS" />
              </Stack>
            ) : (
              <Typography variant="h5" sx={{ color: colors.red, fontWeight: 800 }}>
                Deal ended! Stay tuned for next drop.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={5} textAlign={{ xs: 'left', md: 'right' }}>
            <Button
              component={Link}
              to="/shop?deals=1"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Timer size={20} />}
              endIcon={<ArrowRight size={20} />}
              sx={{ py: 1.75, px: 4, fontSize: 16 }}
            >
              SHOP ALL FLASH DEALS
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

