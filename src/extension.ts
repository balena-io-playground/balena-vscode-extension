// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as scan from './lib/scan';

import BalenaDevicesDataProvider, { BalenaDeviceItem } from './providers/balena-devices-treedata';

(async () => {
    await scan.initialized;
})();

let livepushCommand: vscode.Disposable | undefined;
let sshCommand: vscode.Disposable | undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
		
	vscode.window.registerTreeDataProvider('balenaDevices', new BalenaDevicesDataProvider());

	livepushCommand = vscode.commands.registerCommand('balena.livePush', ({ addresses }: BalenaDeviceItem) => {
		const [ address ] = addresses.filter(a => !a.includes(':'));
		if (!address) {
			return;
		}
		
		const terminal = vscode.window.createTerminal('LivePush');
		terminal.show();
		terminal.sendText(`balena push ${address}`);
	});

	sshCommand = vscode.commands.registerCommand('balena.ssh', ({ addresses }: BalenaDeviceItem) => {
		const [ address ] = addresses.filter(a => !a.includes(':'));
		if (!address) {
			return;
		}
		
		const terminal = vscode.window.createTerminal('SSH');
		terminal.show();
		terminal.sendText(`balena ssh ${address}`);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	livepushCommand?.dispose();
	sshCommand?.dispose();
}
