// middleware.ts

import { NextApiRequest, NextApiResponse } from 'next';

interface CustomNextApiRequest extends NextApiRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const middleware = async ({ req, res, next }: { req: CustomNextApiRequest, res: NextApiResponse, next: (arg0?: any) => any }) => {
  const session = req.session;

  if (!session) {
    return res.status(401).json({ mensagem: 'Acesso negado: usuário não autenticado' });
  }

  const isAdmin = session.user.email === 'lindineisales4@gmail.com';

  if (isAdmin) {
    // If the user is an admin, redirect to /Adm
    return res.redirect(302, '/Adm');
  } else {
    // If the user is not an admin, redirect to /
    return res.redirect(302, '/');
  }

  // This line won't be reached due to the redirects above, but it's here for completeness
  return next();
};

export default middleware;