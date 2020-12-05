const adminEmails = [
  'aaron.gong@sneakertrader.com',
  'aaron_gong127@hotmail.com',
  '0alexzhong0@gmail.com',
  'alex.zhong@sneakertrader.com',
  'aaron.gong@datawater.tech',
  'a.gong.programmer@gmail.com',
];

const isAdminUser = (email: string) => adminEmails.includes(email);

export default isAdminUser;
