export interface Connection {
    targetId: string;
    type: string;
    details: string;
  }
  
  export interface HCP {
    id: string;
    name: string;
    education: string[];
    workExperience: string[];
    publications: string[];
    connections: Connection[];
  }
  
  export const hcpData: HCP[] = [
    {
      id: 'hcp-1',
      name: 'Dr. Jane Doe',
      education: ['MD, Harvard Medical School'],
      workExperience: ['Massachusetts General Hospital'],
      publications: ['Paper A', 'Paper B'],
      connections: [
        {
          targetId: 'hcp-2',
          type: 'Co-authorship',
          details: 'Co-authored 3 publications',
        },
      ],
    },
    {
      id: 'hcp-2',
      name: 'Dr. John Smith',
      education: ['MBBS, Oxford University'],
      workExperience: ["King's College Hospital"],
      publications: ['Paper X'],
      connections: [
        {
          targetId: 'hcp-1',
          type: 'Co-authorship',
          details: 'Co-authored 3 publications',
        },
      ],
    },
  ];