const electron = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport')
const port = new SerialPort('COM3', {
    baudRate: 9200
})

// SET ENV
process.env.NODE_ENV = 'development';

const { app, BrowserWindow, ipcMain } = electron;

// Set environment
process.env.NODE_ENV = 'production';

let protectionWindow;
let lightsWindow;

// Listen for app to be ready
app.on('ready', function () {
    
    /*      Create the main window      */
    let mainWindow = new BrowserWindow({
        show: false,
        frame: false,
        //kiosk: true,
        //alwaysOnTop: true       
    });

    mainWindow.webContents.openDevTools()

    // Stop visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    // Load html in window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });
    
    /*      Create the lights window      */
    let lightsWindow = new BrowserWindow({
        show: false,
        frame: false,
        kiosk: true,
        alwaysOnTop: true
    });

    // Stop visual flash
    mainWindow.hide;

    // Load html in window
    lightsWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'lightsWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
});

ipcMain.on('lightChannel', function (event, light) {
    console.log(`Light state is: ${light.lightState}`);

    if (light.lightState) {
        port.write('ON' + '\n');
    } else {
        port.write('OFF' + '\n');
    }
    
 

})