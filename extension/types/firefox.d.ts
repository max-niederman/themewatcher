declare namespace browser {
  namespace runtime {
    let id: string;
    let lastError: Error | null;

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

    let onConnect: Listenable<(port: Port) => any>;
    let onConnectExternal: Listenable<(port: Port) => any>;
  }

  namespace storage {
    type StorageKeys = null | string | string[];
    type StorageValue = unknown;

    interface StorageArea {
      get(
        keys: StorageKeys | Record<string, StorageValue>
      ): Promise<Record<string, StorageValue>>;
      getBytesInUse(keys: StorageKeys): Promise<number>;
      set(keys: Record<string, StorageValue>): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }

    interface StorageChange {
      oldValue?: StorageValue;
      newValue?: StorageValue;
    }

    const enum StorageAreas {
      Sync = "sync",
      Local = "local",
      Managed = "managed",
    }

    let sync: StorageArea;
    let local: StorageArea;
    let managed: StorageArea;

    let onChanged: Listenable<
      (changes: Record<string, StorageChange>, areaName: StorageAreas) => any
    >;
  }

  namespace theme {
    type Theme = object;

    function getCurrent(windowId?: number): Theme;
    function update(theme: Theme, windowId?: number): void;
    function reset(windowId?: number): void;

    let onUpdated: Listenable<
      (updateInfo: { theme: Theme; windowId?: number }) => any
    >;
  }
}

interface Listenable<L> {
  addListener(listener: L): void;
  removeListener(listener: L): void;
  hasListener(listener: L): boolean;
}
