import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import CodeIcon from '@mui/icons-material/Code';

import { Link } from "react-router-dom";

const pages = [
  { name: "Home", path: "/" },
  { name: "Login", path: "/login" },
  { name: "Signup", path: "/signup" },
  { name: "Sheets", path: "/sheets"},
];

const settings = [
  { name: "Dashboard", path: "/profile" },
  { name: "Logout", path: "/logout" },
];

export default function ResponsiveAppBar() {

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (

    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(90deg, #141E30 0%, #243B55 100%)",

        boxShadow:
          "0 4px 20px rgba(0,0,0,0.4)",

        borderBottom:
          "1px solid rgba(255,255,255,0.1)"
      }}
    >

      <Container maxWidth="xl">

        <Toolbar
          disableGutters
          sx={{
            px: 2
          }}
        >

          {/* Desktop Logo */}

          <CodeIcon
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              color: "#00E5FF"
            }}
          />

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 4,

              display: { xs: 'none', md: 'flex' },

              fontFamily: 'Poppins',

              fontWeight: 700,

              letterSpacing: '.15rem',

              color: '#00E5FF',

              textDecoration: 'none',

              transition: '0.3s',

              '&:hover': {
                color: '#ffffff',
                transform: 'scale(1.05)',
              }
            }}
          >
            CP PLATFORM
          </Typography>

          {/* Mobile Menu */}

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' }
            }}
          >

            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >

              {pages.map((page) => (

                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                >

                  <Typography
                    sx={{
                      color: "#243B55",
                      fontWeight: "bold"
                    }}
                  >
                    {page.name}
                  </Typography>

                </MenuItem>

              ))}

            </Menu>

          </Box>

          {/* Mobile Logo */}

          <CodeIcon
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 1,
              color: "#00E5FF"
            }}
          />

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,

              display: { xs: 'flex', md: 'none' },

              flexGrow: 1,

              fontFamily: 'Poppins',

              fontWeight: 700,

              letterSpacing: '.15rem',

              color: '#00E5FF',

              textDecoration: 'none',
            }}
          >
            CP
          </Typography>

          {/* Desktop Menu */}

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' }
            }}
          >

            {pages.map((page) => (

              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  mx: 1,

                  color: 'white',

                  display: 'block',

                  borderRadius: "10px",

                  px: 2,

                  transition: "0.3s",

                  '&:hover': {

                    backgroundColor:
                      "rgba(255,255,255,0.12)",

                    color: "#00E5FF",

                    transform: "translateY(-2px)"
                  }
                }}
              >
                {page.name}
              </Button>

            ))}

          </Box>

          {/* Avatar Menu */}

          <Box sx={{ flexGrow: 0 }}>

            <Tooltip title="Open settings">

              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >

                <Avatar
                  sx={{
                    bgcolor: "#00E5FF",
                    color: "#111",
                    fontWeight: "bold"
                  }}
                >
                  P
                </Avatar>

              </IconButton>

            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              {settings.map((setting) => (

                <MenuItem
                  key={setting.name}
                  component={Link}
                  to={setting.path}
                  onClick={handleCloseUserMenu}
                >

                  <Typography>
                    {setting.name}
                  </Typography>

                </MenuItem>

              ))}

            </Menu>

          </Box>

        </Toolbar>

      </Container>

    </AppBar>
  );
}