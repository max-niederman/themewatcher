declare namespace browser {
  namespace runtime {
    var id: string;
    var lastError: Error | null;

    interface Port {
      name: string;
      error?: { message: string };

      disconnect(): void;
      postMessage(message: any): void;

      onDisconnect: Listenable<(port: Port) => any>;
      onMessage: Listenable<(message: any) => any>;
    }

    function connect(
      extensionId?: string,
      connectInfo?: { name?: string; includeTlsChannelId?: boolean }
    ): Port;
    function connectNative(name: string): Port;

    var onConnect: Listenable<(port: Port) => any>;
    var onConnectExternal: Listenable<(port: Port) => any>;
  }

  namespace theme {
    type Theme = object;

    function getCurrent(windowId?: number): Theme;
    function update(theme: Theme, windowId?: number): void;
    function reset(windowId?: number): void;

    var onUpdated: Listenable<(updateInfo: { theme: Theme, windowId?: number }) => any>;
  }
}

interface Listenable<L> {
  addListener(listener: L): void;
  removeListener(listener: L): void;
  hasListener(listener: L): boolean;
}
