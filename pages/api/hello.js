// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({error: 'Unauthorized'})
    return
  }

  res.status(200).json({name: 'John Does'})
}

