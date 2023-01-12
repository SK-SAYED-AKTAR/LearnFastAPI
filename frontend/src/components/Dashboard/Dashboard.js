import { useEffect } from 'react';
import Navbar from '../sub_components/Navbar';


import Card from '@mui/material/Card';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatIcon from '@mui/icons-material/Chat';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HomeIcon from '@mui/icons-material/Home';

import { useNavigate, Outlet, Link } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate("/dashboard/update-user");
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <Navbar />
            <div className="App">
                <header className="App-header">
                    <div style={{ marginTop: "30px" }}>
                        <Link to="/dashboard">
                            <Card
                                className="dashboardOptionCard"
                                component="span"
                            >
                                Home &nbsp;<HomeIcon className="optionIcons"/>
                            </Card>
                        </Link>

                        <Link to="/dashboard/update-user">
                            <Card
                                className="dashboardOptionCard"
                                component="span"
                            >
                                Update Profile &nbsp;<AssignmentIndIcon className="optionIcons"/>
                            </Card>
                        </Link>

                        <Link to="/dashboard/add-friend">
                            <Card
                                className="dashboardOptionCard"
                                component="span"
                            >
                                Explore People &nbsp;<GroupAddIcon className="optionIcons"/>
                            </Card>
                        </Link>

                        <Link to="/dashboard/my-friend">
                            <Card
                                className="dashboardOptionCard"
                                component="span"
                            >
                                My Friends &nbsp;<PeopleAltIcon className="optionIcons"/>
                            </Card>
                        </Link>

                        <Link to="/dashboard/inbox">
                            <Card
                                className="dashboardOptionCard"
                                component="span"
                            >
                                Inbox &nbsp;<ChatIcon className="optionIcons"/>
                            </Card>
                        </Link>
                        <Outlet />
                    </div>
                </header>
            </div>
        </div>
    )
}
export default Dashboard

