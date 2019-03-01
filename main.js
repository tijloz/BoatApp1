const electron = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport')
const { app, BrowserWindow, ipcMain } = electron;
const os = require('os');
const osPlatform = os.platform();

const port = new SerialPort(osSwap(), {
    baudRate: 9200
})


function osSwap() {
    switch (osPlatform) {
        case 'win32':
            return 'com3';
            break;
        case 'linux':
            return '/dev/tty-usbserial1';
    }
}

// function osSwap(){
//     if (osPlatform === 'win32') {
//         return 'com3';
//     } else if (osPlatform === 'linux') {
//         return '/dev/tty-usbserial1';
//     }
// }


// SET ENV
process.env.NODE_ENV = 'production';



// Listen for app to be ready
app.on('ready', function () {



    
    /*      Create the main window      */
    let mainWindow = new BrowserWindow({
        show: false,
        frame: false,
        //kiosk: true,
        //alwaysOnTop: true       
    });

    //mainWindow.webContents.openDevTools()

    // Stop visual flagit add sh
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
        //kiosk: true,
        //alwaysOnTop: true
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