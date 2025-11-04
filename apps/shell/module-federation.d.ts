type RemoteComponent = import('react').ComponentType<unknown>;

declare module 'dashboards/Module' {
  const Remote: RemoteComponent;
  export default Remote;
}

declare module 'reports/Module' {
  const Remote: RemoteComponent;
  export default Remote;
}

declare module 'settings/Module' {
  const Remote: RemoteComponent;
  export default Remote;
}
