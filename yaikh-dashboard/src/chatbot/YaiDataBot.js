import React, { useState } from 'react';
import BotModules from './bot-modules';
import Chatbot from './bot';
import GMChat from './GMChat';
import BotVersion2 from './bot-version2';
// You would also import your DataBot component here once it's created
import DataBot from './DataBot';

const YaiDataBot = ({ moduleContext, onClose, version = 'yai1', onVersionChange }) => {
    // When clicking "Yai 1", show BotModules with 5 columns side by side
    // When clicking "Yai 2", show BotVersion2 with single chat interface
    // Users can chat with each bot independently and scroll to see more bots
    const handleClose = () => {
        onClose();
    };

    // Show BotModules (Yai 1) - multi-bot interface
    if (version === 'yai1') {
        return (
            <BotModules onClose={handleClose} moduleContext={moduleContext} onVersionChange={onVersionChange} currentVersion={version} />
        );
    }

    // Show BotVersion2 (Yai 2) - single chat interface
    return (
        <BotVersion2 onClose={handleClose} moduleContext={moduleContext} onVersionChange={onVersionChange} currentVersion={version} />
    );
};

export default YaiDataBot;