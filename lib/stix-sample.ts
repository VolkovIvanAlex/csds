// Sample STIX 2.1 data for demonstration purposes
export const stixSamples = {
  // Phishing campaign indicator
  phishingIndicator: {
    type: "indicator",
    spec_version: "2.1",
    id: "indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f",
    created: "2023-06-15T10:30:00.000Z",
    modified: "2023-06-15T10:30:00.000Z",
    name: "Phishing Campaign Indicator",
    description: "Email from spoofed domain with malicious attachment",
    indicator_types: ["malicious-activity"],
    pattern:
      "[email-message:sender_ref.value = 'cfo-name@company-spoofed.com' AND email-message:subject = 'Urgent: Financial Review Required']",
    pattern_type: "stix",
    valid_from: "2023-06-15T00:00:00Z",
  },

  // Malware report
  malwareReport: {
    type: "malware",
    spec_version: "2.1",
    id: "malware--31b940d4-6f7f-459a-80ea-9c1f17b58abc",
    created: "2023-06-12T09:15:00.000Z",
    modified: "2023-06-12T09:15:00.000Z",
    name: "FinancialDataStealer",
    description: "Malware targeting financial data on workstations",
    malware_types: ["trojan", "backdoor"],
    is_family: false,
    capabilities: ["data-theft", "persistence"],
    operating_system_refs: ["windows"],
  },

  // Threat actor
  threatActor: {
    type: "threat-actor",
    spec_version: "2.1",
    id: "threat-actor--56f3f0db-b5d5-431c-ae56-c18f02caf500",
    created: "2023-06-10T16:20:00.000Z",
    modified: "2023-06-10T16:20:00.000Z",
    name: "APT Financial Group",
    description: "Threat actor targeting financial institutions",
    threat_actor_types: ["crime-syndicate", "hacker"],
    aliases: ["FinGroup", "MoneyTakers"],
    roles: ["agent"],
    goals: ["financial-gain", "information-theft"],
    sophistication: "advanced",
    resource_level: "organization",
    primary_motivation: "financial-gain",
  },

  // Ransomware attack
  ransomwareAttack: {
    type: "attack-pattern",
    spec_version: "2.1",
    id: "attack-pattern--d7b066aa-4091-4276-a142-29d5d81c0aa3",
    created: "2023-06-08T11:05:00.000Z",
    modified: "2023-06-08T11:05:00.000Z",
    name: "Ransomware Attack on HR System",
    description: "Ransomware attack targeting HR systems with sensitive employee data",
    kill_chain_phases: [
      {
        kill_chain_name: "lockheed-martin-cyber-kill-chain",
        phase_name: "installation",
      },
      {
        kill_chain_name: "lockheed-martin-cyber-kill-chain",
        phase_name: "command-and-control",
      },
      {
        kill_chain_name: "lockheed-martin-cyber-kill-chain",
        phase_name: "actions-on-objectives",
      },
    ],
  },

  // Insider threat
  insiderThreat: {
    type: "identity",
    spec_version: "2.1",
    id: "identity--733c5838-34d9-4fbf-949c-62aba761184c",
    created: "2023-06-05T13:40:00.000Z",
    modified: "2023-06-05T13:40:00.000Z",
    name: "Insider Threat Actor",
    description: "Former employee with unauthorized access to systems",
    identity_class: "individual",
    sectors: ["technology"],
    contact_information: "Unknown",
  },

  // DDoS attack
  ddosAttack: {
    type: "observed-data",
    spec_version: "2.1",
    id: "observed-data--b67d30ff-02ac-498a-92f9-32f845f448cf",
    created: "2023-06-03T08:55:00.000Z",
    modified: "2023-06-03T08:55:00.000Z",
    first_observed: "2023-06-03T08:00:00Z",
    last_observed: "2023-06-03T08:45:00Z",
    number_observed: 1,
    objects: {
      "0": {
        type: "ipv4-addr",
        value: "198.51.100.1",
      },
      "1": {
        type: "network-traffic",
        src_ref: "0",
        dst_ref: "2",
        protocols: ["tcp"],
        src_port: 31337,
        dst_port: 80,
      },
      "2": {
        type: "ipv4-addr",
        value: "203.0.113.1",
      },
    },
  },
}
