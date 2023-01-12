import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatIcon from '@mui/icons-material/Chat';

import { Link } from 'react-router-dom';


export default function Sidebar() {
    const [state, setState] = React.useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 , marginTop: "30px"}}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <Link to="/dashboard/add-friend" style={{color: "rgba(0, 0, 0, 0.87)"}}>
                    <ListItem disablePadding>
                        <ListItemButton>
                                <ListItemIcon>
                                    <GroupAddIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Add Friend" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Divider />

                <Link to="/dashboard/my-friend" style={{color: "rgba(0, 0, 0, 0.87)"}}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <PeopleAltIcon/>
                        </ListItemIcon>
                        <ListItemText primary="My Friends" />
                    </ListItemButton>
                </ListItem>
                </Link>
                <Divider />

                <Link to="/dashboard/inbox" style={{color: "rgba(0, 0, 0, 0.87)"}}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ChatIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItemButton>
                </ListItem>
                </Link>
                <Divider />
            </List>
        </Box>
    );

    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>
                        <MenuIcon style={{color: "white"}}/>
                    </Button>
                    <Drawer
                        anchor="left"
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}