// --- 1. Moving Background Particles ---
const canvas = document.getElementById('cyber-bg');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.radius = 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }
}

for (let i = 0; i < 40; i++) particles.push(new Particle());

function animateBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 100})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateBackground);
}
animateBackground();

// --- 2. Quiz Logic & 10 Neutral Scenarios ---
let userName = "";
let userEmail = "";
let currentIndex = 0;
let userAnswers = [];

const scenarios = [
  {
    category: "SCENARIO 1 OF 10",
    prompt: "A surprise email lands in your inbox offering an expensive gift for free...",
    subject: "🎁 Claim Your Free High-Speed Kitchen Blender!",
    senderName: "Kitchen Rewards Club",
    senderEmail: "rewards@claim-free-kitchenware-today.com",
    avatar: "🎁",
    hoverUrl: "http://claim-free-kitchenware-today.com/claim?user=id",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Congratulations ${name}!</p>
      <div class="scam-banner">
        <h4>🎉 YOU HAVE WON A FREE KITCHEN BLENDER! 🎉</h4>
        <p>Claim within 24 hours or your prize will be given to someone else!</p>
      </div>
      <p>Your email address (<strong>${email}</strong>) was chosen in our monthly giveaway.</p>
      <p>Click below to pay $1.99 shipping and receive your blender tomorrow:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://claim-free-kitchenware-today.com/claim?user=id')">Claim Your Blender Now</a></p>
    `,
    what: "Fake Prize / Lottery Scam (Phishing). Scammers use too-good-to-be-true offers to make you act quickly.",
    why: "The sender domain `claim-free-kitchenware-today.com` is a fake website. Unsolicited emails asking for shipping fees to claim prizes are almost always fake.",
    solution: "Never click the link or pay any fees. Immediately mark the email as spam and delete it."
  },
  {
    category: "SCENARIO 2 OF 10",
    prompt: "Uh oh! You receive a high-urgency email warning that your cloud storage is full...",
    subject: "⚠️ Warning: Your Cloud Storage is 99% Full!",
    senderName: "Cloud Storage Alert",
    senderEmail: "no-reply@cloud-storage-upgrade-help.com",
    avatar: "☁️",
    hoverUrl: "http://cloud-storage-upgrade-help.com/buy-space",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Hi ${name},</p>
      <p>Your storage account for <strong>${email}</strong> has reached 99% capacity. You will stop receiving emails and backup files in 12 hours.</p>
      <p>Get 1 TB of extra storage today for only $0.99 to prevent permanent data deletion.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://cloud-storage-upgrade-help.com/buy-space')">Upgrade Storage Now</a></p>
    `,
    what: "Urgent Storage Scam. Attackers create artificial panic about losing your personal photos and emails.",
    why: "Look at the destination domain `cloud-storage-upgrade-help.com`. Real cloud providers use their main official web domain (like google.com or icloud.com).",
    solution: "Do not click links inside panicky storage emails. Open your cloud provider's official app or website directly to check your real storage usage."
  },
  {
    category: "SCENARIO 3 OF 10",
    prompt: "You get a sudden alert claiming someone tried signing into your account from overseas...",
    subject: "Security Notice: Unusual Sign-In Detected",
    senderName: "Security Team",
    senderEmail: "no-reply@accounts-security-verify.com",
    avatar: "🔒",
    hoverUrl: "http://accounts-security-verify.com/login",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Dear ${name},</p>
      <p>We noticed an unrecognized sign-in attempt to your account (<strong>${email}</strong>) from another country.</p>
      <p>If this was not you, please click below to secure your password immediately:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://accounts-security-verify.com/login')">Secure Account Now</a></p>
    `,
    what: "Account Credential Theft (Phishing). The attacker wants you to click and enter your password on a fake login page.",
    why: "The sender domain `accounts-security-verify.com` is fake. Legitimate companies never send security notices from generic third-party domains.",
    solution: "Never click password reset buttons in unexpected emails. Go directly to the official platform homepage to manage your security."
  },
  {
    category: "SCENARIO 4 OF 10",
    prompt: "You open your email to find a purchase receipt for something you don't remember buying...",
    subject: "Receipt for Your Recent Order #48291",
    senderName: "Online Store Billing",
    senderEmail: "billing@receipt-processing-center.org",
    avatar: "📄",
    hoverUrl: "http://receipt-processing-center.org/invoice",
    hasAttachment: true,
    fileName: "Order_Receipt.pdf.exe",
    fileSize: "1.5 MB",
    fileIcon: "⚙️",
    isAttack: true,
    body: (name) => `
      <p>Hello ${name},</p>
      <p>Thank you for your purchase of $499.00! Your payment was successful.</p>
      <p>Please open the attached PDF receipt file below to view your full transaction breakdown.</p>
    `,
    what: "Malware Infection via Attachment. Opening executable files gives hackers control of your device.",
    why: "Check the file extension: `Order_Receipt.pdf.exe`. Double extensions ending in `.exe` are executable virus programs, not document files.",
    solution: "Never download or open attachments ending in `.exe`, `.bat`, or `.vbs`. Delete the email right away."
  },
  {
    category: "SCENARIO 5 OF 10",
    prompt: "You receive a notification that a teammate shared a project document with you...",
    subject: "Document Shared With You",
    senderName: "Google Docs",
    senderEmail: "comments-noreply@docs.google.com",
    avatar: "📄",
    hoverUrl: "https://docs.google.com/document/d/12345/edit",
    hasAttachment: false,
    isAttack: false,
    body: (name) => `
      <p>Hi ${name},</p>
      <p>A colleague shared a document titled <strong>"Project Outline 2026"</strong> with you.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('https://docs.google.com/document/d/12345/edit')">Open in Google Docs</a></p>
    `,
    what: "This is a Legitimate System Notification.",
    why: "The sender domain (`@docs.google.com`) and the destination link both point directly to official, secure `google.com` servers.",
    solution: "This message is safe to open and access."
  },
  {
    category: "SCENARIO 6 OF 10",
    prompt: "A flashing message warns that your computer is infected with 3 severe viruses...",
    subject: "CRITICAL: Computer Virus Detected on Your System",
    senderName: "Antivirus Emergency Team",
    senderEmail: "help@antivirus-fix-now.net",
    avatar: "⚠️",
    hoverUrl: "http://antivirus-fix-now.net/fix.exe",
    hasAttachment: true,
    fileName: "Clean_Virus_Now.exe",
    fileSize: "8.2 MB",
    fileIcon: "🔒",
    isAttack: true,
    body: (name, email) => `
      <p>Warning ${name}!</p>
      <p>Our system detected 3 severe viruses linked to <strong>${email}</strong>. Your personal files will be encrypted within 1 hour.</p>
      <p>Run the attached emergency cleanup tool immediately to protect your computer.</p>
    `,
    what: "Ransomware / Fake Antivirus Scam. It tricks you into installing harmful software that locks your files.",
    why: "Antivirus software cannot scan your computer remotely via email. The attached `.exe` file is actually the harmful virus itself.",
    solution: "Do not open the attachment. Run a scan using your computer's built-in security software (e.g., Windows Defender) instead."
  },
  {
    category: "SCENARIO 7 OF 10",
    prompt: "You get a text-style email saying a courier couldn't deliver your package today...",
    subject: "Delivery Failed: Address Confirmation Needed",
    senderName: "Express Parcel Service",
    senderEmail: "tracking@postal-redelivery-update.com",
    avatar: "📦",
    hoverUrl: "http://postal-redelivery-update.com/track",
    hasAttachment: false,
    isAttack: true,
    body: (name) => `
      <p>Hello ${name},</p>
      <p>We tried to deliver your parcel today, but nobody was home. A small redelivery fee of $1.50 is required.</p>
      <p>Please update your home address and pay the fee using the link below:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://postal-redelivery-update.com/track')">Update Delivery Details</a></p>
    `,
    what: "Parcel Delivery Payment Scam. Designed to harvest your credit card details and address.",
    why: "The link destination `postal-redelivery-update.com` is a fake third-party domain, not an official postal agency.",
    solution: "Check tracking numbers directly on the official postal website. Never enter payment information via email links."
  },
  {
    category: "SCENARIO 8 OF 10",
    prompt: "You are sitting in a local cafe and receive an email asking you to re-authenticate Wi-Fi...",
    subject: "Coffee Shop Guest Wi-Fi Re-Connect",
    senderName: "Public Wi-Fi Admin",
    senderEmail: "portal@free-wifi-login-page.com",
    avatar: "📶",
    hoverUrl: "http://192.168.1.1/login-form",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Hi ${name},</p>
      <p>Your public Wi-Fi connection for <strong>${email}</strong> has timed out. Enter your email password to stay connected.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://192.168.1.1/login-form')">Reconnect to Wi-Fi</a></p>
    `,
    what: "Fake Wi-Fi Portal Attack (Man-in-the-Middle). Captures passwords over unencrypted public connections.",
    why: "Public Wi-Fi networks do not ask for personal email passwords to maintain an internet connection. The connection link is also unencrypted (`http://`).",
    solution: "Disconnect from untrusted public networks and avoid typing personal passwords into pop-up portals."
  },
  {
    category: "SCENARIO 9 OF 10",
    prompt: "You get a routine monthly subscription invoice for a service you use...",
    subject: "Your Monthly Subscription Receipt",
    senderName: "Streaming Music Service",
    senderEmail: "receipts@streaming-service.com",
    avatar: "🎵",
    hoverUrl: "https://streaming-service.com/account/receipts",
    hasAttachment: false,
    isAttack: false,
    body: (name) => `
      <p>Hi ${name},</p>
      <p>Your payment of $9.99 for this month's music subscription was successful.</p>
      <p>You can view your account history anytime on our official website.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('https://streaming-service.com/account/receipts')">View Account History</a></p>
    `,
    what: "This is a Legitimate Receipt.",
    why: "The email uses standard confirmation language, doesn't demand urgent action, and links directly to the official `https://` secure website domain.",
    solution: "No action required. You can keep this receipt for your records."
  },
  {
    category: "SCENARIO 10 OF 10",
    prompt: "An urgent message arrives claiming your debit card has been frozen due to fraud...",
    subject: "URGENT: Your Bank Account Has Been Frozen!",
    senderName: "Bank Account Security",
    senderEmail: "alert@banking-security-update-center.com",
    avatar: "🏦",
    hoverUrl: "http://banking-security-update-center.com/verify",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Dear Customer ${name},</p>
      <p>Due to suspicious activity linked to <strong>${email}</strong>, your bank card has been temporarily frozen.</p>
      <p>You must confirm your account details within 24 hours to restore full access to your money:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://banking-security-update-center.com/verify')">Unfreeze My Account</a></p>
    `,
    what: "Banking Phishing Attack. A high-urgency trap meant to steal credit card numbers and PINs.",
    why: "Real banks will never email you a direct web link asking you to verify sensitive credentials or unfreeze an account.",
    solution: "Ignore the link. Call the official phone number listed on the back of your bank card to verify any account issues."
  }
];

function startQuiz(e) {
  e.preventDefault();
  userName = document.getElementById("username").value.trim();
  userEmail = document.getElementById("useremail").value.trim();

  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("training-screen").classList.remove("hidden");
  loadScenario();
}

function loadScenario() {
  const s = scenarios[currentIndex];
  
  document.getElementById("scenario-tracker-tag").innerText = s.category;
  document.getElementById("tracker-text").innerText = `Page ${currentIndex + 1} of 10`;
  document.getElementById("progress-fill").style.width = `${((currentIndex + 1) / scenarios.length) * 100}%`;
  
  document.getElementById("scenario-prompt").innerText = `"${s.prompt}"`;

  document.getElementById("email-subject").innerText = s.subject;
  document.getElementById("email-sender-name").innerText = s.senderName;
  document.getElementById("email-sender-address").innerText = `<${s.senderEmail}>`;
  document.getElementById("email-recipient-display").innerText = userEmail;
  document.getElementById("email-avatar").innerText = s.avatar;
  
  document.getElementById("email-body-content").innerHTML = s.body(userName, userEmail);
  document.getElementById("hover-url").innerText = s.hoverUrl;

  const attWrapper = document.getElementById("attachment-wrapper");
  if (s.hasAttachment) {
    attWrapper.classList.remove("hidden");
    document.getElementById("file-name").innerText = s.fileName;
    document.getElementById("file-size").innerText = s.fileSize;
    document.getElementById("file-icon-type").innerText = s.fileIcon;
  } else {
    attWrapper.classList.add("hidden");
  }
}

function updateHover(url) {
  document.getElementById("hover-url").innerText = url;
}

function submitAnswer(userThoughtAttack) {
  const s = scenarios[currentIndex];
  const isCorrect = userThoughtAttack === s.isAttack;

  userAnswers.push({
    title: `Scenario ${currentIndex + 1}`,
    isCorrect: isCorrect
  });

  const badge = document.getElementById("feedback-badge");
  badge.innerText = isCorrect ? "CORRECT DECISION" : "INCORRECT DECISION";
  badge.className = `result-badge ${isCorrect ? "correct" : "incorrect"}`;

  document.getElementById("feedback-heading").innerText = isCorrect 
    ? "Spot On! You identified this correctly." 
    : "Watch Out! Here is what happened:";
  
  document.getElementById("feedback-what").innerText = s.what;
  document.getElementById("feedback-why").innerText = s.why;
  document.getElementById("feedback-solution").innerText = s.solution;

  document.getElementById("feedback-modal").classList.remove("hidden");
}

function nextScenario() {
  document.getElementById("feedback-modal").classList.add("hidden");
  currentIndex++;

  if (currentIndex < scenarios.length) {
    loadScenario();
  } else {
    showDashboard();
  }
}

function showDashboard() {
  document.getElementById("training-screen").classList.add("hidden");
  document.getElementById("dashboard-screen").classList.remove("hidden");

  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const pct = Math.round((correctCount / scenarios.length) * 100);

  document.getElementById("dashboard-user-greeting").innerText = `Safety results for ${userName} (${userEmail})`;
  document.getElementById("final-score-val").innerText = `${correctCount}/${scenarios.length}`;
  document.getElementById("final-pct-val").innerText = `${pct}%`;

  let grade = "C";
  if (pct >= 80) grade = "A";
  else if (pct >= 60) grade = "B";
  document.getElementById("final-grade-val").innerText = grade;

  const listEl = document.getElementById("breakdown-list");
  listEl.innerHTML = userAnswers.map((item, index) => `
    <div class="breakdown-item">
      <span>Page ${index + 1}: Scenario ${index + 1}</span>
      <span class="item-status ${item.isCorrect ? 'pass' : 'fail'}">
        ${item.isCorrect ? '✓ Correct' : '✗ Missed'}
      </span>
    </div>
  `).join("");
      }
  
