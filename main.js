const electron = require('electron')
const menubar = require('menubar')


const mb = menubar({
  'always-on-top': process.env.NODE_ENV === 'development',
  transparent: true,
  dir: './',
  preloadWindow: true,
  height: 650,
  width: 320
});


if (process.env.NODE_ENV === 'development') {
  /*
   * Open dev tools after window is shown
   */

  mb.on('after-show', () => {
    mb.window.openDevTools({ detach: true });
  });
}


/*
 * Notify app when shown
 */

mb.on('after-show', () => {
  if (mb.window) {
    mb.window.webContents.send('app.after-show');
  }
});


/*
 * Log when the app is ready.
 */

mb.on('ready', () => {
  console.log('app is ready')
  mb.showWindow()
});
