
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <AppBar position="sticky" sx={{ top: 0, background: "white", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" color="text.primary" >
            Sample Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Box display="flex" flex={1} sx={{ background: "#f5f5f5" }} >
        <Dashboard />
      </Box>

    </Box>
  );
}

export default App;
