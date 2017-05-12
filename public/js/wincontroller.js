$(document).ready(function(){
    const app = require('electron').remote.app;
    const { remote } = require('electron');
 // Ação do Botão Fechar
    $('#btnclose').click(function(){
        console.log('Botão Fechar');
        remote.BrowserWindow.getFocusedWindow().close();
    });
// Ação do Botão Maximizar
    $('#btnmaximize').click(function(){
        console.log('Botão Maximizar');
        if(remote.BrowserWindow.getFocusedWindow().isMaximized()){
            remote.BrowserWindow.getFocusedWindow().restore();
        }
        else{
        remote.BrowserWindow.getFocusedWindow().maximize();
        }
    });
//Ação do Botão Minimizar
    $('#btnminimize').click(function(){
        console.log('Botão Minimizar');
        remote.BrowserWindow.getFocusedWindow().minimize();
    });

});