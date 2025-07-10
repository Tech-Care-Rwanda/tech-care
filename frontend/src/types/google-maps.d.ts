declare global {
  interface Window {
    google: typeof google;
  }
  
  const google: {
    maps: {
      Map: any;
      Marker: any;
      InfoWindow: any;
      Size: any;
      Point: any;
      Animation: {
        DROP: any;
        BOUNCE: any;
      };
      LatLng: any;
      event: {
        addListener: (instance: any, eventName: string, handler: () => void) => void;
      };
    };
  };
}

export {}; 