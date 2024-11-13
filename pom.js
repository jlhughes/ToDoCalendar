foam.POM({
  name: 'journal',
  vendorId: 'hughes',
  version: '1.0.0',
  projects: [
    { name: 'foam3/pom' },
    { name: 'src/hughes/pom' }
  ],
  envVars: [
    { name: 'SYSTEM_NAME', value: 'foam-journal'},
    { name: 'WEB_PORT', value: 8100 }
  ]
});
