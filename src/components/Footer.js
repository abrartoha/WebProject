import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box, Toolbar } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function Footer() {
    const defaultPrimaryColor = theme => theme.palette.primary.main;
  return (
    <Box
      sx={{
        backgroundColor: "#505a74",
        color: "white",
        p: 2
      }}
      component="footer"
      justifyContent={'flex-end'}
    >
        <Typography align="center" style={{fontFamily: 'arial', fontSize: 20, fontWeight: 'bold'}}>
            Join our community
        </Typography>
        <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="large" aria-label='facebook' color="inherit">
                <FacebookIcon />
            </IconButton>
            <IconButton size="large" aria-label='instagram' color="inherit">
                <InstagramIcon />
            </IconButton>
            <IconButton size="large" aria-label='twitter' color="inherit">
                <TwitterIcon />
            </IconButton>
            <IconButton size="large" aria-label='youtube' color="inherit">
                <YouTubeIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      <Container maxWidth="sm">
        <Typography align="center" style={{fontFamily: 'arial', fontSize: 15}}>
          {"Copyright © "}
          <Link color="inherit" href="https://your-website.com/">
            DeCent
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>

    </Box>
  );
}