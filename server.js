const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const {
  getJobDescription,
  getLearningResource,
  getAllJobRoles,
  getSkillQuestions,
  getJobSkills
} = require("./src/data/skills");

const { User, Analysis, PasswordReset } = require("./src/db/models");

dotenv.config();

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Promise-based MongoDB connection
async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/resume_analyzer";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error.message);
    // Allow server to start even if MongoDB fails for development
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
}

const app = express();

// Cloudinary Storage for multipart uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resume_analyzer",
    resource_type: "auto",
    allowed_formats: ["pdf"]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
});

// Fallback to memory storage if Cloudinary is not configured (for development)
let uploadHandler = upload;
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                process.env.CLOUDINARY_API_KEY && 
                                process.env.CLOUDINARY_API_SECRET;

if (!isCloudinaryConfigured) {
  console.warn("⚠️ Cloudinary not configured. Using memory storage (not recommended for production)");
  uploadHandler = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
  });
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || process.env.MAIL_SERVER;
  const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.MAIL_USERNAME;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASSWORD;
  const secureRaw = process.env.SMTP_SECURE || process.env.MAIL_USE_SSL || "false";
  const secure = ["true", "1", "yes"].includes(String(secureRaw).toLowerCase()) || port === 465;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass }
  };
}

async function sendResetEmail(to, otpCode) {
  let smtpConfig = getSmtpConfig();
  let transporter;
  let fromAddress;

  if (smtpConfig) {
    transporter = nodemailer.createTransport(smtpConfig);
    fromAddress = process.env.FROM_EMAIL || process.env.SMTP_FROM || smtpConfig.auth.user;
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      smtpConfig = {
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      };
      transporter = nodemailer.createTransport(smtpConfig);
      fromAddress = process.env.FROM_EMAIL || `Resume Analyzer <${testAccount.user}>`;
    } catch {
      return { sent: false, reason: "smtp_not_configured" };
    }
  }

  const appBaseUrl = process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
  const resetUrl = `${appBaseUrl.replace(/\/$/, "")}/reset-password?email=${encodeURIComponent(to)}`;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "Resume Analyzer — Password Reset OTP",
    text: `Your password reset OTP is: ${otpCode}\nThis OTP expires in 60 minutes.\nOpen: ${resetUrl}`,
    html: `<p>Your password reset OTP is: <b>${otpCode}</b></p><p>This OTP expires in 60 minutes.</p><p><a href="${resetUrl}">Open Reset Page</a></p>`
  });

  const preview = nodemailer.getTestMessageUrl(info) || null;
  return { sent: true, preview };
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB-backed session store
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/resume_analyzer";
const sessionStore = new MongoStore({
  mongoUrl: mongoUri,
  touchAfter: 24 * 3600 // Lazy session update (24 hours)
});

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.RESUME_ANALYZER_SECRET || "dev-secret-change-me",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));


app.use("/static", express.static(path.join(__dirname, "static")));

const njkEnv = nunjucks.configure(path.join(__dirname, "templates"), {
  autoescape: true,
  express: app
});

njkEnv.addGlobal("url_for", function urlFor(routeName, kwargs) {
  if (routeName === "static" && kwargs && kwargs.filename) {
    return `/static/${kwargs.filename}`;
  }
  return "/";
});

function allowedFile(filename) {
  return filename && filename.toLowerCase().endsWith(".pdf");
}

function cleanText(text) {
  if (!text) return "";
  const squashed = text.replace(/\s+/g, " ").trim();
  return squashed.replace(/[^\w\s@.\-+,#:\/]/g, "");
}

function getContactInfo(text) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phonePatterns = [
    /\+1\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
    /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
    /\+\d{1,3}\s?\d{4,14}/
  ];

  let phone = null;
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      phone = match[0];
      break;
    }
  }

  return {
    email: emailMatch ? emailMatch[0] : null,
    phone
  };
}

function extractSkillsFromText(text, jobRole) {
  const job = getJobSkills(jobRole);
  if (!job.technical || !job.soft) return [];
  const allSkills = [...job.technical, ...job.soft];
  const textLower = text.toLowerCase();

  return allSkills.filter((skill) => {
    const escaped = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    return regex.test(textLower);
  });
}

function analyzeSkillMatch(detectedSkills, jobRole) {
  const job = getJobSkills(jobRole);
  const required = [...(job.technical || []), ...(job.soft || [])];
  if (!required.length) {
    return {
      matched: [],
      missing: [],
      match_percentage: 0,
      matched_count: 0,
      required_count: 0
    };
  }

  const detectedSet = new Set(detectedSkills);
  const requiredSet = new Set(required);
  const matched = [...requiredSet].filter((skill) => detectedSet.has(skill)).sort();
  const missing = [...requiredSet].filter((skill) => !detectedSet.has(skill)).sort();
  const matchPercentage = Number(((matched.length / required.length) * 100).toFixed(2));

  return {
    matched,
    missing,
    match_percentage: matchPercentage,
    matched_count: matched.length,
    required_count: required.length
  };
}

function tokenize(text) {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "of", "to", "in", "for", "on", "with", "at", "by", "from", "is", "are", "was", "were", "be", "as", "that", "this", "it", "your", "you"
  ]);
  return (text.toLowerCase().match(/[a-z0-9+#.]+/g) || []).filter((token) => token.length > 1 && !stopWords.has(token));
}

function tfVector(tokens) {
  const map = new Map();
  for (const token of tokens) {
    map.set(token, (map.get(token) || 0) + 1);
  }
  const total = tokens.length || 1;
  for (const [key, value] of map.entries()) {
    map.set(key, value / total);
  }
  return map;
}

function cosineSimilarity(mapA, mapB) {
  const keys = new Set([...mapA.keys(), ...mapB.keys()]);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const key of keys) {
    const a = mapA.get(key) || 0;
    const b = mapB.get(key) || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function calculateResumeSimilarity(resumeText, jobDescription) {
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobDescription);
  const score = cosineSimilarity(tfVector(resumeTokens), tfVector(jobTokens));
  return Number((score * 100).toFixed(2));
}

function createUser(username, password, phoneNumber = null, email = null) {
  return (async () => {
    try {
      // Check for existing user
      const existing = await User.findOne({
        $or: [
          { username: username },
          ...(phoneNumber ? [{ phone_number: phoneNumber }] : []),
          ...(email ? [{ email: email }] : [])
        ]
      });

      if (existing) return null;

      const id = uuidv4();
      const createdAt = new Date();
      const passwordHash = bcrypt.hashSync(password, 10);
      const finalUsername = username || `user_${id.slice(0, 8)}`;

      const user = new User({
        id,
        username: finalUsername,
        email: email || null,
        phone_number: phoneNumber || null,
        password_hash: passwordHash,
        created_at: createdAt,
        updated_at: createdAt
      });

      await user.save();
      return { id, username: finalUsername, email, phone_number: phoneNumber, created_at: createdAt };
    } catch (error) {
      console.error("createUser error:", error);
      return null;
    }
  })();
}

async function authenticateUser(identifier, password) {
  try {
    if (!identifier) return null;
    const clean = String(identifier).trim();
    const phoneLike = clean.replace(/[+-]/g, "").replace(/\s/g, "").match(/^\d+$/);

    let user;
    if (phoneLike) {
      user = await User.findOne({ phone_number: clean });
    }
    if (!user) {
      user = await User.findOne({
        $or: [
          { username: clean },
          { email: clean }
        ]
      });
    }
    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password_hash)) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      created_at: user.created_at
    };
  } catch (error) {
    console.error("authenticateUser error:", error);
    return null;
  }
}

async function saveAnalysis(userId, analysis) {
  try {
    const id = uuidv4();
    const timestamp = new Date();
    
    const analysisRecord = new Analysis({
      id,
      user_id: userId,
      timestamp,
      job_role: analysis.job_role,
      tfidf_score: Number(analysis.tfidf_score || 0),
      ats_score: Number(analysis.ats_score || 0),
      skill_match_json: JSON.stringify(analysis.skill_match || {}),
      recommendation: analysis.recommendation || "",
      analysis_json: JSON.stringify(analysis),
      resume_url: analysis.resume_url || "",
      created_at: timestamp
    });

    await analysisRecord.save();
    return { id, timestamp };
  } catch (error) {
    console.error("saveAnalysis error:", error);
    throw error;
  }
}

async function createPasswordReset(identifier) {
  try {
    const clean = String(identifier || "").trim();
    if (!clean) return null;
    let user;

    if (clean.includes("@")) {
      user = await User.findOne({ email: clean });
    }
    if (!user && clean.replace(/[+-]/g, "").replace(/\s/g, "").match(/^\d+$/)) {
      user = await User.findOne({ phone_number: clean });
    }
    if (!user) {
      user = await User.findOne({ username: clean });
    }
    if (!user) return null;

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const now = new Date();
    const expires = new Date(now.getTime() + 60 * 60 * 1000);

    // Remove old resets for this user
    await PasswordReset.deleteMany({ user_id: user.id });

    const reset = new PasswordReset({
      id: uuidv4(),
      user_id: user.id,
      token: otpCode,
      identifier: clean,
      expires_at: expires,
      created_at: now
    });
    await reset.save();

    return {
      otp: otpCode,
      email: user.email || clean
    };
  } catch (error) {
    console.error("createPasswordReset error:", error);
    return null;
  }
}

async function verifyPasswordResetOtp(identifier, otpCode) {
  try {
    const clean = String(identifier || "").trim();
    const code = String(otpCode || "").trim();
    if (!clean || !code) {
      return { ok: false, error: "email and otp required" };
    }

    let user = null;
    if (clean.includes("@")) {
      user = await User.findOne({ email: clean });
    }
    if (!user && clean.replace(/[+-]/g, "").replace(/\s/g, "").match(/^\d+$/)) {
      user = await User.findOne({ phone_number: clean });
    }
    if (!user) {
      user = await User.findOne({ username: clean });
    }
    if (!user) {
      return { ok: false, error: "user not found" };
    }

    const row = await PasswordReset.findOne({ user_id: user.id, token: code });
    if (!row) {
      return { ok: false, error: "invalid otp" };
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await PasswordReset.deleteOne({ _id: row._id });
      return { ok: false, error: "expired otp" };
    }

    const resetTicket = uuidv4().replace(/-/g, "");
    row.reset_ticket = resetTicket;
    row.reset_ticket_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    row.verified_at = new Date();
    await row.save();

    return { ok: true, reset_ticket: resetTicket };
  } catch (error) {
    console.error("verifyPasswordResetOtp error:", error);
    return { ok: false, error: error.message };
  }
}

async function resetPasswordWithToken(token, newPassword, identifier = null, resetTicket = null) {
  try {
    let row = null;

    if (resetTicket) {
      row = await PasswordReset.findOne({ reset_ticket: resetTicket });
    } else {
      row = await PasswordReset.findOne({ token: token });
    }
    if (!row) return false;

    if (resetTicket) {
      if (!row.reset_ticket_expires_at || new Date(row.reset_ticket_expires_at).getTime() < Date.now()) {
        await PasswordReset.deleteOne({ _id: row._id });
        return false;
      }
    }

    if (identifier) {
      const clean = String(identifier).trim();
      const user = await User.findOne({ id: row.user_id });
      const matchesIdentifier = user && (
        user.email === clean ||
        user.username === clean ||
        user.phone_number === clean
      );
      if (!matchesIdentifier) {
        return false;
      }
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await PasswordReset.deleteOne({ _id: row._id });
      return false;
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    const user = await User.findOne({ id: row.user_id });
    if (!user) return false;
    
    user.password_hash = hash;
    user.updated_at = new Date();
    await user.save();

    await PasswordReset.deleteOne({ _id: row._id });
    return true;
  } catch (error) {
    console.error("resetPasswordWithToken error:", error);
    return false;
  }
}

app.get("/", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  return res.render("index.html", { job_roles: getAllJobRoles() });
});

app.post("/analyze", uploadHandler.single("resume"), async (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const file = req.file;
    const jobRole = req.body.job_role || "";

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }
    if (!allowedFile(file.originalname)) {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }
    if (!getAllJobRoles().includes(jobRole)) {
      return res.status(400).json({ error: "Invalid job role" });
    }

    // Handle both Cloudinary and memory storage
    let buffer;
    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.secure_url) {
      // If using Cloudinary, we'd need to fetch the file or process differently
      // For now, we'll require buffer for PDF parsing
      return res.status(400).json({ error: "File upload processing failed" });
    }

    const parsed = await pdfParse(buffer);
    const resumeText = cleanText(parsed.text || "");
    if (!resumeText) {
      return res.status(400).json({ error: "Could not extract text from PDF. Ensure it is not scanned." });
    }

    const contact = getContactInfo(resumeText);
    const detectedSkills = extractSkillsFromText(resumeText, jobRole);
    const skillMatch = analyzeSkillMatch(detectedSkills, jobRole);
    const tfidfScore = calculateResumeSimilarity(resumeText, getJobDescription(jobRole));

    const topMissingSkills = skillMatch.missing.slice(0, 10);
    const resources = {};
    for (const skill of topMissingSkills) {
      resources[skill] = getLearningResource(skill);
    }

    // Calculate true ATS Score (weighted combination)
    // ATS systems typically weight skills heavily (65%) and keyword relevance (35%)
    const atsScore = Number((
      (skillMatch.match_percentage * 0.65) + 
      (tfidfScore * 0.35)
    ).toFixed(2));

    let recommendation;
    let level;
    if (atsScore >= 75) {
      recommendation = "Excellent match! You are well-qualified for this role. ✅";
      level = "excellent";
    } else if (atsScore >= 60) {
      recommendation = "Good match! With minor skill improvements, you'll be competitive. 👍";
      level = "good";
    } else if (atsScore >= 40) {
      recommendation = "Moderate match. Focus learning on key missing skills. 📚";
      level = "moderate";
    } else {
      recommendation = "Significant skill gaps. Consider extensive preparation. ⚠️";
      level = "weak";
    }

    const results = {
      job_role: jobRole,
      contact,
      skill_match: skillMatch,
      tfidf_score: tfidfScore,
      ats_score: atsScore,
      detected_skills: detectedSkills,
      resources,
      recommendation,
      level
    };

    try {
      await saveAnalysis(req.session.user_id, {
        job_role: jobRole,
        tfidf_score: tfidfScore,
        ats_score: atsScore,
        skill_match: skillMatch,
        recommendation,
        detected_skills: detectedSkills,
        resume_url: file.secure_url || ""
      });
    } catch (error) {
      // best-effort history save
      console.error("Failed to save analysis:", error);
    }

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: `Processing error: ${error.message}` });
  }
});

// Job Description Match API
app.post("/api/analyze-job-match", (req, res) => {
  try {
    const { resume_text, job_description, detected_skills } = req.body;

    if (!resume_text || !job_description) {
      return res.status(400).json({ error: "Resume text and job description are required" });
    }

    // Extract keywords from job description
    const jdKeywords = extractKeywords(job_description);
    const resumeKeywords = extractKeywords(resume_text);
    
    // Calculate match percentage
    const matched = jdKeywords.filter(keyword => 
      resumeKeywords.includes(keyword) || 
      resume_text.toLowerCase().includes(keyword.toLowerCase()) ||
      (detected_skills && detected_skills.some(skill => 
        skill.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(skill.toLowerCase())
      ))
    );

    const matchPercentage = jdKeywords.length > 0 
      ? Math.round((matched.length / jdKeywords.length) * 100)
      : 0;

    // Find missing keywords
    const missingKeywords = jdKeywords.filter(keyword => !matched.includes(keyword));

    // Generate suggestions
    const suggestions = generateMatchSuggestions(
      missingKeywords.slice(0, 5),
      resume_text,
      job_description
    );

    return res.json({
      match_percentage: Math.min(100, Math.max(0, matchPercentage)),
      total_keywords: jdKeywords.length,
      matched_keywords: matched.length,
      missing_keywords: missingKeywords.slice(0, 20),
      suggestions: suggestions
    });

  } catch (error) {
    console.error('Job match error:', error);
    return res.status(500).json({ error: `Analysis error: ${error.message}` });
  }
});

// Helper function to extract keywords from text
function extractKeywords(text) {
  if (!text) return [];
  
  // Common words to ignore
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'has', 'have', 'had', 'do',
    'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must',
    'by', 'from', 'as', 'that', 'which', 'who', 'what', 'where', 'when', 'why', 'how',
    'if', 'we', 'you', 'he', 'she', 'it', 'they', 'them', 'their', 'this', 'these',
    'that', 'those', 'about', 'above', 'after', 'before', 'between', 'during', 'under',
    'your', 'our', 'our', 'its', 'more', 'most', 'through', 'into', 'during', 'including'
  ]);

  // Extract words, clean them
  const words = text
    .toLowerCase()
    .match(/\b[\w\-]+\b/g) || [];

  // Filter and deduplicate
  const keywords = new Set();
  words.forEach(word => {
    if (word.length > 2 && !stopwords.has(word)) {
      keywords.add(word);
    }
  });

  return Array.from(keywords);
}

// Helper function to generate improvement suggestions
function generateMatchSuggestions(missingKeywords, resumeText, jobDescription) {
  const suggestions = [];

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 3).join(', ');
    suggestions.push(`Add mentions of: ${topMissing}`);
  }

  // Check for common patterns
  if (!resumeText.toLowerCase().includes('achievement') && 
      jobDescription.toLowerCase().includes('achievement')) {
    suggestions.push('Highlight specific achievements and measurable results in your resume');
  }

  if (!resumeText.toLowerCase().includes('experience') && 
      jobDescription.toLowerCase().includes('experience')) {
    suggestions.push('Emphasize your direct experience with the required technologies');
  }

  if (jobDescription.toLowerCase().includes('project') && 
      !resumeText.toLowerCase().includes('project')) {
    suggestions.push('Include details about projects you\'ve worked on');
  }

  // Generic suggestions if not enough specific ones
  if (suggestions.length < 3) {
    suggestions.push('Tailor your experience section to align with job requirements');
    suggestions.push('Use same terminology as in the job description');
    suggestions.push('Quantify your accomplishments with metrics and numbers');
  }

  return suggestions.slice(0, 4);
}

app.get("/about", (req, res) => res.render("index.html", { job_roles: getAllJobRoles() }));
app.get("/login", (req, res) => res.render("login.html"));
app.get("/preview", (req, res) => res.render("preview.html", { job_roles: getAllJobRoles() }));
app.get("/signup", (req, res) => res.render("signup.html"));

app.get("/skill-test/:skill", (req, res) => {
  try {
    const skill = req.params.skill;
    const questions = getSkillQuestions(skill);
    if (!questions.length) {
      return res.status(404).json({ error: "No questions available for this skill" });
    }

    const questionsToSend = questions.map((q) => ({ question: q.question, options: q.options }));
    return res.json({ skill, questions: questionsToSend, total: questionsToSend.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const data = req.body || {};
    const username = data.username || null;
    const password = data.password;
    const phone = data.phone || null;
    const email = data.email || (username && username.includes("@") ? username : null);

    if (!password || (!username && !phone && !email)) {
      return res.status(400).json({ error: "provide password and username, phone, or email" });
    }

    const user = await createUser(username, password, phone, email);
    if (!user) {
      return res.status(400).json({ error: "username, phone, or email already exists" });
    }

    req.session.user_id = user.id;
    req.session.username = user.username;
    return res.json({ message: "user created", username: user.username, email: user.email, phone: user.phone_number });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const data = req.body || {};
    const username = data.username;
    const phone = data.phone;
    const password = data.password;
    const identifier = phone || username;

    if (!identifier || !password) {
      return res.status(400).json({ error: "identifier (username or phone) and password required" });
    }

    const user = await authenticateUser(identifier, password);
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    req.session.user_id = user.id;
    req.session.username = user.username;
    return res.json({ message: "logged in", username: user.username, phone: user.phone_number });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/request-otp", (req, res) => res.status(410).json({ error: "OTP login is disabled" }));
app.post("/verify-otp", (req, res) => res.status(410).json({ error: "OTP login is disabled" }));

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  req.session.username = null;
  return res.json({ message: "logged out" });
});

app.get("/forgot-password", (req, res) => res.render("forgot_password.html"));

app.post("/forgot-password", async (req, res) => {
  const data = req.body || {};
  const identifier = data.email || data.identifier;
  if (!identifier) {
    return res.status(400).json({ error: "email required" });
  }

  try {
    const resetData = await createPasswordReset(identifier);
    if (!resetData) {
      return res.status(404).json({ error: "user not found" });
    }
    try {
      const emailResult = await sendResetEmail(resetData.email, resetData.otp);
      if (emailResult.sent) {
        return res.json({ message: "reset_created", sent: true, preview: emailResult.preview || null });
      }
      return res.json({ message: "reset_created", sent: false, otp: resetData.otp, info: emailResult.reason });
    } catch (mailError) {
      return res.json({ message: "reset_created", sent: false, otp: resetData.otp, info: mailError.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/verify-reset-otp", async (req, res) => {
  const data = req.body || {};
  const identifier = data.email || data.identifier;
  const otp = data.otp;

  if (!identifier || !otp) {
    return res.status(400).json({ error: "email and otp required" });
  }

  try {
    const result = await verifyPasswordResetOtp(identifier, otp);
    if (!result.ok) {
      return res.status(400).json({ error: result.error || "invalid or expired otp" });
    }
    return res.json({ message: "otp_verified", reset_ticket: result.reset_ticket });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/reset-password", (req, res) => {
  const token = req.query.token || "";
  const email = req.query.email || "";
  return res.render("reset_password.html", { token, email });
});

app.post("/reset-password", async (req, res) => {
  const data = req.body || {};
  const token = data.token;
  const otp = data.otp;
  const identifier = data.email || data.identifier;
  const resetTicket = data.reset_ticket;
  const newPassword = data.password;

  if (!newPassword) {
    return res.status(400).json({ error: "password required" });
  }

  const verificationCode = otp || token;
  if (!verificationCode && !resetTicket) {
    return res.status(400).json({ error: "otp or reset_ticket required" });
  }

  if (otp && !identifier && !resetTicket) {
    return res.status(400).json({ error: "email required with otp" });
  }

  try {
    const ok = await resetPasswordWithToken(verificationCode, newPassword, identifier || null, resetTicket || null);
    if (!ok) {
      return res.status(400).json({ error: "invalid or expired otp" });
    }
    return res.json({ message: "password_reset" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/user", (req, res) => {
  if (!req.session.user_id) {
    return res.json({ user: null });
  }

  const store = loadStore();
  const found = store.users.find((row) => row.id === req.session.user_id);
  const user = found ? { username: found.username, phone_number: found.phone_number } : null;
  if (!user) {
    return res.json({ user: null });
  }
  return res.json({ user });
});

app.get("/history", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  return res.render("history.html");
});

app.get("/api/history", async (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.status(401).json({ error: "not authenticated" });
  }

  try {
    const found = await User.findOne({ id: userId });
    const user = found ? { username: found.username, phone_number: found.phone_number } : null;
    if (!user) {
      return res.json({ user: null, analyses: [] });
    }

    const analyses = await Analysis.find({ user_id: userId })
      .sort({ timestamp: 1 });
      
    const analysesData = analyses.map((a) => {
      let skillMatch = {};
      let analysisJson = {};
      try {
        skillMatch = a.skill_match_json ? JSON.parse(a.skill_match_json) : {};
      } catch (error) {
        skillMatch = {};
      }
      try {
        analysisJson = a.analysis_json ? JSON.parse(a.analysis_json) : {};
      } catch (error) {
        analysisJson = {};
      }

      const skills = Array.isArray(analysisJson.detected_skills) ? analysisJson.detected_skills : [];
      const missing = Array.isArray(skillMatch.missing) ? skillMatch.missing : [];
      const matchPct = Number(skillMatch.match_percentage || 0);

      return {
        id: a.id,
        timestamp: a.timestamp || "",
        job_role: a.job_role || "Unknown",
        tfidf_score: Number(a.tfidf_score || 0),
        ats_score: Number(a.ats_score || 0),
        skill_match: matchPct ? matchPct / 100 : 0,
        skills_count: skills.length,
        skills,
        missing_skills: missing
      };
    });

    return res.json({ user, analyses: analysesData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/check-answers", (req, res) => {
  try {
    const data = req.body || {};
    const skill = data.skill;
    const answers = data.answers || [];
    const questions = getSkillQuestions(skill);

    if (!questions.length || answers.length !== questions.length) {
      return res.status(400).json({ error: "Invalid test data" });
    }

    let correct = 0;
    const results = questions.map((question, index) => {
      const userAnswer = Number(answers[index]);
      const isCorrect = userAnswer === question.correct;
      if (isCorrect) correct += 1;
      return {
        question: question.question,
        user_answer: question.options[userAnswer] || "",
        correct_answer: question.options[question.correct],
        is_correct: isCorrect
      };
    });

    const score = Number(((correct / questions.length) * 100).toFixed(2));
    return res.json({
      skill,
      score,
      correct,
      total: questions.length,
      results,
      passed: score >= 70
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/debug/users", (req, res) => {
  const secret = req.query.secret;
  if (secret !== (process.env.DEBUG_SECRET || "debug-secret-change-me")) {
    return res.status(403).json({ error: "unauthorized" });
  }

  try {
    const store = loadStore();
    const users = store.users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      created_at: user.created_at
    }));
    return res.json({ total: users.length, users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/debug/delete-all-users", (req, res) => {
  const secret = req.query.secret;
  if (secret !== (process.env.DEBUG_SECRET || "debug-secret-change-me")) {
    return res.status(403).json({ error: "unauthorized" });
  }

  try {
    const store = loadStore();
    const deleted = store.users.length;
    const deletedAnalyses = store.analyses.length;
    store.users = [];
    store.analyses = [];
    store.password_resets = [];
    saveStore(store);
    return res.json({ deleted, deleted_analyses: deletedAnalyses });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large. Maximum size is 5MB." });
  }
  return next(err);
});

app.use((req, res) => {
  res.status(404).json({ error: "Page not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 8080);

// Start server with MongoDB connection
async function startServer() {
  await connectMongoDB();
  app.listen(port, "0.0.0.0", () => {
    console.log(`✓ Resume Analyzer server listening on ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});