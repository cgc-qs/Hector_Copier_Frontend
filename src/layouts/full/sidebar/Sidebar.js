import { useMediaQuery, Box, Drawer } from '@mui/material';
import Logo from '../shared/logo/Logo';
import SidebarItems from './SidebarItems';
// import { Upgrade } from './Updrade';
import bgImage from "src/assets/images/backgrounds/sidebar-2.jpg";

const Sidebar = (props) => {

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const sidebarWidth = '270px';

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: 'border-box',
            },
          }}
         
        >
                    
          <Box
            sx={{
              height: '100%',
            }}
            style={{ 
              backgroundImage: "url(" + bgImage + ")" ,
              position: "absolute",
              zIndex: "1",
              height: "100%",
              width: "100%",
              display: "block",
              top: "0",
              left: "0",
              backgroundSize: "cover",
              backgroundPosition: "center center",                     
              "&:after": {
                position: "absolute",
                zIndex: "3",
                width: "100%",
                height: "100%",
                content: '""',
                display: "block",
                background: "#000",
                opacity: ".8",
            },}}
          >
          
            <Box px={3}>
              <Logo />
            </Box>
            <Box>             
              <SidebarItems />             
            </Box>
            
          </Box>

         
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
      {/* <Upgrade /> */}
    </Drawer>
  );
};

export default Sidebar;
