const electron = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport')
const { app, BrowserWindow, ipcMain } = electron;
const os = require('os');
const osPlatform = os.platform();
const spi = require('spi-device');

const port = new SerialPort(osSwap(), {
    baudRate: 9200
})


function osSwap() {
    switch (osPlatform) {
        case 'win32':
            return 'com3';
            break;
        case 'linux':
            return '/dev/ttyACM0';
    }
}

// The Nucleo is on bus 0 and it's device 0
const Nucleo = spi.open(0, 0, (err) => {
    // An SPI message is an array of one or more read+write transfers
    const message = [{
        sendBuffer: Buffer.from([0x01, 0xd0, 0x00]), // Sent to read channel 5
        receiveBuffer: Buffer.alloc(3),              // Raw data read from channel 5
        byteLength: 3,
        speedHz: 20000 // Use a low bus speed to get a good reading from the TMP36
    }];

    if (err) throw err;

    Nucleo.transfer(message, (err, message) => {

        // Raw value log to console
        const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) +
            message[0].receiveBuffer[2];
        const voltage = rawValue
        console.log(voltage);
    });
});

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