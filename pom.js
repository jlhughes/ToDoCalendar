foam.POM({
  name: 'hughes_journal',
  vendorId: 'hughes',
  version: '1.0.0',
  projects: [
    { name: 'foam3/pom' },
    { name: 'src/hughes/pom' }
  ],
  java: 21,
  envVars: [
    { name: 'WEB_PORT', value: 8100 }
  ],
  setFlags: {
    u3: false
  },
});
