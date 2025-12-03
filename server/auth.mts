import type { Express, Request } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Memorystore from "memorystore";
import { storage } from "./storage.mts";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";

type UserShape = Awaited<ReturnType<typeof storage.getUser>>;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, original] = stored.split(":");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(original, "hex"));
}

export function setupAuth(app: Express) {
  const MemoryStore = Memorystore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "resume-guru-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 }),
    }),
  );

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) return done(null, false);
        const ok = verifyPassword(password, user.password);
        if (!ok) return done(null, false);
        return done(null, user);
      } catch (e) {
        return done(e as Error);
      }
    }),
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || null);
    } catch (e) {
      done(e as Error);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
}

export function registerAuthRoutes(app: Express) {
  app.get("/api/auth/me", (req, res) => {
    const u = req.user as any;
    if (!u) return res.json(null);
    res.json({ id: u.id, username: u.username, accountTier: u.accountTier || "free" });
  });
  app.post("/api/billing/upgrade", async (req, res) => {
    const u = req.user as any;
    if (!u) return res.status(401).json({ error: "Unauthorized" });
    try {
      const updated = await storage.updateUser(u.id, { accountTier: "premium" });
      if (!updated) return res.status(404).json({ error: "User not found" });
      req.login(updated, (err) => {
        if (err) return res.status(500).json({ error: "Session refresh failed" });
        res.json({ success: true, accountTier: updated.accountTier });
      });
    } catch (e) {
      res.status(500).json({ error: "Upgrade failed" });
    }
  });
  app.post("/api/auth/register", async (req, res) => {
    const { username, password, email } = req.body || {};
    if (!username || !password || !email) return res.status(400).json({ error: "Missing credentials" });
    const existing = await storage.getUserByUsername(username);
    if (existing) return res.status(409).json({ error: "User exists" });
    const user = await storage.createUser({ username, password: hashPassword(password), email });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      res.json({ id: user.id, username: user.username });
    });
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await storage.getUserByUsername(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = randomBytes(20).toString('hex');
    const passwordResetToken = createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await storage.updateUser(user.id, {
      passwordResetToken,
      passwordResetExpires,
    });

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    console.log('Password reset URL:', resetUrl); // In a real app, you would email this

    res.json({ message: 'Password reset link sent' });
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    const { token, password } = req.body;
    const passwordResetToken = createHash('sha256').update(token).digest('hex');

    const user = await storage.getUserByPasswordResetToken(passwordResetToken);

    if (!user || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    const hashedPassword = hashPassword(password);
    await storage.updateUser(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      res.json({ id: user.id, username: user.username });
    });
  });


  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const u = req.user as any;
    res.json({ id: u.id, username: u.username });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });
}

export function requireAuth(req: Request, res: any, next: any) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

export const authUtils = { hashPassword, verifyPassword };
