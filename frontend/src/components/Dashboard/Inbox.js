import React from 'react';
import Box from '@mui/material/Box';
import UserChatlist from './UserChatlist';

const Inbox = () => {
    return (
        <div>
            <div className="App">
                <header className="App-header">
                    <div>
                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <UserChatlist/>
                        </Box>
                    </div>
                </header>
            </div>
        </div>
    )
}

export default Inbox