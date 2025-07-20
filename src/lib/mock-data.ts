import type { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    role: 'student',
    academicYear: 3,
    avatar: 'https://placehold.co/100x100',
    skills: [
      { name: 'React', rating: 5, verified: true, proof: 'https://github.com/example/project1' },
      { name: 'Node.js', rating: 4, verified: true, proof: 'https://github.com/example/project2' },
      { name: 'UI/UX Design', rating: 4, verified: false },
      { name: 'Python', rating: 3, verified: true, proof: 'https://github.com/example/project3' },
    ],
    projects: [
      { name: 'E-commerce Platform', description: 'A full-stack e-commerce site using MERN stack.', link: 'https://github.com/example/project1' },
      { name: 'Data Visualization Dashboard', description: 'A dashboard for visualizing sales data with D3.js.', link: 'https://github.com/example/project2' },
    ],
    creativeZone: [
      { type: 'portfolio', title: 'Design Portfolio', link: 'https://behance.net/alexdoe' },
      { type: 'video', title: 'Animation Reel', link: 'https://youtube.com/watch?v=example1' },
    ],
    weeklyActivity: 'This week I focused on optimizing the backend of my e-commerce project and started learning about GraphQL.'
  },
  {
    id: 2,
    name: 'Samantha Bee',
    email: 'samantha.bee@example.com',
    role: 'student',
    academicYear: 4,
    avatar: 'https://placehold.co/100x100',
    skills: [
      { name: 'Machine Learning', rating: 5, verified: true, proof: 'https://github.com/example/ml-project' },
      { name: 'TensorFlow', rating: 5, verified: true, proof: 'https://github.com/example/ml-project' },
      { name: 'Project Management', rating: 4, verified: false },
      { name: 'Public Speaking', rating: 3, verified: false },
    ],
    projects: [
      { name: 'Sentiment Analysis API', description: 'An API that classifies text sentiment using a custom-trained model.', link: 'https://github.com/example/ml-project' },
    ],
    creativeZone: [
      { type: 'social', title: 'Tech Blog on Medium', link: 'https://medium.com/@samanthabee' },
    ],
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'student',
    academicYear: 2,
    avatar: 'https://placehold.co/100x100',
    skills: [
      { name: 'Mobile App Development', rating: 4, verified: true, proof: 'https://github.com/example/mobile-app' },
      { name: 'Flutter', rating: 4, verified: true, proof: 'https://github.com/example/mobile-app' },
      { name: 'Firebase', rating: 3, verified: true, proof: 'https://github.com/example/mobile-app' },
    ],
    projects: [
      { name: 'Task Manager App', description: 'A cross-platform task management app built with Flutter and Firebase.', link: 'https://github.com/example/mobile-app' },
    ],
    creativeZone: [
       { type: 'portfolio', title: 'Photography portfolio', link: 'https://unsplash.com/@michaelchen' },
    ],
  },
];
