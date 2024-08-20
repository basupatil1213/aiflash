'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { Box, CircularProgress, Container, Typography } from "@mui/material"

const ResultPage= ()=>{
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        const fetchCheckoutSession = async()=> {
            if(!session_id) return

            try{
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok){
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError('Error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutSession()

    }, [session_id])

    if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
    }
    
    if (error) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        )
    }

      return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          {session.payment_status === 'paid' ? (
            <>
              <Typography variant="h4">Thank you for your purchase!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="h6">Session ID: {session_id}</Typography>
                <Typography variant="body1">
                  Payment Successful!
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4">Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again.
                </Typography>
              </Box>
            </>
          )}
        </Container>
      )
}

export default ResultPage