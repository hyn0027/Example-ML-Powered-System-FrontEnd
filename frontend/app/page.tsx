import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '@/components/Copyright';
import Test from '@/components/Pipeline';

export default function Home() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" >
                    AEYE-DS - Example ML-Powered System
                </Typography>
                <Test />
                <Copyright />
            </Box>
        </Container>
    );
}
