import { sample } from 'lodash';


// ----------------------------------------------------------------------

export const users = [...Array(24)].map((_, index) => ({
  id: 1,
  avatarUrl: `src/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: "sdf",
  company: "sdfghtr",
  isVerified: true,
  status: sample(['active', 'banned']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));
