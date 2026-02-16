import { config } from 'dotenv'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@/infra/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash, compare } from 'bcrypt'
import { customSession } from 'better-auth/plugins'
config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({
  adapter,
})

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        return hash(password, 8)
      },
      verify: async (data: { password: string; hash: string }) => {
        return compare(data.password, data.hash)
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    database: {
      generateId: 'uuid',
    },
    useSecureCookies: false,
    cookies: {
      session_token: {
        name: 'session_token',
        attributes: {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        },
      },
    },
  },

  plugins: [
    customSession(async ({ user, session }) => {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
        },
      })

      return {
        user: {
          ...user,
          subscriptionActive: subscription?.active ?? false,
        },
        session,
      }
    }),
  ],
})

export type AuthSession = typeof auth.$Infer.Session

export type AuthUser = typeof auth.$Infer.Session.user
